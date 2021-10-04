import {BotContext} from '@/src/types/telegraf'

export function getEditFromState(ctx: BotContext): boolean {
  const edit = ctx.state['edit'] as unknown
  return Boolean(edit)
}
