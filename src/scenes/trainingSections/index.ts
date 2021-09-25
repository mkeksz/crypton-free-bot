import {Scenes} from 'telegraf'
import {getCallbackQueryData} from '@/src/util/callbackQuery'
import {getTrainingSectionsInlineKeyboard} from './helpers'
import {goToMainMenu} from '@/src/util/mainMenu'
import {BotContext} from '@/src/types/telegraf'
import locales from '@/src/locales/ru.json'

const trainingSections = new Scenes.BaseScene<BotContext>('trainingSections')

trainingSections.enter(async ctx => {
  const sections = await ctx.state.storage!.getSectionsOfUser(ctx.from!.id, true)
  const replyMarkup = getTrainingSectionsInlineKeyboard(sections).reply_markup
  await ctx.reply(locales.scenes.training_sections.sections, {parse_mode: 'HTML', reply_markup: replyMarkup})
})

trainingSections.action(/^sid:[0-9]*$/, ctx => {
  const data = getCallbackQueryData(ctx)
  const [,sectionID] = data.split(':')
  ctx.reply(sectionID)
})

trainingSections.action(/^s:back$/, async ctx => {
  ctx.editMessageText(locales.scenes.training_sections.back)
  await goToMainMenu(ctx)
})

export default trainingSections
