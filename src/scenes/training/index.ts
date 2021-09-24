import {Scenes} from 'telegraf'
import {BotContext} from '@/src/types/telegraf'

const training = new Scenes.BaseScene<BotContext>('training')

training.enter(async ctx => {
  await ctx.reply('Обучение')
})

export default training
