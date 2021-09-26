import {Scenes} from 'telegraf'
import {BotContext} from '@/src/types/telegraf'

const quizzes = new Scenes.BaseScene<BotContext>('quizzes')

quizzes.enter(ctx => {
  const state = ctx.scene.state as {sectionID: number}
  ctx.editMessageText(`Старт квиза ${state.sectionID}`)
})

export default quizzes
