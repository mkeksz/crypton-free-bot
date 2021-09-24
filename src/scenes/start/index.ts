import {Scenes} from 'telegraf'
import {BotContext} from '@/src/types/telegraf'

const start = new Scenes.BaseScene<BotContext>('start')

start.enter(async ctx  => {
  await ctx.reply('test')
})

// start.leave(async ctx => {
//   await ctx.reply('Покинуто главное меню')
// })

export default start
