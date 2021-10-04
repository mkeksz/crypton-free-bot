import {checkAndAddSectionToContext} from '@/src/middlewares/admin/checkAndAddSectionToContext'
import {onlyAdmin} from '@/src/middlewares/admin/onlyAdmin'
import {AdminSceneState, AdminSectionContext} from '@/src/types/admin'
import {Scenes, Telegraf} from 'telegraf'
import locales from '@/src/locales/ru.json'
import {getQuizzesInlineKeyboard} from '@/src/scenes/admin_quizzes/inlineKeyboards'
import {checkAndAddArrowToState} from '@/src/middlewares/admin/checkAndAddArrowToState'
import {LessonStorage, QuizStorage} from '@/src/types/storage'
import {swapSectionPositions} from '@/src/util/admin/sections'
import {checkAndAddQuizToState} from '@/src/scenes/admin_quizzes/middlewares'
import {waitText} from '@/src/util/admin/actions'
import {waitingText} from '@/src/middlewares/admin/waitingText'
import {getMessageText} from '@/src/util/message'

const adminQuizzes = new Scenes.BaseScene<AdminSectionContext>('admin_quizzes')

adminQuizzes.use(onlyAdmin())
adminQuizzes.use(checkAndAddSectionToContext())

adminQuizzes.enter(checkAndAddSectionToContext(), async ctx => {
  const quizzes = await ctx.storage.getQuizzesOfSection(ctx.section.id)
  const sortedQuizzes = quizzes.sort((a, b) => a.position - b.position)
  const reply_markup = getQuizzesInlineKeyboard(sortedQuizzes).reply_markup
  const text = locales.scenes.admin_quizzes.quizzes.replace('%title%', ctx.section.textButton)
  ctx.editMessageText(text, {parse_mode: 'HTML', reply_markup})
})

adminQuizzes.action('q:new', async ctx => {
  const text = locales.scenes.admin_quizzes.wait_new_quiz
  await waitText(ctx, text)
})

adminQuizzes.action(/^q:[0-9]+$/, checkAndAddQuizToState(), async ctx => {
  const quiz = ctx.state['quiz'] as QuizStorage
  ctx.scene.enter('admin_quiz', {quizID: quiz.id})
})

adminQuizzes.action(/^q:[0-9]+:(up|down)$/, checkAndAddQuizToState(), checkAndAddArrowToState(), async ctx => {
  const targetQuiz = ctx.state['quiz'] as LessonStorage
  const direction = ctx.state['arrow'] as 'up' | 'down'
  const quizzes = await ctx.storage.getQuizzesOfSection(ctx.section.id)
  const swapResult = await swapSectionPositions(ctx, quizzes, targetQuiz, direction, 'quiz')
  swapResult && ctx.scene.reenter()
})

adminQuizzes.action('reenter', ctx => ctx.scene.reenter())

adminQuizzes.action('back', ctx => ctx.scene.enter('admin_subsection', {sectionID: ctx.section.id}))

adminQuizzes.on('text', Telegraf.optional<AdminSectionContext>(waitingText(), async ctx => {
  const messageText = getMessageText(ctx)
  const quiz = await ctx.storage.addQuiz(ctx.section.id, messageText.text, messageText.text, '[["Кнопка",1]]')
  const state = ctx.scene.state as AdminSceneState
  ctx.deleteMessage()
  ctx.scene.enter('admin_quiz', {quizID: quiz.id, editMessageID: state.editMessageID})
}))

export default adminQuizzes
