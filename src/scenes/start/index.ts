import {Scenes} from 'telegraf'
import {BotContext} from '@/src/types/telegraf'

const start = new Scenes.BaseScene<BotContext>('start')

start.enter(async ctx  => {
  await ctx.reply('Вошел в главное меню')
})

start.leave(async ctx => {
  await ctx.reply('Покинуто главное меню')
})

start.hears('test', async ctx => {
  ctx.scene.leave()
})

export default start
