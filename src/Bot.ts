import {Client} from '@/types/client'
import ClientTelegraf from '@/src/Client/ClientTelegraf'

export default class Bot {
  private client: Client

  public constructor(tokenBot: string) {
    this.client = new ClientTelegraf(tokenBot)
  }

  public async start(): Promise<void> {
    await this.client.launch()
  }

  public stop(): void {
    this.client.stop()
  }
}
