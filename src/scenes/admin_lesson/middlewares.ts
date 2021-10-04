import {getLessonIDFromSceneState} from '@/src/util/sections'
import {AdminLessonContext} from '@/src/types/admin'
import {showAlertOldButton} from '@/src/util/alerts'
import {BotContext} from '@/src/types/telegraf'
import {Middleware} from 'telegraf'

export function checkAndAddLessonToContext(): Middleware<AdminLessonContext> {
  return async (ctx, next) => {
    const lessonID = getLessonIDFromSceneState(ctx as BotContext)
    const lesson = await ctx.storage.getLessonByID(lessonID)
    if (!lesson) return showAlertOldButton(ctx)
    ctx.lesson = lesson
    return next()
  }
}
