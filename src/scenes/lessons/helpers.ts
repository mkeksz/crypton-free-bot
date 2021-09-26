import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {Markup} from 'telegraf'
import {LessonStorage, SectionOfUser} from '@/src/types/storage'
import {ActionContext, BotContext} from '@/src/types/telegraf'
import {getUnixTime} from '@/src/util/common'
import locales from '@/src/locales/ru.json'

export async function showLesson(ctx: BotContext | ActionContext): Promise<void> {
  const lesson = ctx.state['lesson'] as LessonStorage
  const media = lesson.media ? `<a href="${lesson.media}">  </a>` : ''
  const textHTML = media + lesson.text

  const section = ctx.state['section'] as SectionOfUser
  const isLastLesson = ctx.state['isLastLesson'] as boolean

  let replyMarkup: InlineKeyboardMarkup | undefined = getNextLessonInlineKeyboard(section.id, lesson.position + 1).reply_markup
  if (isLastLesson) replyMarkup = getEndLessonsInlineKeyboard(section.id).reply_markup
  if (lesson.answerButtons) replyMarkup = getAnswersInlineKeyboard(lesson, isLastLesson).reply_markup
  if (lesson.answer) {
    replyMarkup = undefined
    const state = ctx.scene.state as {rightAnswer?: string, editMessageID?: number, lessonPosition?: number, isLastLesson?: boolean}
    state.rightAnswer = lesson.answer
    state.editMessageID = ctx.callbackQuery!.message!.message_id
    state.lessonPosition = lesson.position
    state.isLastLesson = isLastLesson
  }

  await ctx.editMessageText(textHTML, {parse_mode: 'HTML', reply_markup: replyMarkup})
}

export function getAnswersInlineKeyboard(lesson: LessonStorage, isLastLesson: boolean): Markup.Markup<InlineKeyboardMarkup> {
  const buttonsData = JSON.parse(lesson.answerButtons!) as [text: string, isRight?: 1][]

  const buttons: InlineKeyboardButton[][] = []
  for (const buttonData of buttonsData) {
    let callbackData = isLastLesson ? `el:${lesson.sectionID}` : `nl:${lesson.sectionID}:${lesson.position + 1}`
    if (!buttonData[1]) callbackData = 'al:wrong'
    buttons.push([{text: buttonData[0], callback_data: callbackData}])
  }
  return Markup.inlineKeyboard(buttons)
}

export function getNextLessonInlineKeyboard(sectionID: number, lessonPosition: number, isBack = false): Markup.Markup<InlineKeyboardMarkup> {
  const button: InlineKeyboardButton = {
    text: isBack ? locales.inline_keyboards.back : locales.scenes.lessons.next_lesson,
    callback_data: `nl:${sectionID}:${lessonPosition}`
  }
  return Markup.inlineKeyboard([button])
}

export function getEndLessonsInlineKeyboard(sectionID: number): Markup.Markup<InlineKeyboardMarkup> {
  const button: InlineKeyboardButton = {text: locales.scenes.lessons.next_lesson, callback_data: `el:${sectionID}`}
  return Markup.inlineKeyboard([button])
}

export function getQuizSectionInlineKeyboard(sectionID: number): Markup.Markup<InlineKeyboardMarkup> {
  const buttonStart: InlineKeyboardButton = {text: locales.scenes.lessons.start_quiz, callback_data: `lsq:${sectionID}`}
  const buttonLater: InlineKeyboardButton = {text: locales.scenes.lessons.later_quiz, callback_data: `llq:${sectionID}`}
  return Markup.inlineKeyboard([[buttonStart], [buttonLater]])
}

export function getSectionIDFromActionData(ctx: ActionContext): number {
  const data = ctx.match[0]
  const [,sectionID] = data.split(':')
  return Number(sectionID)
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
