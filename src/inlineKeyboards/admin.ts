import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {SectionStorage} from '@/src/types/storage'
import locales from '@/src/locales/ru.json'
import {Markup} from 'telegraf'

export function getReenterInlineKeyboard(): Markup.Markup<InlineKeyboardMarkup> {
  return Markup.inlineKeyboard([{text: locales.inline_keyboards.back, callback_data: 'reenter'}])
}

export function getDeleteInlineKeyboard(): Markup.Markup<InlineKeyboardMarkup> {
  const buttonYes = {text: locales.inline_keyboards.yes, callback_data: 'delete:yes'}
  const buttonNo = {text: locales.inline_keyboards.no, callback_data: 'reenter'}
  return Markup.inlineKeyboard([buttonYes, buttonNo])
}

export function getOpenAfterInlineKeyboard(sections: SectionStorage[]): Markup.Markup<InlineKeyboardMarkup> {
  const buttons: InlineKeyboardButton[][] = sections.map(section => {
    const sectionCallbackData = `openafter:${section.id}`
    const sectionButton = {text: section.textButton, callback_data: sectionCallbackData}
    return [sectionButton]
  })
  buttons.push([{text: locales.inline_keyboards.remove, callback_data: 'openafter:remove'}])
  buttons.push([{text: locales.inline_keyboards.back, callback_data: 'reenter'}])
  return Markup.inlineKeyboard(buttons)
}

export function getLessonInlineKeyboard(): Markup.Markup<InlineKeyboardMarkup> {
  const buttons: InlineKeyboardButton[][] = []
  buttons.push([{text: locales.scenes.admin_lesson.edit, callback_data: 'edit'}])
  buttons.push([{text: locales.scenes.admin_lesson.button_answers, callback_data: 'edit:buttons'}])
  buttons.push([{text: locales.scenes.admin_lesson.answer, callback_data: 'edit:answer'}])
  buttons.push([{text: locales.scenes.admin_lesson.media, callback_data: 'media'}])
  buttons.push([{text: locales.inline_keyboards.delete, callback_data: 'delete'}])
  buttons.push([{text: locales.inline_keyboards.back, callback_data: 'back'}])
  return Markup.inlineKeyboard(buttons)
}
