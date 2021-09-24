import {Scenes} from 'telegraf'
import {getTrainingSectionsInlineKeyboard} from '@/src/util/inlineKeyboards'
import {BotContext} from '@/src/types/telegraf'
import locales from '@/src/locales/ru.json'

const trainingSections = new Scenes.BaseScene<BotContext>('trainingSections')

trainingSections.enter(async ctx => {
  const replyMarkup = getTrainingSectionsInlineKeyboard().reply_markup
  await ctx.reply(locales.scenes.training_sections.sections, {parse_mode: 'HTML', reply_markup: replyMarkup})
})

export default trainingSections
