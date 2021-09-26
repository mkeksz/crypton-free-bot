import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {Markup} from 'telegraf'
import locales from '../locales/ru.json'
import link from '../link.json'

export function getDiscordInlineKeyboard(): Markup.Markup<InlineKeyboardMarkup> {
  const button: InlineKeyboardButton = {text: locales.inline_keyboards.discord, url: link.discord}
  return Markup.inlineKeyboard([[button]])
}
