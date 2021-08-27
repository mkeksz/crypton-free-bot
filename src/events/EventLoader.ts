import {ClientEvent, EventExecute, EventTypes} from '@/types/event'
import {loadEventsFromDirectory} from './utils'

type Events = {
  commands: ClientEvent[],
  texts: ClientEvent[]
}

export default class EventLoader {
  private readonly events: Events = {commands: [], texts: []}
  private _textComplexExecute: EventExecute = async () => {}
  public get textComplexExecute(): EventExecute {
    return this._textComplexExecute
  }
  public get commands(): ClientEvent[] {
    return [...this.events.commands]
  }

  public async init(): Promise<void> {
    const events = await loadEventsFromDirectory()
    this.filterEvents(events)
    this.updateTextCallback()
  }

  private filterEvents(events: ClientEvent[]): void {
    for (const event of events) {
      if (event.type === EventTypes.text) this.events.texts.push(event)
      else if (event.type === EventTypes.command) this.events.commands.push(event)
    }
  }

  private updateTextCallback(): void {
    this._textComplexExecute = async (context, ...args) => {
      const event = this.events.texts.find(event => event.name === context.message.text)
      await event?.execute(context, ...args)
    }
  }
}
