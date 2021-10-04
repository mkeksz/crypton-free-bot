import {checkAndAddLessonToContext} from '@/src/scenes/admin_lesson/middlewares'
import {
  backToAdminLessons,
  editAnswer,
  editButtonsAnswer,
  editLesson,
  editMedia
} from '@/src/scenes/admin_lesson/helpers'
import {onlyAdmin} from '@/src/middlewares/admin/onlyAdmin'
import {showAdminLesson} from '@/src/util/admin/lesson'
import {AdminLessonContext, AdminSceneState} from '@/src/types/admin'
import {Scenes, Telegraf} from 'telegraf'
import {waitingText} from '@/src/middlewares/admin/waitingText'
import {waitText} from '@/src/util/admin/actions'
import locales from '@/src/locales/ru.json'
import {getMessageText} from '@/src/util/message'
import {clearWaitTextSceneState} from '@/src/util/admin/scene'
import {getReenterInlineKeyboard} from '@/src/inlineKeyboards/admin'

const adminLesson = new Scenes.BaseScene<AdminLessonContext>('admin_lesson')

adminLesson.use(onlyAdmin())
adminLesson.use(checkAndAddLessonToContext())

adminLesson.enter(checkAndAddLessonToContext(), async ctx => {
  const state = ctx.scene.state as {editMessageID?: number}
  await showAdminLesson(ctx, state.editMessageID)
})

adminLesson.action('edit:buttons', async ctx => {
  const buttonAnswers: [string, 1?][] = ctx.lesson.answerButtons ? JSON.parse(ctx.lesson.answerButtons) : ['-']
  const textButtonAnswers = buttonAnswers
    .map(button => {
      return button[1] ? `+ ${button[0]}` : button[0]
    })
    .join('\n')
  const text = locales.scenes.admin_lesson.edit_buttons.replace('%buttons%', textButtonAnswers)
  await waitText(ctx, text, 'buttons')
})

adminLesson.action('edit:answer', async ctx => {
  const answer = ctx.lesson.answer ? ctx.lesson.answer : '-'
  const text = locales.scenes.admin_lesson.edit_answer.replace('%answer%', answer)
  await waitText(ctx, text, 'answer')
})

adminLesson.action('media', async ctx => {
  const text = locales.scenes.admin_lesson.edit_media
  await waitText(ctx, text, 'media')
})

adminLesson.action('delete', async ctx => {
  await ctx.storage.deleteLesson(ctx.lesson.id)
  await backToAdminLessons(ctx)
})
// TODO добавить возможность изменять содержимое именно на фото/видео, если потребуется.
adminLesson.action('edit', async ctx => {
  const text = locales.scenes.admin_lesson.edit_lesson
  await waitText(ctx, text, 'edit')
})

adminLesson.action('reenter', ctx => {
  clearWaitTextSceneState(ctx)
  ctx.scene.reenter()
})

adminLesson.action('back', backToAdminLessons)

adminLesson.on('text', Telegraf.optional<AdminLessonContext>(waitingText(), async ctx => {
  const state = ctx.scene.state as AdminSceneState
  const typeWait = state.text
  const message = getMessageText(ctx)
  const reply_markup = getReenterInlineKeyboard().reply_markup
  let text = '-'
  if (typeWait === 'buttons') text = await editButtonsAnswer(ctx, message.text)
  else if (typeWait === 'answer') text = await editAnswer(ctx, message.text)
  else if (typeWait === 'edit') text = await editLesson(ctx)
  else if (typeWait === 'media') text = await editMedia(ctx, message.text)

  ctx.telegram.editMessageText(ctx.chat!.id, state.editMessageID, undefined, text, {parse_mode: 'HTML', reply_markup})
  clearWaitTextSceneState(ctx)
  ctx.deleteMessage()
}))

export default adminLesson
