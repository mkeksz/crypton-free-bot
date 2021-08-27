import {EventCallback, EventContext, EventExecute, TypeContext} from '@/types/event'
import StoragePrisma from '@/src/Storage/StoragePrisma'
import ClientTelegraf from './Client/ClientTelegraf'
import EventLoader from './events/EventLoader'
import {Storage} from '@/types/storage'
import {Client} from '@/types/client'

export default class Bot {
  protected readonly client: Client
  protected readonly storage: Storage
  private readonly eventLoader: EventLoader

  public constructor(tokenBot: string) {
    this.client = new ClientTelegraf(tokenBot)
    this.storage = new StoragePrisma()
    this.eventLoader = new EventLoader()
  }

  public async start(): Promise<void> {
    await this.eventLoader.init()
    await this.client.launch()
    this.startHandlingCommands()
    this.startHandlingTexts()
  }

  private startHandlingCommands(): void {
    for (const command of this.eventLoader.commands) {
      const callback = this.convertToEventCallback(command.execute)
      this.client.onCommand(command.name, callback)
    }
  }

  private startHandlingTexts(): void {
    const callback = this.convertToEventCallback(this.eventLoader.textComplexExecute)
    this.client.onText(callback)
  }

  private convertToEventCallback<T extends TypeContext>(execute: EventExecute<T>): EventCallback<T> {
    return (context: EventContext<T>) => execute(context, this.storage)
  }

  public stop(): void {
    this.client.stop()
  }
}
