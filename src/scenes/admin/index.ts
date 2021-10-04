import {ExtraEditMessageText, ExtraReplyMessage} from 'telegraf/typings/telegram-types'
import {checkAndAddArrowToState} from '@/src/middlewares/admin/checkAndAddArrowToState'
import {getReenterInlineKeyboard} from '@/src/inlineKeyboards/admin'
import {waitingText} from '@/src/middlewares/admin/waitingText'
import {clearWaitTextSceneState} from '@/src/util/admin/scene'
import {swapSectionPositions} from '@/src/util/admin/sections'
import {onlyAdmin} from '@/src/middlewares/admin/onlyAdmin'
import {getSectionsInlineKeyboard} from './inlineKeyboards'
import {getAllParentSections} from '@/src/util/sections'
import {checkAndAddSectionToState} from './middlewares'
import {SectionStorage} from '@/src/types/storage'
import {getMessageText} from '@/src/util/message'
import {getEditFromState} from '@/src/util/state'
import {AdminSceneState} from '@/src/types/admin'
import {BotContext} from '@/src/types/telegraf'
import locales from '@/src/locales/ru.json'
import {Scenes, Telegraf} from 'telegraf'
import {reenter} from './helpers'

const admin = new Scenes.BaseScene<BotContext>('admin')
admin.use(onlyAdmin())

admin.enter(async ctx => {
  const sections = await getAllParentSections(ctx)
  const reply_markup = getSectionsInlineKeyboard(sections).reply_markup
  const extra = {reply_markup, parse_mode: 'HTML'}
  const text = locales.scenes.admin.sections
  const edit = getEditFromState(ctx)
  if (edit) ctx.editMessageText(text, extra as ExtraEditMessageText)
  else ctx.reply(text, extra as ExtraReplyMessage)
})

admin.action('s:new', ctx => {
  const state = ctx.scene.state as AdminSceneState
  state.waitText = true
  state.editMessageID = ctx.callbackQuery!.message!.message_id
  const reply_markup = getReenterInlineKeyboard().reply_markup
  ctx.editMessageText(locales.scenes.admin.enter_new_section, {parse_mode: 'HTML', reply_markup})
})

admin.action('reenter', ctx => {
  clearWaitTextSceneState(ctx)
  reenter(ctx)
})

admin.action(/^s:[0-9]+$/, checkAndAddSectionToState(), ctx => {
  const section = ctx.state['section'] as SectionStorage
  ctx.scene.enter('admin_section', {sectionID: section.id})
})

admin.action(/^s:[0-9]+:(up|down)$/, checkAndAddSectionToState(), checkAndAddArrowToState(), async ctx => {
  const targetSection = ctx.state['section'] as SectionStorage
  const direction = ctx.state['arrow'] as 'up' | 'down'
  const sections = await ctx.storage.getAllSections(true)
  const swapResult = await swapSectionPositions(ctx, sections, targetSection, direction, 'section')
  swapResult && reenter(ctx)
})

admin.on('text', Telegraf.optional(waitingText(), async ctx => {
  const state = ctx.scene.state as AdminSceneState
  const titleSection = getMessageText(ctx).text
  await ctx.storage.addSection(titleSection)
  const reply_markup = getReenterInlineKeyboard().reply_markup
  const text = locales.scenes.admin.added_new_section.replace('%title%', titleSection)
  ctx.telegram.editMessageText(ctx.chat!.id, state.editMessageID, undefined, text, {parse_mode: 'HTML', reply_markup})
  ctx.deleteMessage()
  clearWaitTextSceneState(ctx)
}))

export default admin
