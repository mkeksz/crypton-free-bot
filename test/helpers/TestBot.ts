import TestClient from './TestClient'
import Bot from '@/src/Bot'
import TestStorage from './TestStorage'

export default class TestBot extends Bot {
  public readonly client: TestClient
  public readonly storage: TestStorage

  public constructor() {
    super('fake-token')
    this.client = new TestClient()
    this.storage = new TestStorage()
  }
}
