import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {Markup} from 'telegraf'
import {QuizStorage} from '@/src/types/storage'

export function getAnswersQuizInlineKeyboard(quiz: QuizStorage, rightAnswers: number, isLastQuiz: boolean): Markup.Markup<InlineKeyboardMarkup> {
  const answers = JSON.parse(quiz.buttons) as [string, 1?][]
  const buttons: InlineKeyboardButton[][] = answers.map(answer => {
    const rightAnswersData = answer[1] ? rightAnswers + 1 : rightAnswers
    let callbackData = `nq:${quiz.sectionID}:${quiz.position + 1}:${rightAnswersData}`
    if (isLastQuiz) callbackData = `eq:${quiz.sectionID}::${rightAnswersData}`
    return [{text: answer[0], callback_data: callbackData}]
  })
  return Markup.inlineKeyboard(buttons)
}
