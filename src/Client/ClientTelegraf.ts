import {Telegraf} from 'telegraf'
import {Client} from '@/types/client'
import {EventNames} from '@/types/event'
import {EventCallback} from '@/types/telegraf'

export default class ClientTelegraf implements Client {
  protected readonly telegraf: Telegraf

  public constructor(tokenBot: string) {
    this.telegraf = new Telegraf(tokenBot)
  }

  public async launch(): Promise<void> {
    await this.telegraf.launch()
  }

  public onCommand(commandName: EventNames, callback: EventCallback): void {
    this.telegraf.command(commandName, callback)
  }

  public onText(callback: EventCallback): void {
    this.telegraf.on('text', callback)
  }

  public onCallbackQuery(callback: EventCallback): void {
    this.telegraf.on('callback_query', context => {

    })
  }

  public stop(): void {
    this.telegraf.stop()
  }
}
