import {active, waitText, forAll, reenter, sureDelete, editTitle, selectOpenAfter} from '@/src/util/admin/actions'
import {checkAndAddOpenAfterSectionToState} from '@/src/middlewares/admin/checkAndAddOpenAfterSectionToState'
import {checkAndAddSectionToContext} from '@/src/middlewares/admin/checkAndAddSectionToContext'
import {getOpenAfterInlineKeyboard} from '@/src/inlineKeyboards/admin'
import {waitingText} from '@/src/middlewares/admin/waitingText'
import {onlyAdmin} from '@/src/middlewares/admin/onlyAdmin'
import {getSectionInlineKeyboard} from './inlineKeyboards'
import {AdminSectionContext} from '@/src/types/admin'
import {backToAdminSubsections} from './helpers'
import locales from '@/src/locales/ru.json'
import {Scenes, Telegraf} from 'telegraf'

const adminSubsection = new Scenes.BaseScene<AdminSectionContext>('admin_subsection')

adminSubsection.use(onlyAdmin())
adminSubsection.use(checkAndAddSectionToContext(true))

adminSubsection.enter(checkAndAddSectionToContext(true), ctx => {
  const section = ctx.section.parentSection!
  const reply_markup = getSectionInlineKeyboard(ctx.section).reply_markup
  const text = locales.scenes.admin_subsection.subsection
    .replace('%title%', section.textButton)
    .replace('%title2%', ctx.section.textButton)
  ctx.editMessageText(text, {parse_mode: 'HTML', reply_markup})
})

adminSubsection.action('active', active)

adminSubsection.action('forall', forAll)

adminSubsection.action('edittitle', async ctx => {
  const text = locales.scenes.admin_section.new_title.replace('%title%', ctx.section.textButton)
  await waitText(ctx, text)
})

adminSubsection.action('delete', sureDelete)

adminSubsection.action('delete:yes', async ctx => {
  await ctx.storage.deleteSection(ctx.section.id)
  await backToAdminSubsections(ctx)
})

adminSubsection.action('openafter', async ctx => {
  const subsections = await ctx.storage.getChildSections(ctx.section.parentSectionID!)
  const filterSubsections = subsections.filter(subsection => subsection.id !== ctx.section.id)
  const reply_markup = getOpenAfterInlineKeyboard(filterSubsections).reply_markup
  const text = locales.scenes.admin_subsection.open_after.replace('%title%', ctx.section.textButton)
  ctx.editMessageText(text, {parse_mode: 'HTML', reply_markup})
})

adminSubsection.action('openafter:remove', async ctx => {
  await ctx.storage.updateSection(ctx.section.id, {openAfterSectionID: null})
  await reenter(ctx)
})

adminSubsection.action(/^openafter:[0-9]+/, checkAndAddOpenAfterSectionToState(), selectOpenAfter)

adminSubsection.action('lessons', ctx => ctx.scene.enter('admin_lessons', {sectionID: ctx.section.id}))

adminSubsection.action('quizzes', ctx => ctx.scene.enter('admin_quizzes', {sectionID: ctx.section.id}))

adminSubsection.action('reenter', reenter)

adminSubsection.action('back', backToAdminSubsections)

adminSubsection.on('text', Telegraf.optional<AdminSectionContext>(waitingText(), editTitle))

export default adminSubsection
