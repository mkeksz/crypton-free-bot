import {EventContext} from '@/types/telegraf'
import {EventNames} from '@/types/event'
import TestClient from './TestClient'
import Bot from '@/src/Bot'

export default class TestBot extends Bot {
  protected readonly client: TestClient

  public constructor() {
    super('fake-token')
    this.client = new TestClient()
  }

  public async sendCommand(commandName: EventNames, fakeContext: EventContext): Promise<void> {
    await this.client.executeCommand(commandName, fakeContext)
  }
}
