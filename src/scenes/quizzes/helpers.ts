import {InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {ActionContext, BotContext} from '@/src/types/telegraf'
import {QuizStorage, SectionOfUser} from '@/src/types/storage'

export async function showQuiz(ctx: BotContext | ActionContext): Promise<void> {
  const quiz = ctx.state['quiz'] as QuizStorage
  const section = ctx.state['section'] as SectionOfUser
  const isLastQuiz = ctx.state['isLastQuiz'] as boolean
  console.log(quiz, section, isLastQuiz)

  // let replyMarkup: InlineKeyboardMarkup | undefined = getNextLessonInlineKeyboard(section.id, quiz.position + 1).reply_markup
  // if (isLastLesson) replyMarkup = getEndLessonsInlineKeyboard(section.id).reply_markup
  // if (lesson.answerButtons) replyMarkup = getAnswersInlineKeyboard(lesson, isLastLesson).reply_markup

  // await ctx.editMessageText(quiz.text, {reply_markup: replyMarkup})
}

export function getQuizPositionFromActionData(ctx: ActionContext): number {
  const data = ctx.match[0]
  const [,,quizPosition] = data.split(':')
  return Number(quizPosition)
}
