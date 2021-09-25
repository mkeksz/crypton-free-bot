import {Scenes} from 'telegraf'
import {getParentSections, getTrainingSectionsInlineKeyboard, getTrainingSubsectionsInlineKeyboard} from './helpers'
import {checkAndAddSectionToState} from './middlewares'
import {showAlertOldButton} from '@/src/util/alerts'
import {SectionOfUser} from '@/src/types/storage'
import {goToMainMenu} from '@/src/util/mainMenu'
import {BotContext} from '@/src/types/telegraf'
import locales from '@/src/locales/ru.json'

const trainingSections = new Scenes.BaseScene<BotContext>('trainingSections')

trainingSections.enter(async ctx => {
  const sections = await getParentSections(ctx)
  const inlineKeyboard = getTrainingSectionsInlineKeyboard(sections)
  await ctx.reply(locales.scenes.training_sections.sections, inlineKeyboard)
})

trainingSections.action(/^sid:[0-9]+$/, checkAndAddSectionToState(false), async ctx => {
  const section = ctx.state['section'] as SectionOfUser
  const childSections = await ctx.storage.getChildSectionsOfUser(ctx.from!.id, section.id)
  const text = locales.scenes.training_sections.selected_section.replace('%title%', section.textButton)
  return ctx.editMessageText(text, getTrainingSubsectionsInlineKeyboard(childSections))
})

trainingSections.action(/^ssid:[0-9]+$/, checkAndAddSectionToState(true), async ctx => {
  const section = ctx.state['section'] as SectionOfUser
  const lesson = await ctx.storage.getLessonOfSectionByPosition(section.id, 0)
  if (!lesson) return showAlertOldButton(ctx)
  return ctx.scene.enter('lessons', {sectionID: section.id})
})

trainingSections.action('s:back', async ctx => {
  ctx.editMessageText(locales.scenes.training_sections.back)
  await goToMainMenu(ctx)
})

trainingSections.action('ss:back',  async ctx => {
  const sections = await getParentSections(ctx)
  const inlineKeyboard = getTrainingSectionsInlineKeyboard(sections)
  await ctx.editMessageText(locales.scenes.training_sections.sections, inlineKeyboard)
})

export default trainingSections
