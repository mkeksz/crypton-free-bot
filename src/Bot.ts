import {EventCallback, EventContext, EventExecute, TypeContext} from '@/types/event'
import StoragePrisma from '@/src/Storage/StoragePrisma'
import ClientTelegraf from './Client/ClientTelegraf'
import EventLoader from './events/EventLoader'
import {Storage} from '@/types/storage'
import {WebhookCallbackClient} from '@/types/client'

export default class Bot {
  private readonly client: ClientTelegraf
  private readonly storage: Storage
  private readonly eventLoader: EventLoader
  private readonly webhookURL?: string

  public constructor(tokenBot: string, webhookURL?: string) {
    this.client = new ClientTelegraf(tokenBot)
    this.storage = new StoragePrisma()
    this.eventLoader = new EventLoader()
    this.webhookURL = webhookURL
  }

  public async start(): Promise<boolean> {
    await this.eventLoader.init()
    this.startHandlingCommands()
    this.startHandlingTexts()
    this.startHandlingCallbackQuery()
    if (this.webhookURL) {
      await this.client.setWebhook(this.webhookURL)
      return true
    }
    else {
      await this.client.launch()
      return false
    }
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

  private startHandlingCallbackQuery(): void {
    const callback = this.convertToEventCallback(this.eventLoader.callbackQueryComplexExecute)
    this.client.onCallbackQuery(callback)
  }

  private convertToEventCallback<T extends TypeContext>(execute: EventExecute<T>): EventCallback<T> {
    return (context: EventContext<T>) => execute(context, this.storage)
  }

  public webhookCallback(path: string): WebhookCallbackClient {
    return this.client.webhookCallback(path)
  }

  public stop(): void {
    this.client.stop()
  }
}
