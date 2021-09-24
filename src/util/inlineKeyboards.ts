import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {Markup} from 'telegraf'
import locales from '../locales/ru.json'
import link from '../link.json'

export function getDiscordInlineKeyboard(): Markup.Markup<InlineKeyboardMarkup> {
  const button: InlineKeyboardButton = {text: locales.inline_keyboards.discord, url: link.discord}
  return Markup.inlineKeyboard([[button]])
}

export function getTrainingSectionsInlineKeyboard(): Markup.Markup<InlineKeyboardMarkup> {
  const sectionButton: InlineKeyboardButton = {text: 'пример', callback_data: '<section_id>'}
  const backButton: InlineKeyboardButton = {text: '« Возврат в меню', callback_data: 'back'}
  return Markup.inlineKeyboard([
    [sectionButton],
    [backButton]
  ])
}
