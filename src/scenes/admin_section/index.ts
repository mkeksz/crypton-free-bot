import {active, waitText, forAll, reenter, sureDelete, editTitle, selectOpenAfter} from '@/src/util/admin/actions'
import {checkAndAddOpenAfterSectionToState} from '@/src/middlewares/admin/checkAndAddOpenAfterSectionToState'
import {checkAndAddSectionToContext} from '@/src/middlewares/admin/checkAndAddSectionToContext'
import {getOpenAfterInlineKeyboard} from '@/src/inlineKeyboards/admin'
import {waitingText} from '@/src/middlewares/admin/waitingText'
import {onlyAdmin} from '@/src/middlewares/admin/onlyAdmin'
import {getSectionInlineKeyboard} from './inlineKeyboards'
import {getAllParentSections} from '@/src/util/sections'
import {AdminSectionContext} from '@/src/types/admin'
import locales from '@/src/locales/ru.json'
import {Scenes, Telegraf} from 'telegraf'
import {backToAdmin} from './helpers'

const adminSection = new Scenes.BaseScene<AdminSectionContext>('admin_section')

adminSection.use(onlyAdmin())
adminSection.use(checkAndAddSectionToContext())

adminSection.enter(checkAndAddSectionToContext(), ctx => {
  const replyMarkup = getSectionInlineKeyboard(ctx.section).reply_markup
  const text = locales.scenes.admin_section.section.replace('%title%', ctx.section.textButton)
  ctx.editMessageText(text, {parse_mode: 'HTML', reply_markup: replyMarkup})
})

adminSection.action('active', active)

adminSection.action('forall', forAll)

adminSection.action('edittitle', async ctx => {
  await waitText(ctx, locales.scenes.admin_section.new_title.replace('%title%', ctx.section.textButton))
})

adminSection.action('delete', sureDelete)

adminSection.action('delete:yes', async ctx => {
  await ctx.storage.deleteSection(ctx.section.id)
  await backToAdmin(ctx)
})

adminSection.action('openafter', async ctx => {
  const sections = await getAllParentSections(ctx)
  const filterSections = sections.filter(section => section.id !== ctx.section.id)
  const reply_markup = getOpenAfterInlineKeyboard(filterSections).reply_markup
  const text = locales.scenes.admin_section.open_after_sections.replace('%title%', ctx.section.textButton)
  ctx.editMessageText(text, {parse_mode: 'HTML', reply_markup})
})

adminSection.action('openafter:remove', async ctx => {
  await ctx.storage.updateSection(ctx.section.id, {openAfterSectionID: null})
  await reenter(ctx)
})

adminSection.action(/^openafter:[0-9]+/, checkAndAddOpenAfterSectionToState(), selectOpenAfter)

adminSection.action('subsections', ctx => ctx.scene.enter('admin_subsections', {sectionID: ctx.section.id}))

adminSection.action('reenter', reenter)

adminSection.action('back', backToAdmin)

adminSection.on('text', Telegraf.optional<AdminSectionContext>(waitingText(), editTitle))

export default adminSection
