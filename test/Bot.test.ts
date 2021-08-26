import {assert as assertSinon} from 'sinon'
import {getFakeContext} from './helpers/utils'
import {EventContext} from '@/types/telegraf'
import {BUTTONS, REPLIES} from '@/src/texts'
import {FakeContext} from './helpers/types'
import {CommandNames} from '@/types/event'
import {INLINE_KEYBOARDS, KEYBOARDS} from '../src/markup'
import TestBot from './helpers/TestBot'

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

  describe('command start', () => {
    it('replyWithMarkdownV2(REPLIES.start, KEYBOARDS.main)', async () => {
      await bot.sendCommand(CommandNames.start, context)
      assertSinon.calledOnceWithExactly(fakeContext.replyWithMarkdownV2, REPLIES.start, KEYBOARDS.main)
    })
  })

  describe('BUTTON.nft', () => {
    it('replyWithMarkdownV2(REPLIES.nftDrop)', async () => {
      fakeContext.message = {text: BUTTONS.nft}
      await bot.sendText(context)
      assertSinon.calledOnceWithExactly(fakeContext.replyWithMarkdownV2, REPLIES.nftDrop)
    })
  })

  describe('BUTTON.chat', () => {
    it('replyWithMarkdownV2(REPLIES.chat)', async () => {
      fakeContext.message = {text: BUTTONS.chat}
      await bot.sendText(context)
      assertSinon.calledOnceWithExactly(fakeContext.replyWithMarkdownV2, REPLIES.chat)
    })
  })

  describe('BUTTON.support', () => {
    it('replyWithMarkdownV2(REPLIES.support)', async () => {
      fakeContext.message = {text: BUTTONS.support}
      await bot.sendText(context)
      assertSinon.calledOnceWithExactly(fakeContext.replyWithMarkdownV2, REPLIES.support)
    })
  })

  describe('BUTTON.ecosystem', () => {
    it('replyWithMarkdownV2(REPLIES.ecosystem)', async () => {
      fakeContext.message = {text: BUTTONS.ecosystem}
      await bot.sendText(context)
      assertSinon.calledOnceWithExactly(fakeContext.replyWithMarkdownV2, REPLIES.ecosystem)
    })
  })

  describe('BUTTON.discord', () => {
    it('replyWithMarkdownV2(REPLIES.discord)', async () => {
      fakeContext.message = {text: BUTTONS.discord}
      await bot.sendText(context)
      assertSinon.calledOnceWithExactly(fakeContext.replyWithMarkdownV2, REPLIES.discord, INLINE_KEYBOARDS.discord)
    })
  })

  describe('BUTTON.calendar', () => {
    it('replyWithMarkdownV2(REPLIES.calendar)', async () => {
      fakeContext.message = {text: BUTTONS.calendar}
      await bot.sendText(context)
      assertSinon.calledOnceWithExactly(fakeContext.replyWithMarkdownV2, REPLIES.calendar)
    })
  })

  describe('BUTTON.training', () => {
    it('replyWithMarkdownV2(REPLIES.training)', async () => {
      fakeContext.message = {text: BUTTONS.training}
      await bot.sendText(context)
      assertSinon.calledOnceWithExactly(fakeContext.replyWithMarkdownV2, REPLIES.training)
    })
  })
})
