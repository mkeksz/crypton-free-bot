import {ClientEvent, EventExecute, EventTypes} from '@/types/event'
import {getQueryData} from '@/src/events/utils.queryData'
import {loadEventsFromDirectory} from './utils.files'
import {goToMainMenu} from '@/src/events/utils.context'

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
    // TODO сделать отправку сообщения о неизвестной команде и вернуть пользователя в главное меню, если текстовая команда не найдена (это же делать во всех событиях когда ничего не возвращаем)
    this._textComplexExecute = async (context, storage, ...args) => {
      const event = this.events.texts.find(event => event.name === context.message.text)
      if (event) {
        await storage.setStepUser(context.from.id, null)
        await event.execute(context, storage, ...args)
        return
      }

      const step = await storage.getStepUser(context.from.id)
      if (!step) {
        await goToMainMenu(context)
        return
      }

      const eventStep = this.events.texts.find(event => event.name === step.name)
      if (!eventStep) {
        await storage.setStepUser(context.from.id, null)
        await goToMainMenu(context)
        return
      }

      await eventStep.execute(context, storage, ...args)
    }
  }

  private updateCallbackQuery(): void {
    this._callbackQueryComplexExecute = async (context, ...args) => {
      const data = getQueryData(context.callbackQuery)
      const event = this.events.callbacksQuery.find(event => event.name === data?.n)
      if (!event) return
      await event.execute(context, ...args)
    }
  }
}
