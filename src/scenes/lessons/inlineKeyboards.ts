import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {Markup} from 'telegraf'
import {LessonStorage} from '@/src/types/storage'
import locales from '@/src/locales/ru.json'

export function getAnswersInlineKeyboard(lesson: LessonStorage, isLastLesson: boolean): Markup.Markup<InlineKeyboardMarkup> {
  const buttonsData = JSON.parse(lesson.answerButtons!) as [text: string, isRight?: 1][]

  const buttons: InlineKeyboardButton[][] = []
  for (const buttonData of buttonsData) {
    let callbackData = isLastLesson ? `el:${lesson.sectionID}` : `nl:${lesson.sectionID}:${lesson.position + 1}`
    if (!buttonData[1]) callbackData = 'al:wrong'
    buttons.push([{text: buttonData[0], callback_data: callbackData}])
  }
  return Markup.inlineKeyboard(buttons)
}

export function getNextLessonInlineKeyboard(sectionID: number, lessonPosition: number, isBack = false): Markup.Markup<InlineKeyboardMarkup> {
  const button: InlineKeyboardButton = {
    text: isBack ? locales.inline_keyboards.back : locales.scenes.lessons.next_lesson,
    callback_data: `nl:${sectionID}:${lessonPosition}`
  }
  return Markup.inlineKeyboard([button])
}

export function getEndLessonsInlineKeyboard(sectionID: number): Markup.Markup<InlineKeyboardMarkup> {
  const button: InlineKeyboardButton = {text: locales.scenes.lessons.next_lesson, callback_data: `el:${sectionID}`}
  return Markup.inlineKeyboard([button])
}

export function getQuizSectionInlineKeyboard(sectionID: number): Markup.Markup<InlineKeyboardMarkup> {
  const buttonStart: InlineKeyboardButton = {text: locales.scenes.lessons.start_quiz, callback_data: `lsq:${sectionID}`}
  const buttonLater: InlineKeyboardButton = {text: locales.scenes.lessons.later_quiz, callback_data: `llq:${sectionID}`}
  return Markup.inlineKeyboard([[buttonStart], [buttonLater]])
}

export function getNoneQuizInlineKeyboard(sectionID: number): Markup.Markup<InlineKeyboardMarkup> {
  const buttonLater: InlineKeyboardButton = {text: locales.inline_keyboards.back, callback_data: `llq:${sectionID}`}
  return Markup.inlineKeyboard([buttonLater])
}
