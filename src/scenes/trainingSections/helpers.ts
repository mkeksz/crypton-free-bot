import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {Markup} from 'telegraf'
import {SectionOfUser} from '@/src/types/storage'

export function getTrainingSectionsInlineKeyboard(sections: SectionOfUser[]): Markup.Markup<InlineKeyboardMarkup> {
  const buttons: InlineKeyboardButton[][] = sections.map(section => [{text: section.textButton, callback_data: `sid:${section.id}`}])
  buttons.push([{text: '« Возврат в меню', callback_data: 's:back'}])
  return Markup.inlineKeyboard(buttons)
}
