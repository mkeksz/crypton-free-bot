import {InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {getNextLessonData} from '@/src/events/utils.queryData'
import {LessonStorage, Storage} from '@/types/storage'
import {INLINE_KEYBOARDS} from '@/src/markup'
import {EventContext} from '@/types/event'

type ReplyMarkup = InlineKeyboardMarkup | undefined
export async function showLesson(context: EventContext<'callback_query'>, lesson: LessonStorage, isWrong = false): Promise<void> {
  const media = lesson.media ? `<a href="${lesson.media}">  </a>` : ''
  const textMarkdown = `${media}${lesson.text}`

  let buttons: ReplyMarkup = INLINE_KEYBOARDS.nextLesson(lesson.sectionID, lesson.position + 1)
  if (lesson.answer) buttons = undefined
  if (lesson.AnswerButtons) buttons = INLINE_KEYBOARDS.answerButtons(lesson, isWrong)
  await context.editMessageText(textMarkdown, {
    parse_mode: 'HTML',
    reply_markup: buttons
  })
}

export async function getLesson(context: EventContext<'callback_query'>, storage: Storage): Promise<LessonStorage | null> {
  const data = getNextLessonData(context.callbackQuery)
  const userID = context.from?.id
  if (!userID || !data) return null

  const [sectionID, lessonPosition] = data
  const section = await storage.getSectionOfUserByID(userID, sectionID)
  if (!section || !section.available) return null
  return await storage.getLessonOfSectionByPosition(sectionID, lessonPosition)
}
