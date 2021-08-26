import ClientTelegraf from './Client/ClientTelegraf'
import {EventCallback} from '@/types/telegraf'
import EventLoader from './events/EventLoader'
import {EventExecute} from '@/types/event'
import {Client} from '@/types/client'

export default class Bot {
  protected readonly client: Client
  private readonly eventLoader: EventLoader

  public constructor(tokenBot: string) {
    this.client = new ClientTelegraf(tokenBot)
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

  private convertToEventCallback(execute: EventExecute): EventCallback {
    return context => execute(context)
  }

  public stop(): void {
    this.client.stop()
  }
}
