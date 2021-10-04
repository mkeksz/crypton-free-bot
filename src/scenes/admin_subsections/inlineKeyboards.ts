import {SectionStorage} from '@/src/types/storage'
import {Markup} from 'telegraf'
import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import locales from '@/src/locales/ru.json'

export function getSubsectionsInlineKeyboard(subsections: SectionStorage[]): Markup.Markup<InlineKeyboardMarkup> {
  const buttons: InlineKeyboardButton[][] = subsections.map(section => {
    const sectionCallbackData = `ss:${section.id}`
    const sectionButton = {text: section.textButton, callback_data: sectionCallbackData}

    const arrowUpCallbackData = `ss:${section.id}:up`
    const arrowUpButton = {text: locales.inline_keyboards.arrow_up, callback_data: arrowUpCallbackData}

    const arrowDownCallbackData = `ss:${section.id}:down`
    const arrowDownButton = {text: locales.inline_keyboards.arrow_down, callback_data: arrowDownCallbackData}

    return [sectionButton, arrowUpButton, arrowDownButton]
  })
  buttons.push([{text: locales.scenes.admin_subsections.new_subsection, callback_data: 'ss:new'}])
  buttons.push([{text: locales.inline_keyboards.back, callback_data: 'back'}])
  return Markup.inlineKeyboard(buttons)
}
