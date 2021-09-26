import {Middleware} from 'telegraf'
import {getLessonPositionFromActionData, getWaitSeconds} from './helpers'
import {ActionContext, BotContext} from '@/src/types/telegraf'
import {showAlertOldButton} from '@/src/util/alerts'
import {Predicate} from 'telegraf/typings/composer'
import {SectionOfUser} from '@/src/types/storage'
import locales from '@/src/locales/ru.json'

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

export function checkTime(): Middleware<ActionContext> {
  return async (ctx, next) => {
    const waitSeconds = getWaitSeconds(ctx)
    if (waitSeconds > 0) {
      const text = locales.scenes.lessons.wait.replace('%time%', String(waitSeconds))
      return ctx.answerCbQuery(text)
    }
    const state = ctx.scene.state as {time?: number}
    state.time = undefined
    return next()
  }
}

export function hasRightAnswer(): Predicate<BotContext> {
  return ctx => {
    const state = ctx.scene.state as {rightAnswer?: string, editMessageID?: number, lessonPosition?: number, sectionID?: number}
    return !!(state.rightAnswer && state.editMessageID !== undefined && state.lessonPosition !== undefined && state.sectionID !== undefined)
  }
}
