import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {QuizStorage} from '@/src/types/storage'
import locales from '@/src/locales/ru.json'
import {Markup} from 'telegraf'

export function getQuizzesInlineKeyboard(quizzes: QuizStorage[]): Markup.Markup<InlineKeyboardMarkup> {
  const buttons: InlineKeyboardButton[][] = quizzes.map(quiz => {
    const quizCallbackData = `q:${quiz.id}`
    const quizButton = {text: quiz.title, callback_data: quizCallbackData}

    const arrowUpCallbackData = `q:${quiz.id}:up`
    const arrowUpButton = {text: locales.inline_keyboards.arrow_up, callback_data: arrowUpCallbackData}

    const arrowDownCallbackData = `q:${quiz.id}:down`
    const arrowDownButton = {text: locales.inline_keyboards.arrow_down, callback_data: arrowDownCallbackData}

    return [quizButton, arrowUpButton, arrowDownButton]
  })
  buttons.push([{text: locales.scenes.admin_quizzes.new_quiz, callback_data: 'q:new'}])
  buttons.push([{text: locales.inline_keyboards.back, callback_data: 'back'}])
  return Markup.inlineKeyboard(buttons)
}
