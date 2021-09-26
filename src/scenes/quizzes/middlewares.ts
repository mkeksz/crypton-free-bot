import {Middleware} from 'telegraf'
import {ActionContext, BotContext} from '@/src/types/telegraf'
import {SectionOfUser} from '@/src/types/storage'
import {showAlertOldButton} from '@/src/util/alerts'
import {getQuizPositionFromActionData, getRightAnswersFromActionData} from '@/src/scenes/quizzes/helpers'

export function checkAndAddQuizToState(hasActionData: boolean): Middleware<ActionContext | BotContext> {
  return async (ctx, next) => {
    const section = ctx.state['section'] as SectionOfUser
    const quizPosition = hasActionData ? getQuizPositionFromActionData(ctx as ActionContext) : 0
    const quiz = await ctx.storage.getQuizOfSectionByPosition(section.id, quizPosition)
    if (!quiz) return showAlertOldButton(ctx)
    const isLastQuiz = !await ctx.storage.getQuizOfSectionByPosition(section.id, quizPosition + 1)
    const rightAnswers = hasActionData ? getRightAnswersFromActionData(ctx as ActionContext) : 0
    ctx.state['quiz'] = quiz
    ctx.state['isLastQuiz'] = isLastQuiz
    ctx.state['rightAnswers'] = rightAnswers
    return next()
  }
}
