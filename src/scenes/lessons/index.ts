import {Scenes} from 'telegraf'
import {BotContext} from '@/src/types/telegraf'
import {getSectionIDFromSceneState} from '@/src/scenes/lessons/helpers'

const lessons = new Scenes.BaseScene<BotContext>('lessons')

lessons.enter(async (ctx: BotContext) => {
  const sectionID = getSectionIDFromSceneState(ctx)
  console.log(sectionID)
  await ctx.editMessageText('Урок 1')
})

export default lessons
