import {Scenes} from 'telegraf'
import {checkAndAddLessonToState, checkAndAddSectionToState} from './middlewares'
import {SectionOfUser} from '@/src/types/storage'
import {BotContext} from '@/src/types/telegraf'
import locales from '@/src/locales/ru.json'
import {getQuizSectionInlineKeyboard, showLesson} from './helpers'

const lessons = new Scenes.BaseScene<BotContext>('lessons')

lessons.enter(checkAndAddSectionToState(false), checkAndAddLessonToState(false), showLesson)

lessons.action(/^nl:[0-9]+:[0-9]+$/, checkAndAddSectionToState(true), checkAndAddLessonToState(true), showLesson)

lessons.action(/^el:[0-9]+$/, checkAndAddSectionToState(true), ctx => {
  const section = ctx.state['section'] as SectionOfUser
  const text = locales.scenes.lessons.end_lessons.replace('%title%', section.textButton)
  ctx.editMessageText(text, getQuizSectionInlineKeyboard(section.id))
})

lessons.action(/^llq:[0-9]+$/, checkAndAddSectionToState(true), ctx => {
  ctx.state['edit'] = true
  ctx.scene.enter('trainingSections')
})

lessons.action(/^lsq:[0-9]+$/, checkAndAddSectionToState(true), ctx => {
  ctx.editMessageText('Старт квиза')
})

export default lessons
