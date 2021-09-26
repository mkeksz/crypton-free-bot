import {Scenes} from 'telegraf'
import {checkAndAddLessonToState, checkAndAddSectionToState, checkTime} from './middlewares'
import {SectionOfUser} from '@/src/types/storage'
import {BotContext} from '@/src/types/telegraf'
import locales from '@/src/locales/ru.json'
import {getQuizSectionInlineKeyboard, showLesson} from './helpers'
import {getUnixTime} from '@/src/util/common'

const lessons = new Scenes.BaseScene<BotContext>('lessons')

lessons.enter(checkAndAddSectionToState(false), checkAndAddLessonToState(false), showLesson)

lessons.action(/^nl:[0-9]+:[0-9]+$/, checkTime(), checkAndAddSectionToState(true), checkAndAddLessonToState(true), showLesson)

lessons.action(/^el:[0-9]+$/, checkTime(), checkAndAddSectionToState(true), ctx => {
  const section = ctx.state['section'] as SectionOfUser
  const text = locales.scenes.lessons.end_lessons.replace('%title%', section.textButton)
  ctx.editMessageText(text, getQuizSectionInlineKeyboard(section.id))
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
  ctx.editMessageText('Старт квиза')
})

export default lessons