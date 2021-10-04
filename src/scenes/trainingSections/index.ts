import {Scenes} from 'telegraf'
import {getTrainingSectionsInlineKeyboard, getTrainingSubsectionsInlineKeyboard} from './inlineKeyboards'
import {getParentSections, getStarsFromActionData} from './helpers'
import {checkAndAddSectionToState} from './middlewares'
import {getEditFromState} from '@/src/util/state'
import {SectionOfUser} from '@/src/types/storage'
import {goToMainMenu} from '@/src/util/mainMenu'
import {BotContext} from '@/src/types/telegraf'
import locales from '@/src/locales/ru.json'

const trainingSections = new Scenes.BaseScene<BotContext>('trainingSections')

trainingSections.enter(async ctx => {
  const sections = await getParentSections(ctx)
  const inlineKeyboard = getTrainingSectionsInlineKeyboard(sections)
  const text = locales.scenes.training_sections.sections

  const edit = getEditFromState(ctx)
  if (edit) return ctx.editMessageText(text, inlineKeyboard)
  return ctx.reply(text, inlineKeyboard)
})

trainingSections.action(/^sid:[0-9]+$/, checkAndAddSectionToState(false), async ctx => {
  const section = ctx.state['section'] as SectionOfUser
  const childSections = await ctx.storage.getChildSectionsOfUser(ctx.from!.id, section.id)
  const text = locales.scenes.training_sections.selected_section.replace('%title%', section.textButton)
  return ctx.editMessageText(text, getTrainingSubsectionsInlineKeyboard(childSections))
})

trainingSections.action(/^ssid:[0-9]+$/, checkAndAddSectionToState(true), async ctx => {
  const section = ctx.state['section'] as SectionOfUser
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

trainingSections.action(/^qsss:[0-9]+$/, ctx => {
  const stars = getStarsFromActionData(ctx)
  ctx.answerCbQuery(locales.scenes.training_sections.stars_quiz.replace('%stars%', stars))
})

trainingSections.action(/^qssid:[0-9]+$/, checkAndAddSectionToState(true), async ctx => {
  const section = ctx.state['section'] as SectionOfUser
  ctx.scene.enter('quizzes', {sectionID: section.id})
})

export default trainingSections
