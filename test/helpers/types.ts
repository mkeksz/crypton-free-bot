import {SinonSpy} from 'sinon'

interface FakeEntity {
  offset: number,
  length: number,
  type: 'bot_command'
}

export interface FakeContext {
  reply: SinonSpy,
  replyWithMarkdownV2: SinonSpy,
  replyWithPhoto: SinonSpy,
  editMessageText: SinonSpy,
  callbackQuery?: {data?: string},
  from?: {
    id: number
  },
  message?: {
    text: string,
    entities?: FakeEntity[]
  }
}
