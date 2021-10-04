import {getQuizIDFromActionData} from '@/src/util/sections'
import {AdminSectionContext} from '@/src/types/admin'
import {showAlertOldButton} from '@/src/util/alerts'
import {ActionContext} from '@/src/types/telegraf'
import {Middleware} from 'telegraf'

export function checkAndAddQuizToState(): Middleware<AdminSectionContext & ActionContext> {
  return async (ctx, next) => {
    const quizID = getQuizIDFromActionData(ctx as ActionContext)
    const quiz = await ctx.storage.getQuizByID(quizID)
    if (!quiz) return showAlertOldButton(ctx)
    ctx.state['quiz'] = quiz
    return next()
  }
}
