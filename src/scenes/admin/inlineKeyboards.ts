import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {SectionStorage} from '@/src/types/storage'
import locales from '@/src/locales/ru.json'
import {Markup} from 'telegraf'

export function getSectionsInlineKeyboard(sections: SectionStorage[]): Markup.Markup<InlineKeyboardMarkup> {
  const buttons: InlineKeyboardButton[][] = sections.map(section => {
    const sectionCallbackData = `s:${section.id}`
    const sectionButton = {text: section.textButton, callback_data: sectionCallbackData}

    const arrowUpCallbackData = `s:${section.id}:up`
    const arrowUpButton = {text: locales.inline_keyboards.arrow_up, callback_data: arrowUpCallbackData}

    const arrowDownCallbackData = `s:${section.id}:down`
    const arrowDownButton = {text: locales.inline_keyboards.arrow_down, callback_data: arrowDownCallbackData}

    return [sectionButton, arrowUpButton, arrowDownButton]
  })
  buttons.push([{text: locales.scenes.admin.new_section, callback_data: 's:new'}])
  return Markup.inlineKeyboard(buttons)
}
