import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import locales from '@/src/locales/ru.json'
import {Markup} from 'telegraf'

export function getQuizInlineKeyboard(): Markup.Markup<InlineKeyboardMarkup> {
  const buttons: InlineKeyboardButton[][] = []
  buttons.push([{text: locales.scenes.admin_lesson.edit, callback_data: 'edit'}])
  buttons.push([{text: locales.scenes.admin_lesson.button_answers, callback_data: 'edit:buttons'}])
  buttons.push([{text: locales.inline_keyboards.delete, callback_data: 'delete'}])
  buttons.push([{text: locales.inline_keyboards.back, callback_data: 'back'}])
  return Markup.inlineKeyboard(buttons)
}
