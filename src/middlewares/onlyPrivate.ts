import {BotContext} from '@/src/types/telegraf'
import {Middleware} from 'telegraf'

export function onlyPrivate(): Middleware<BotContext> {
  return async (ctx, next) => {
    if (ctx.chat?.type !== 'private' || ctx.from?.is_bot || !ctx.from) return
    await next()
  }
}
