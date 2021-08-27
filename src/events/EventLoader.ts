import {ClientEvent, EventExecute, EventTypes} from '@/types/event'
import {getDataFromCallbackQuery, loadEventsFromDirectory} from './utils'

type Events = {
  commands: ClientEvent<'text'>[],
  texts: ClientEvent<'text'>[],
  callbacksQuery: ClientEvent<'callback_query'>[]
}

export default class EventLoader {
  private readonly events: Events = {commands: [], texts: [], callbacksQuery: []}
  private _callbackQueryComplexExecute: EventExecute<'callback_query'> = async () => {return}
  public get callbackQueryComplexExecute(): EventExecute<'callback_query'> {
    return this._callbackQueryComplexExecute
  }
  private _textComplexExecute: EventExecute<'text'> = async () => {return}
  public get textComplexExecute(): EventExecute<'text'> {
    return this._textComplexExecute
  }
  public get commands(): ClientEvent<'text'>[] {
    return [...this.events.commands]
  }

  public async init(): Promise<void> {
    const events = await loadEventsFromDirectory()
    this.filterEvents(events)
    this.updateTextCallback()
    this.updateCallbackQuery()
  }

  private filterEvents(events: ClientEvent[]): void {
    for (const event of events) {
      if (event.type === EventTypes.text) this.events.texts.push(event as ClientEvent<'text'>)
      else if (event.type === EventTypes.command) this.events.commands.push(event as ClientEvent<'text'>)
      else if (event.type === EventTypes.callbackQuery) this.events.callbacksQuery.push(event as ClientEvent<'callback_query'>)
    }
  }

  private updateTextCallback(): void {
    this._textComplexExecute = async (context, ...args) => {
      const event = this.events.texts.find(event => event.name === context.message.text)
      await event?.execute(context, ...args)
    }
  }

  private updateCallbackQuery(): void {
    this._callbackQueryComplexExecute = async (context, ...args) => {
      const data = getDataFromCallbackQuery(context.callbackQuery)
      const event = this.events.callbacksQuery.find(event => event.name === data?.n)
      await event?.execute(context, ...args)
    }
  }
}
