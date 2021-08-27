import {EventCallback, EventNames} from '@/types/event'

export declare class Client {
  public launch(): Promise<void>
  public onCommand(commandName: EventNames, callback: EventCallback<'text'>): void
  public onText(callback: EventCallback<'text'>): void
  public stop(): void
}
