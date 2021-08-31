import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {createQueryDataJSON, getNextLesson} from '@/src/events/utils.queryData'
import {LessonStorage, QuizStorage, StepName, Storage} from '@/types/storage'
import {INLINE_KEYBOARDS, KEYBOARDS} from '@/src/markup'
import {EventContext} from '@/types/event'
import {REPLIES} from '@/src/texts'
import {NextQuizData, QueryName} from '@/types/callbackQuery'

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
  if (lesson.answerButtons) buttons = INLINE_KEYBOARDS.answerButtons(lesson, hasTimeButtons)
  await context.editMessageText(textMarkdown, {
    parse_mode: 'HTML',
    reply_markup: buttons
  })
}

export async function getLesson(context: EventContext<'callback_query'>, storage: Storage): Promise<LessonStorage | null | undefined> {
  const data = getNextLesson(context.callbackQuery)
  const userID = context.from?.id
  if (!userID || !data) return undefined

  const [sectionID, lessonPosition] = data
  const section = await storage.getSectionOfUserByID(userID, sectionID)
  if (!section || !section.available) return undefined
  return await storage.getLessonOfSectionByPosition(sectionID, lessonPosition)
}

export async function goToMainMenu(context: EventContext, text = REPLIES.unknownCommand): Promise<void> {
  await context.reply(text, KEYBOARDS.main)
}

type ButtonsQuizData = [text: string, isRight: 0 | 1 | undefined][]
export async function showQuiz(context: EventContext<'callback_query'>, storage: Storage, quiz: QuizStorage, numRightAnswers: number): Promise<void> {
  const quizButtons = JSON.parse(quiz.buttons) as ButtonsQuizData
  const buttons: InlineKeyboardButton[][] = []

  for (const [text, isRight] of quizButtons) {
    const data: NextQuizData = [quiz.sectionID, quiz.position + 1, isRight ? numRightAnswers + 1 : numRightAnswers]
    const dataJSON = createQueryDataJSON(QueryName.startQuiz, data)
    const inlineButton: InlineKeyboardButton = {text, callback_data: dataJSON}
    buttons.push([inlineButton])
  }

  await context.editMessageText(quiz.text, {
    reply_markup: {inline_keyboard: buttons}
  })
}
