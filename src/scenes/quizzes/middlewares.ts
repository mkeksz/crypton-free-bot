import {Middleware} from 'telegraf'
import {ActionContext, BotContext} from '@/src/types/telegraf'
import {SectionOfUser} from '@/src/types/storage'
import {showAlertOldButton} from '@/src/util/alerts'
import {getQuizPositionFromActionData} from '@/src/scenes/quizzes/helpers'

export function checkAndAddQuizToState(hasActionData: boolean): Middleware<ActionContext | BotContext> {
  return async (ctx, next) => {
    const section = ctx.state['section'] as SectionOfUser
    const quizPosition = hasActionData ? getQuizPositionFromActionData(ctx as ActionContext) : 0
    const quiz = await ctx.storage.getQuizOfSectionByPosition(section.id, quizPosition)
    if (!quiz) return showAlertOldButton(ctx)
    const isLastQuiz = !await ctx.storage.getQuizOfSectionByPosition(section.id, quizPosition + 1)
    ctx.state['lesson'] = quiz
    ctx.state['isLastQuiz'] = isLastQuiz
    return next()
  }
}
