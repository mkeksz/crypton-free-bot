import {BotContext} from '@/src/types/telegraf'

export async function backToAdmin(ctx: BotContext): Promise<void> {
  ctx.state['edit'] = true
  await ctx.scene.enter('admin')
}
