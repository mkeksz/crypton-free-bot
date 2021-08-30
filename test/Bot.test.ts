import {assert as assertSinon} from 'sinon'
import {INLINE_KEYBOARDS, KEYBOARDS} from '../src/markup'
import {CommandNames, EventContext} from '@/types/event'
import {getFakeContext} from './helpers/utils'
import {BUTTONS, REPLIES} from '@/src/texts'
import {FakeContext} from './helpers/types'
import TestBot from './helpers/TestBot'
import {describe} from 'mocha'
import {CallbackQueryData, CallbackQueryName} from '../types/callbackQuery'
import {SectionOfUser} from '../types/storage'

describe('Bot', () => {
  const bot = new TestBot()
  let fakeContext: FakeContext
  let contextText: EventContext<'text'>
  let contextCallbackQuery: EventContext<'callback_query'>

  before(async () => {
    await bot.start()
  })

  beforeEach(() => {
    fakeContext = getFakeContext()
    contextText = fakeContext as unknown as EventContext<'text'>
    contextCallbackQuery = fakeContext as unknown as EventContext<'callback_query'>
  })

  describe('command start', () => {
    it('replyWithMarkdownV2(REPLIES.start, KEYBOARDS.main)', async () => {
      await bot.client.executeCommand(CommandNames.start, contextText)
      assertSinon.calledOnceWithExactly(fakeContext.replyWithMarkdownV2, REPLIES.start, KEYBOARDS.main)
    })
  })

  describe('BUTTON.nft', () => {
    it('replyWithMarkdownV2(REPLIES.nftDrop)', async () => {
      fakeContext.message = {text: BUTTONS.nft}
      await bot.client.executeText(contextText)
      assertSinon.calledOnceWithExactly(fakeContext.replyWithMarkdownV2, REPLIES.nftDrop)
    })
  })

  describe('BUTTON.chat', () => {
    it('replyWithMarkdownV2(REPLIES.chat)', async () => {
      fakeContext.message = {text: BUTTONS.chat}
      await bot.client.executeText(contextText)
      assertSinon.calledOnceWithExactly(fakeContext.replyWithMarkdownV2, REPLIES.chat)
    })
  })

  describe('BUTTON.support', () => {
    it('replyWithMarkdownV2(REPLIES.support)', async () => {
      fakeContext.message = {text: BUTTONS.support}
      await bot.client.executeText(contextText)
      assertSinon.calledOnceWithExactly(fakeContext.replyWithMarkdownV2, REPLIES.support)
    })
  })

  describe('BUTTON.ecosystem', () => {
    it('replyWithMarkdownV2(REPLIES.ecosystem)', async () => {
      fakeContext.message = {text: BUTTONS.ecosystem}
      await bot.client.executeText(contextText)
      assertSinon.calledOnceWithExactly(fakeContext.replyWithMarkdownV2, REPLIES.ecosystem)
    })
  })

  describe('BUTTON.discord', () => {
    it('replyWithMarkdownV2(REPLIES.discord)', async () => {
      fakeContext.message = {text: BUTTONS.discord}
      await bot.client.executeText(contextText)
      assertSinon.calledOnceWithExactly(fakeContext.replyWithMarkdownV2, REPLIES.discord, INLINE_KEYBOARDS.discord)
    })
  })

  describe('BUTTON.calendar', () => {
    it('replyWithMarkdownV2(REPLIES.calendar)', async () => {
      fakeContext.message = {text: BUTTONS.calendar}
      await bot.client.executeText(contextText)
      assertSinon.calledOnceWithExactly(fakeContext.replyWithMarkdownV2, REPLIES.calendar)
    })
  })

  describe('BUTTON.training', () => {
    it('replyWithMarkdownV2(REPLIES.training, INLINE_KEYBOARDS.trainingSections)', async () => {
      fakeContext.message = {text: BUTTONS.training}
      fakeContext.from = {id: 123}

      const buttons = INLINE_KEYBOARDS.trainingSections(await bot.storage.getSectionsOfUser(fakeContext.from.id))

      await bot.client.executeText(contextText)
      assertSinon.calledOnceWithExactly(fakeContext.replyWithMarkdownV2, REPLIES.training, buttons)
    })
  })

  describe('INLINE_BUTTON.section', () => {
    it('editMessageText(REPLIES.selectedSection, INLINE_KEYBOARDS.trainingSections)', async () => {
      fakeContext.callbackQuery = {data: JSON.stringify({n: CallbackQueryName.section, d: 2} as CallbackQueryData)}
      fakeContext.from = {id: 123}

      const section: SectionOfUser = {id: 2, parentSectionID: null, available: true, textButton: 'test', active: true, alwaysAvailable: true, position: 0}
      await bot.storage.addSectionToUser(fakeContext.from.id, section)
      const sectionStorage = await bot.storage.getSectionOfUserByID(fakeContext.from.id, section.id)
      const childSections = await bot.storage.getChildSectionsOfUser(fakeContext.from.id, section.id)

      await bot.client.executeCallbackQuery(contextCallbackQuery)
      assertSinon.calledOnceWithExactly(fakeContext.editMessageText, REPLIES.selectedSection(sectionStorage!), INLINE_KEYBOARDS.trainingSections(childSections, true))
    })
  })

  describe('INLINE_BUTTON.backToSections', async () => {
    fakeContext.callbackQuery = {data: JSON.stringify({n: CallbackQueryName.backToMainSections} as CallbackQueryData)}
    fakeContext.from = {id: 123}

    const buttons = INLINE_KEYBOARDS.trainingSections(await bot.storage.getSectionsOfUser(fakeContext.from.id))
    await bot.client.executeCallbackQuery(contextCallbackQuery)
    assertSinon.calledOnceWithExactly(fakeContext.editMessageText, REPLIES.training, buttons)
  })
})
