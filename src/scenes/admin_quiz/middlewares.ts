import {Middleware} from 'telegraf'
import {AdminQuizContext} from '@/src/types/admin'
import {getQuizIDFromSceneState} from '@/src/util/sections'
import {BotContext} from '@/src/types/telegraf'
import {showAlertOldButton} from '@/src/util/alerts'

export function checkAndAddQuizToContext(): Middleware<AdminQuizContext> {
  return async (ctx, next) => {
    const quizID = getQuizIDFromSceneState(ctx as BotContext)
    const quiz = await ctx.storage.getQuizByID(quizID)
    if (!quiz) return showAlertOldButton(ctx)
    ctx.quiz = quiz
    return next()
  }
}
