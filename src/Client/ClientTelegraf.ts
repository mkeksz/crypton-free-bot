import {Telegraf} from 'telegraf'
import {EventCallback, EventNames} from '@/types/event'
import {Client} from '@/types/client'

export default class ClientTelegraf implements Client {
  protected readonly telegraf: Telegraf

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

  public stop(): void {
    this.telegraf.stop()
  }
}
