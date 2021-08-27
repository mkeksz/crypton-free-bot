import {EventContext} from '@/types/telegraf'
import {EventNames} from '@/types/event'
import TestClient from './TestClient'
import Bot from '@/src/Bot'
import TestStorage from './TestStorage'

export default class TestBot extends Bot {
  protected readonly client: TestClient
  public readonly storage: TestStorage

  public constructor() {
    super('fake-token')
    this.client = new TestClient()
    this.storage = new TestStorage()
  }

  public async sendCommand(commandName: EventNames, fakeContext: EventContext): Promise<void> {
    await this.client.executeCommand(commandName, fakeContext)
  }

  public async sendText(fakeContext: EventContext): Promise<void> {
    await this.client.executeText(fakeContext)
  }
}
