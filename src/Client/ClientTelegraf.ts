import {Telegraf} from 'telegraf'
import {EventCallback} from '@/types/telegraf'
import {Client, EventNames} from '@/types/client'

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

  public stop(): void {
    this.telegraf.stop()
  }
}
