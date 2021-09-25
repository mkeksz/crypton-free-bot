import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {Markup} from 'telegraf'
import {SectionOfUser} from '@/src/types/storage'
import locales from '../locales/ru.json'
import link from '../link.json'

export function getDiscordInlineKeyboard(): Markup.Markup<InlineKeyboardMarkup> {
  const button: InlineKeyboardButton = {text: locales.inline_keyboards.discord, url: link.discord}
  return Markup.inlineKeyboard([[button]])
}

export function getTrainingSectionsInlineKeyboard(sections: SectionOfUser[]): Markup.Markup<InlineKeyboardMarkup> {
  const buttons: InlineKeyboardButton[][] = sections.map(section => [{text: section.textButton, callback_data: `sid:${section.id}`}])
  buttons.push([{text: '« Возврат в меню', callback_data: 's:back'}])
  return Markup.inlineKeyboard(buttons)
}
