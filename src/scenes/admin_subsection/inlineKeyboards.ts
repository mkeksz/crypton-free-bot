import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {FullSectionStorage} from '@/src/types/storage'
import locales from '@/src/locales/ru.json'
import {Markup} from 'telegraf'

export function getSectionInlineKeyboard(section: FullSectionStorage): Markup.Markup<InlineKeyboardMarkup> {
  const buttons: InlineKeyboardButton[][] = []

  const lessonsCallbackData = 'lessons'
  const lessonsText = locales.scenes.admin_subsection.lessons
  const lessonsButton = {text: lessonsText, callback_data: lessonsCallbackData}
  buttons.push([lessonsButton])

  const quizCallbackData = 'quizzes'
  const quizText = locales.scenes.admin_subsection.quiz
  const quizButton = {text: quizText, callback_data: quizCallbackData}
  buttons.push([quizButton])

  const editTitleCallbackData = 'edittitle'
  const editTitleText = locales.scenes.admin_section.edit_title
  const editTitleButton = {text: editTitleText, callback_data: editTitleCallbackData}
  buttons.push([editTitleButton])

  const openAfterSection = section.opensAfterSections[0]
  const openAfterCallbackData = 'openafter'
  const openAfterText = locales.scenes.admin_section.open_after.replace('%title%', openAfterSection ? openAfterSection.textButton : '-')
  const openAfterButton = {text: openAfterText, callback_data: openAfterCallbackData}
  buttons.push([openAfterButton])

  const forAllCallbackData = 'forall'
  const forAllText = section.alwaysAvailable ? locales.scenes.admin_section.for_all_on : locales.scenes.admin_section.for_all_off
  const forAllButton = {text: forAllText, callback_data: forAllCallbackData}
  buttons.push([forAllButton])

  const activateButtonCallbackData = 'active'
  const activateButtonText = section.active ? locales.inline_keyboards.turn_off : locales.inline_keyboards.turn_on
  const activateButton = {text: activateButtonText, callback_data: activateButtonCallbackData}
  buttons.push([activateButton])

  const deleteButton = {text: locales.inline_keyboards.delete, callback_data: 'delete'}
  buttons.push([deleteButton])

  const backButton = {text: locales.inline_keyboards.back, callback_data: 'back'}
  buttons.push([backButton])

  return Markup.inlineKeyboard(buttons)
}
