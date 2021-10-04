import {checkAndAddSectionToContext} from '@/src/middlewares/admin/checkAndAddSectionToContext'
import {checkAndAddArrowToState} from '@/src/middlewares/admin/checkAndAddArrowToState'
import {AdminSceneState, AdminSectionContext} from '@/src/types/admin'
import {getReenterInlineKeyboard} from '@/src/inlineKeyboards/admin'
import {waitingText} from '@/src/middlewares/admin/waitingText'
import {getSubsectionsInlineKeyboard} from './inlineKeyboards'
import {clearWaitTextSceneState} from '@/src/util/admin/scene'
import {swapSectionPositions} from '@/src/util/admin/sections'
import {onlyAdmin} from '@/src/middlewares/admin/onlyAdmin'
import {checkAndAddSubsectionToState} from './middlewares'
import {FullSectionStorage} from '@/src/types/storage'
import {getMessageText} from '@/src/util/message'
import {waitText} from '@/src/util/admin/actions'
import {backToAdminSection} from './helpers'
import locales from '@/src/locales/ru.json'
import {Scenes, Telegraf} from 'telegraf'

const adminSubsections = new Scenes.BaseScene<AdminSectionContext>('admin_subsections')

adminSubsections.use(onlyAdmin())
adminSubsections.use(checkAndAddSectionToContext())

adminSubsections.enter(checkAndAddSectionToContext(), async ctx => {
  const subsections = await ctx.storage.getChildSections(ctx.section.id)
  const sortedSubsections = subsections.sort((a, b) => a.position - b.position)
  const text = locales.scenes.admin_subsections.subsections.replace('%title%', ctx.section.textButton)
  const reply_markup = getSubsectionsInlineKeyboard(sortedSubsections).reply_markup
  ctx.editMessageText(text, {parse_mode: 'HTML', reply_markup})
})

adminSubsections.action('ss:new', ctx => waitText(ctx, locales.scenes.admin_subsections.enter_new_subsection))

adminSubsections.action(/^ss:[0-9]+$/, checkAndAddSubsectionToState(), ctx => {
  const section = ctx.state['subsection'] as FullSectionStorage
  ctx.scene.enter('admin_subsection', {sectionID: section.id})
})

adminSubsections.action(/^ss:[0-9]+:(up|down)$/, checkAndAddSubsectionToState(), checkAndAddArrowToState(), async ctx => {
  const targetSubsection = ctx.state['subsection'] as FullSectionStorage
  const direction = ctx.state['arrow'] as 'up' | 'down'
  const subsections = await ctx.storage.getChildSections(ctx.section.id)
  const swapResult = await swapSectionPositions(ctx, subsections, targetSubsection, direction, 'section')
  swapResult && ctx.scene.reenter()
})

adminSubsections.action('reenter', ctx => ctx.scene.reenter())

adminSubsections.action('back', backToAdminSection)

adminSubsections.on('text', Telegraf.optional<AdminSectionContext>(waitingText(), async ctx => {
  const state = ctx.scene.state as AdminSceneState
  const titleSubsection = getMessageText(ctx).text
  await ctx.storage.addSection(titleSubsection, ctx.section.id)
  const reply_markup = getReenterInlineKeyboard().reply_markup
  const text = locales.scenes.admin_subsections.added_new_subsection.replace('%title%', titleSubsection)
  ctx.telegram.editMessageText(ctx.chat!.id, state.editMessageID, undefined, text, {parse_mode: 'HTML', reply_markup})
  ctx.deleteMessage()
  clearWaitTextSceneState(ctx)
}))

export default adminSubsections
