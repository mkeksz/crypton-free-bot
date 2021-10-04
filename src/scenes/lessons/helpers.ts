import {InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {getAnswersInlineKeyboard, getEndLessonsInlineKeyboard, getNextLessonInlineKeyboard} from './inlineKeyboards'
import {LessonStorage, SectionOfUser} from '@/src/types/storage'
import {ActionContext, BotContext} from '@/src/types/telegraf'
import {getUnixTime} from '@/src/util/common'
import {ExtraEditMessageText} from 'telegraf/typings/telegram-types'
import {getTextWithMedia} from '@/src/util/lesson'

export async function showLesson(ctx: BotContext | ActionContext): Promise<void> {
  const lesson = ctx.state['lesson'] as LessonStorage
  const messageText = getTextWithMedia(lesson)

  const section = ctx.state['section'] as SectionOfUser
  const isLastLesson = ctx.state['isLastLesson'] as boolean

  let reply_markup: InlineKeyboardMarkup | undefined = getNextLessonInlineKeyboard(section.id, lesson.position + 1).reply_markup
  if (isLastLesson) reply_markup = getEndLessonsInlineKeyboard(section.id).reply_markup
  if (lesson.answerButtons) reply_markup = getAnswersInlineKeyboard(lesson, isLastLesson).reply_markup
  if (lesson.answer) {
    reply_markup = undefined
    const state = ctx.scene.state as {rightAnswer?: string, editMessageID?: number, lessonPosition?: number, isLastLesson?: boolean}
    state.rightAnswer = lesson.answer
    state.editMessageID = ctx.callbackQuery!.message!.message_id
    state.lessonPosition = lesson.position
    state.isLastLesson = isLastLesson
  }
  const extra = {reply_markup, entities: messageText.entities, disable_web_page_preview: !messageText.entities} as ExtraEditMessageText
  await ctx.editMessageText(messageText.text, extra)
}

export function getLessonPositionFromActionData(ctx: ActionContext): number {
  const data = ctx.match[0]
  const [,,lessonPosition] = data.split(':')
  return Number(lessonPosition)
}

export function getWaitSeconds(ctx: ActionContext): number {
  const state = ctx.scene.state as {time?: number}
  if (!state.time) return 0
  const currentTime = getUnixTime()
  return 60 - (currentTime - state.time)
}
