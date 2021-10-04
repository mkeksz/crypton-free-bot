import {AdminLessonContext} from '@/src/types/admin'
import locales from '@/src/locales/ru.json'
import {getMessageText} from '@/src/util/message'

export async function backToAdminLessons(ctx: AdminLessonContext): Promise<void> {
  await ctx.scene.enter('admin_lessons', {sectionID: ctx.lesson.sectionID})
}

export async function editButtonsAnswer(ctx: AdminLessonContext, answer: string): Promise<string> {
  let text = locales.scenes.admin_lesson.edited_button_answers
  if (answer === '-') {
    await ctx.storage.updateLesson(ctx.lesson.id, {answerButtons: null})
  } else {
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
      await ctx.storage.updateLesson(ctx.lesson.id, {answerButtons: JSON.stringify(rightAnswersForDB)})
    }
  }
  return text
}

export async function editAnswer(ctx: AdminLessonContext, answer: string): Promise<string> {
  if (answer === '-') {
    await ctx.storage.updateLesson(ctx.lesson.id, {answer: null})
  } else {
    await ctx.storage.updateLesson(ctx.lesson.id, {answer})
  }
  return locales.scenes.admin_lesson.edited_answer
}

export async function editLesson(ctx: AdminLessonContext): Promise<string> {
  const messageText = getMessageText(ctx)
  const entities = messageText.entities ? messageText.entities : null
  await ctx.storage.updateLesson(ctx.lesson.id, {text: messageText.text, entities})
  return locales.scenes.admin_lesson.edited_lesson
}

export async function editMedia(ctx: AdminLessonContext, link: string): Promise<string> {
  if (link === '-') {
    await ctx.storage.updateLesson(ctx.lesson.id, {media: null})
  } else {
    try {
      new URL(link)
    } catch {
      return locales.scenes.admin_lesson.wrong_link
    }
    await ctx.storage.updateLesson(ctx.lesson.id, {media: link})
  }
  return locales.scenes.admin_lesson.edited_media
}
