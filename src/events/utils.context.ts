import {LessonStorage} from '@/types/storage'
import {INLINE_KEYBOARDS} from '@/src/markup'
import {EventContext} from '@/types/event'
import {InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'

type ReplyMarkup = InlineKeyboardMarkup | undefined
export async function showLesson(context: EventContext<'callback_query'>, lesson: LessonStorage): Promise<void> {
  const media = lesson.media ? `<a href="${lesson.media}">  </a>` : ''
  const textMarkdown = `${media}${lesson.text}`

  let buttons: ReplyMarkup = INLINE_KEYBOARDS.nextLesson(lesson.sectionID, lesson.position + 1)
  if (lesson.answer) buttons = undefined
  if (lesson.AnswerButtons) buttons = INLINE_KEYBOARDS.answerButtons(lesson)

  await context.editMessageText(textMarkdown, {
    parse_mode: 'HTML',
    reply_markup: buttons
  })
}
