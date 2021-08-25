import {assert as assertSinon} from 'sinon'
import {getFakeContext} from './helpers/utils'
import {EventContext} from '@/types/telegraf'
import {FakeContext} from './helpers/types'
import {CommandNames} from '@/types/event'
import {KEYBOARDS} from '../src/markup'
import TestBot from './helpers/TestBot'
import {REPLIES} from '@/src/texts'

describe('Bot', () => {
  const bot = new TestBot()
  let fakeContext: FakeContext
  let context: EventContext

  before(async () => {
    await bot.start()
  })

  beforeEach(() => {
    fakeContext = getFakeContext()
    context = fakeContext as unknown as EventContext
  })

  describe('start', () => {
    it('reply(REPLIES.start, KEYBOARDS.main)', async () => {
      await bot.sendCommand(CommandNames.start, context)
      assertSinon.calledOnceWithExactly(fakeContext.reply, REPLIES.start, KEYBOARDS.main)
    })
  })
})
