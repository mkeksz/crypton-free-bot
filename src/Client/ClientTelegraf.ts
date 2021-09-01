import {Telegraf} from 'telegraf'
import {EventCallback, EventNames} from '@/types/event'
import {WebhookCallbackClient} from '@/types/client'

export default class ClientTelegraf {
  private readonly telegraf: Telegraf

  public constructor(tokenBot: string) {
    this.telegraf = new Telegraf(tokenBot)
  }

  public async launch(): Promise<void> {
    await this.telegraf.launch()
  }

  public onCommand(commandName: EventNames, callback: EventCallback<'text'>): void {
    this.telegraf.command(commandName, callback)
  }

  public onText(callback: EventCallback<'text'>): void {
    this.telegraf.on('text', callback)
  }

  public onCallbackQuery(callback: EventCallback<'callback_query'>): void {
    this.telegraf.on('callback_query', callback)
  }

  public async setWebhook(url: string): Promise<void> {
    await this.telegraf.telegram.setWebhook(url)
  }

  public webhookCallback(path: string): WebhookCallbackClient {
    return this.telegraf.webhookCallback(path)
  }

  public stop(): void {
    this.telegraf.stop()
  }
}
