import {EventCallback} from './telegraf'

export declare class Client {
  public launch(): Promise<void>
  public onCommand(commandName: EventNames, callback: EventCallback): void
  public onText(callback: EventCallback): void
  public stop(): void
}

export enum EventNames {
  start = 'start'
}

export enum EventTypes {
  command = 'command'
}
