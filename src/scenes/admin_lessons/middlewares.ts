import {getLessonIDFromActionData} from '@/src/util/sections'
import {AdminSectionContext} from '@/src/types/admin'
import {showAlertOldButton} from '@/src/util/alerts'
import {ActionContext} from '@/src/types/telegraf'
import {Middleware} from 'telegraf'

export function checkAndAddLessonToState(): Middleware<AdminSectionContext & ActionContext> {
  return async (ctx, next) => {
    const lessonID = getLessonIDFromActionData(ctx as ActionContext)
    const lesson = await ctx.storage.getLessonByID(lessonID)
    if (!lesson) return showAlertOldButton(ctx)
    ctx.state['lesson'] = lesson
    return next()
  }
}
