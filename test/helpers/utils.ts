import sinon from 'sinon'
import {FakeContext} from './types'

export function getFakeContext(): FakeContext {
  return {
    reply: sinon.fake(),
    replyWithPhoto: sinon.fake(),
    replyWithMarkdownV2: sinon.fake(),
    editMessageText: sinon.fake()
  }
}
