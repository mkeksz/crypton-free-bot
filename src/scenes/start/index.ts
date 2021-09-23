import {Scenes} from 'telegraf'

const start = new Scenes.BaseScene<Scenes.SceneContext>('start')

start.enter(async ctx  => {
  await ctx.reply('Вошел в главное меню')
})

start.leave(async ctx => {
  await ctx.reply('Покинуто главное меню')
})

export default start
