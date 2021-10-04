import {onlyAdmin} from '@/src/middlewares/admin/onlyAdmin'
import {AdminQuizContext, AdminSceneState} from '@/src/types/admin'
import {Scenes, Telegraf} from 'telegraf'
import {checkAndAddQuizToContext} from './middlewares'
import {backToAdminQuizzes, editButtonsAnswer, editQuiz, showAdminQuiz} from './helpers'
import {clearWaitTextSceneState} from '@/src/util/admin/scene'
import locales from '@/src/locales/ru.json'
import {waitText} from '@/src/util/admin/actions'
import {waitingText} from '@/src/middlewares/admin/waitingText'
import {getMessageText} from '@/src/util/message'
import {getReenterInlineKeyboard} from '@/src/inlineKeyboards/admin'

const adminQuiz = new Scenes.BaseScene<AdminQuizContext>('admin_quiz')

adminQuiz.use(onlyAdmin())
adminQuiz.use(checkAndAddQuizToContext())

adminQuiz.enter(checkAndAddQuizToContext(), async ctx => {
  const state = ctx.scene.state as {editMessageID?: number}
  await showAdminQuiz(ctx, state.editMessageID)
})

adminQuiz.action('edit:buttons', async ctx => {
  const buttonAnswers: [string, 1?][] = ctx.quiz.buttons ? JSON.parse(ctx.quiz.buttons) : ['-']
  const textButtonAnswers = buttonAnswers.map(button => button[1] ? `+ ${button[0]}` : button[0]).join('\n')
  const text = locales.scenes.admin_quizzes.edit_buttons.replace('%buttons%', textButtonAnswers)
  await waitText(ctx, text, 'buttons')
})

adminQuiz.action('edit', async ctx => {
  const text = locales.scenes.admin_quizzes.edit
  await waitText(ctx, text, 'edit')
})

adminQuiz.action('reenter', ctx => {
  clearWaitTextSceneState(ctx)
  ctx.scene.reenter()
})

adminQuiz.action('delete', async ctx => {
  await ctx.storage.deleteQuiz(ctx.quiz.id)
  await backToAdminQuizzes(ctx)
})

adminQuiz.action('back', backToAdminQuizzes)

adminQuiz.on('text', Telegraf.optional<AdminQuizContext>(waitingText(), async ctx => {
  const state = ctx.scene.state as AdminSceneState
  const typeWait = state.text
  const message = getMessageText(ctx)
  const reply_markup = getReenterInlineKeyboard().reply_markup
  let text = '-'
  if (typeWait === 'buttons') text = await editButtonsAnswer(ctx, message.text)
  else if (typeWait === 'edit') text = await editQuiz(ctx)

  ctx.telegram.editMessageText(ctx.chat!.id, state.editMessageID, undefined, text, {parse_mode: 'HTML', reply_markup})
  clearWaitTextSceneState(ctx)
  ctx.deleteMessage()
}))

export default adminQuiz
