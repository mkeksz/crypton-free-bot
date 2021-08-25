import {ClientEvent, EventTypes} from '@/types/event'
import {loadEventsFromDirectory} from './utils'

export default class EventLoader {
  private events: ClientEvent[] = []
  private _commands: ClientEvent[] = []
  public get commands() {
    return this._commands
  }

  public async init(): Promise<void> {
    this.events = await loadEventsFromDirectory()
    this._commands = this.getCommands()
  }

  private getCommands(): ClientEvent[] {
    return this.events.filter(event => event.type === EventTypes.command)
  }
}
