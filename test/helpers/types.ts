import {SinonSpy} from 'sinon'

interface FakeEntity {
  offset: number,
  length: number,
  type: 'bot_command'
}

export interface FakeContext {
  reply: SinonSpy,
  replyWithPhoto: SinonSpy,
  from?: {
    id: number
  },
  message?: {
    text: string,
    entities?: FakeEntity[]
  }
}
