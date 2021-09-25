import {ActionContext, BotContext} from '@/src/types/telegraf'
import {Middleware} from 'telegraf'
import {getLessonPositionFromActionData, getSectionIDFromActionData, getSectionIDFromSceneState} from './helpers'
import {showAlertOldButton} from '@/src/util/alerts'
import {SectionOfUser} from '@/src/types/storage'

export function checkAndAddLessonToState(hasActionData: boolean): Middleware<ActionContext | BotContext> {
  return async (ctx, next) => {
    const section = ctx.state['section'] as SectionOfUser
    const lessonPosition = hasActionData ? getLessonPositionFromActionData(ctx as ActionContext) : 0
    const lesson = await ctx.storage.getLessonOfSectionByPosition(section.id, lessonPosition)
    if (!lesson) return showAlertOldButton(ctx)
    const isLastLesson = !await ctx.storage.getLessonOfSectionByPosition(section.id, lessonPosition + 1)
    ctx.state['lesson'] = lesson
    ctx.state['isLastLesson'] = isLastLesson
    return next()
  }
}

export function checkAndAddSectionToState(hasActionData: boolean): Middleware<ActionContext | BotContext> {
  return async (ctx, next) => {
    const stateSectionID = getSectionIDFromSceneState(ctx)
    const actionDataSectionID = hasActionData ? getSectionIDFromActionData(ctx as ActionContext) : null
    if (stateSectionID === undefined || (actionDataSectionID !== null && actionDataSectionID !== stateSectionID)) {
      return showAlertOldButton(ctx)
    }
    const section = await ctx.storage.getSectionOfUserByID(ctx.from!.id, stateSectionID)
    if (!section) return showAlertOldButton(ctx)
    ctx.state['section'] = section
    return next()
  }
}
