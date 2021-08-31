import {InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {getNextLessonData} from '@/src/events/utils.queryData'
import {LessonStorage, StepName, Storage} from '@/types/storage'
import {INLINE_KEYBOARDS, KEYBOARDS} from '@/src/markup'
import {EventContext} from '@/types/event'
import {REPLIES} from '@/src/texts'

type ReplyMarkup = InlineKeyboardMarkup | undefined
export async function showLesson(context: EventContext<'callback_query'>, storage: Storage, lesson: LessonStorage, hasTimeButtons = false): Promise<void> {
  const media = lesson.media ? `<a href="${lesson.media}">  </a>` : ''
  const textMarkdown = `${media}${lesson.text}`

  let buttons: ReplyMarkup = INLINE_KEYBOARDS.nextLesson(lesson.sectionID, lesson.position + 1)
  if (lesson.answer) {
    buttons = undefined
    const messageID = context.callbackQuery.message?.message_id
    const userID = context.from?.id
    if (!userID || !messageID) return
    await storage.setStepUser(userID, {lessonID: lesson.id, messageID, name: StepName.waitAnswerLesson})
  }
  if (lesson.AnswerButtons) buttons = INLINE_KEYBOARDS.answerButtons(lesson, hasTimeButtons)
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

export async function goToMainMenu(context: EventContext, text = REPLIES.unknownCommand): Promise<void> {
  await context.reply(text, KEYBOARDS.main)
}
