import {Scenes, Telegraf} from 'telegraf'
import {
  getEndLessonsInlineKeyboard,
  getNextLessonInlineKeyboard,
  getNoneQuizInlineKeyboard,
  getQuizSectionInlineKeyboard
} from './inlineKeyboards'
import {checkAndAddSectionToState} from '@/src/middlewares/shared/checkAndAddSectionToState'
import {checkAndAddLessonToState, hasRightAnswer, checkTime,} from './middlewares'
import {getMessageText} from '@/src/util/message'
import {SectionOfUser} from '@/src/types/storage'
import {BotContext} from '@/src/types/telegraf'
import {getUnixTime} from '@/src/util/common'
import locales from '@/src/locales/ru.json'
import {saveMe} from '@/src/util/mainMenu'
import {showLesson} from './helpers'


const lessons = new Scenes.BaseScene<BotContext>('lessons')

lessons.enter(checkAndAddSectionToState(false), checkAndAddLessonToState(false), showLesson)

lessons.command('saveme', saveMe)

lessons.action(/^nl:[0-9]+:[0-9]+$/, checkTime(), checkAndAddSectionToState(true), checkAndAddLessonToState(true), showLesson)

lessons.action(/^el:[0-9]+$/, checkTime(), checkAndAddSectionToState(true), async ctx => {
  const section = ctx.state['section'] as SectionOfUser
  const fullCompleted = !section.hasQuizzes
  await ctx.storage.updateCompletedSection(ctx.from!.id, section.id, fullCompleted)
  const text = locales.scenes.lessons.end_lessons.replace('%title%', section.textButton)
  const inlineKeyboard = section.hasQuizzes ? getQuizSectionInlineKeyboard(section.id) : getNoneQuizInlineKeyboard(section.id)
  ctx.editMessageText(text, inlineKeyboard)
})

lessons.action('al:wrong', checkTime(), ctx => {
  const state = ctx.scene.state as {time?: number}
  state.time = getUnixTime()
  ctx.answerCbQuery(locales.scenes.lessons.wrong_answer)
})

lessons.action(/^llq:[0-9]+$/, checkAndAddSectionToState(true), ctx => {
  ctx.state['edit'] = true
  ctx.scene.enter('trainingSections')
})

lessons.action(/^lsq:[0-9]+$/, checkAndAddSectionToState(true), ctx => {
  const section = ctx.state['section'] as SectionOfUser
  ctx.scene.enter('quizzes', {sectionID: section.id})
})

lessons.on('text', Telegraf.optional(hasRightAnswer(), ctx => {
  const state = ctx.scene.state as {rightAnswer?: string, editMessageID?: number, lessonPosition?: number, sectionID: number, isLastLesson?: boolean}
  const answer = getMessageText(ctx).text
  const isRightAnswer = answer === state.rightAnswer
  let inlineKeyboard = getNextLessonInlineKeyboard(state.sectionID, isRightAnswer ? state.lessonPosition! + 1 : state.lessonPosition!, !isRightAnswer)
  if (isRightAnswer && state.isLastLesson) inlineKeyboard = getEndLessonsInlineKeyboard(state.sectionID)
  const text = isRightAnswer ? locales.scenes.lessons.right_text_answer : locales.scenes.lessons.wrong_text_answer
  const messageID = state.editMessageID

  state.editMessageID = undefined
  state.rightAnswer = undefined
  state.lessonPosition = undefined
  state.isLastLesson = undefined
  ctx.deleteMessage()
  return ctx.telegram.editMessageText(ctx.chat!.id, messageID, undefined, text, inlineKeyboard)
}))

export default lessons
