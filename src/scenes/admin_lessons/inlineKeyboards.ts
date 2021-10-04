import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {LessonStorage} from '@/src/types/storage'
import locales from '@/src/locales/ru.json'
import {Markup} from 'telegraf'

export function getLessonsInlineKeyboard(lessons: LessonStorage[]): Markup.Markup<InlineKeyboardMarkup> {
  const buttons: InlineKeyboardButton[][] = lessons.map(lesson => {
    const lessonCallbackData = `l:${lesson.id}`
    const lessonButton = {text: lesson.title, callback_data: lessonCallbackData}

    const arrowUpCallbackData = `l:${lesson.id}:up`
    const arrowUpButton = {text: locales.inline_keyboards.arrow_up, callback_data: arrowUpCallbackData}

    const arrowDownCallbackData = `l:${lesson.id}:down`
    const arrowDownButton = {text: locales.inline_keyboards.arrow_down, callback_data: arrowDownCallbackData}

    return [lessonButton, arrowUpButton, arrowDownButton]
  })
  buttons.push([{text: locales.scenes.admin_lessons.new_lesson, callback_data: 'l:new'}])
  buttons.push([{text: locales.inline_keyboards.back, callback_data: 'back'}])
  return Markup.inlineKeyboard(buttons)
}
