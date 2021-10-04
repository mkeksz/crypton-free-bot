import {ExtraEditMessageText} from 'telegraf/typings/telegram-types'
import {getQuizInlineKeyboard} from './inlineKeyboards'
import {AdminQuizContext} from '@/src/types/admin'
import locales from '@/src/locales/ru.json'
import {getMessageText} from '@/src/util/message'

export async function showAdminQuiz(ctx: AdminQuizContext, editMessageID?: number): Promise<void> {
  const reply_markup = getQuizInlineKeyboard().reply_markup
  const extra = {reply_markup, entities: ctx.quiz.entitiesArray, disable_web_page_preview: true} as ExtraEditMessageText
  if (editMessageID) ctx.telegram.editMessageText(ctx.chat!.id, editMessageID, undefined, ctx.quiz.text, extra)
  else ctx.editMessageText(ctx.quiz.text, extra)
}

export async function backToAdminQuizzes(ctx: AdminQuizContext): Promise<void> {
  await ctx.scene.enter('admin_quizzes', {sectionID: ctx.quiz.sectionID})
}

export async function editButtonsAnswer(ctx: AdminQuizContext, answer: string): Promise<string> {
  let text = locales.scenes.admin_lesson.edited_button_answers
  const buttons = answer.split('\n').filter(value => !!value).map(value => value.trim())
  const regRightAnswer = /^(\+ ).+$/
  const rightAnswers = buttons.filter(button => !!button.match(regRightAnswer))
  if (rightAnswers.length === 0) {
    text = locales.scenes.admin_lesson.not_right_answers
  } else {
    const rightAnswersForDB = buttons.map(button => {
      const isRightAnswer = !!button.match(regRightAnswer)
      if (isRightAnswer) return [button.slice(2), 1]
      return [button]
    })
    await ctx.storage.updateQuiz(ctx.quiz.id, {buttons: JSON.stringify(rightAnswersForDB)})
  }
  return text
}

export async function editQuiz(ctx: AdminQuizContext): Promise<string> {
  const messageText = getMessageText(ctx)
  const entities = messageText.entities ? messageText.entities : null
  await ctx.storage.updateQuiz(ctx.quiz.id, {text: messageText.text, entities})
  return locales.scenes.admin_lesson.edited_lesson
}
