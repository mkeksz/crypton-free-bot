import {EventCallback} from './telegraf'
import {EventNames} from '@/types/event'

export declare class Client {
  public launch(): Promise<void>
  public onCommand(commandName: EventNames, callback: EventCallback): void
  public stop(): void
}
