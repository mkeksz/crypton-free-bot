import {Middleware} from 'telegraf'
import {BotContext} from '@/src/types/telegraf'

export function updateUserOfStorage(): Middleware<BotContext> {
  return async (ctx, next) => {
    await ctx.state.storage!.addUserIfNeed(ctx.from!.id)
    await next()
  }
}
