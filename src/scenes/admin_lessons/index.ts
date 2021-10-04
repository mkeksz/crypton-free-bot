import {checkAndAddSectionToContext} from '@/src/middlewares/admin/checkAndAddSectionToContext'
import {getLessonsInlineKeyboard} from '@/src/scenes/admin_lessons/inlineKeyboards'
import {checkAndAddLessonToState} from '@/src/scenes/admin_lessons/middlewares'
import {AdminSceneState, AdminSectionContext} from '@/src/types/admin'
import {waitingText} from '@/src/middlewares/admin/waitingText'
import {onlyAdmin} from '@/src/middlewares/admin/onlyAdmin'
import {waitText} from '@/src/util/admin/actions'
import {getMessageText} from '@/src/util/message'
import {LessonStorage} from '@/src/types/storage'
import locales from '@/src/locales/ru.json'
import {Scenes, Telegraf} from 'telegraf'
import {swapSectionPositions} from '@/src/util/admin/sections'
import {checkAndAddArrowToState} from '@/src/middlewares/admin/checkAndAddArrowToState'

const adminLessons = new Scenes.BaseScene<AdminSectionContext>('admin_lessons')

adminLessons.use(onlyAdmin())
adminLessons.use(checkAndAddSectionToContext())

adminLessons.enter(checkAndAddSectionToContext(), async ctx => {
  const lessons = await ctx.storage.getLessonsOfSection(ctx.section.id)
  const sortedLessons = lessons.sort((a, b) => a.position - b.position)
  const reply_markup = getLessonsInlineKeyboard(sortedLessons).reply_markup
  const text = locales.scenes.admin_lessons.lessons.replace('%title%', ctx.section.textButton)
  ctx.editMessageText(text, {parse_mode: 'HTML', reply_markup})
})

adminLessons.action('l:new', async ctx => {
  const text = locales.scenes.admin_lessons.wait_new_lesson
  await waitText(ctx, text)
})

adminLessons.action(/^l:[0-9]+$/, checkAndAddLessonToState(), async ctx => {
  const lesson = ctx.state['lesson'] as LessonStorage
  ctx.scene.enter('admin_lesson', {lessonID: lesson.id})
})

adminLessons.action(/^l:[0-9]+:(up|down)$/, checkAndAddLessonToState(), checkAndAddArrowToState(), async ctx => {
  const targetSection = ctx.state['lesson'] as LessonStorage
  const direction = ctx.state['arrow'] as 'up' | 'down'
  const lessons = await ctx.storage.getLessonsOfSection(ctx.section.id)
  const swapResult = await swapSectionPositions(ctx, lessons, targetSection, direction, 'lesson')
  swapResult && ctx.scene.reenter()
})

adminLessons.action('reenter', ctx => ctx.scene.reenter())

adminLessons.action('back', ctx => ctx.scene.enter('admin_subsection', {sectionID: ctx.section.id}))

adminLessons.on('message', Telegraf.optional<AdminSectionContext>(waitingText(), async ctx => {
  const messageText = getMessageText(ctx)
  const lesson = await ctx.storage.addLesson(ctx.section.id, messageText.text)
  const state = ctx.scene.state as AdminSceneState
  ctx.deleteMessage()
  ctx.scene.enter('admin_lesson', {lessonID: lesson.id, editMessageID: state.editMessageID})
}))

export default adminLessons
