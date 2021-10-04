import {BotContext} from '@/src/types/telegraf'

export function reenter(ctx: BotContext): Promise<unknown> | undefined {
  ctx.state['edit'] = true
  return  ctx.scene.reenter()
}
