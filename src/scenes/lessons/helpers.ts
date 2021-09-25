import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {Markup} from 'telegraf'
import {LessonStorage, SectionOfUser} from '@/src/types/storage'
import {ActionContext, BotContext} from '@/src/types/telegraf'
import locales from '@/src/locales/ru.json'

export function getSectionIDFromSceneState(ctx: BotContext): number | undefined {
  const state = ctx.scene.state as {sectionID: number}
  const sectionID = Number(state.sectionID)
  if (isNaN(sectionID)) return undefined
  return state.sectionID
}

export async function showLesson(ctx: BotContext): Promise<void> {
  const lesson = ctx.state['lesson'] as LessonStorage
  const media = lesson.media ? `<a href="${lesson.media}">  </a>` : ''
  const textHTML = media + lesson.text

  // TODO добавить сцены для обработки ответа на вопрос текстом и кнопками
  // if (lesson.answer) {
  //   buttons = undefined
  //   const messageID = context.callbackQuery.message?.message_id
  //   const userID = context.from?.id
  //   if (!userID || !messageID) return
  //   await storage.setStepUser(userID, {lessonID: lesson.id, messageID, name: StepName.waitAnswerLesson})
  // }
  // if (lesson.answerButtons) buttons = INLINE_KEYBOARDS.answerButtons(lesson, hasTimeButtons)
  const section = ctx.state['section'] as SectionOfUser
  const isLastLesson = ctx.state['isLastLesson'] as boolean
  const replyMarkup = isLastLesson
    ? getEndLessonsInlineKeyboard(section.id).reply_markup
    : getNextLessonInlineKeyboard(section.id, lesson.position + 1).reply_markup
  await ctx.editMessageText(textHTML, {parse_mode: 'HTML', reply_markup: replyMarkup})
}

export function getNextLessonInlineKeyboard(sectionID: number, lessonPosition: number): Markup.Markup<InlineKeyboardMarkup> {
  const button: InlineKeyboardButton = {
    text: locales.scenes.lessons.next_lesson,
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
