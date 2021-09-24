import {Middleware} from 'telegraf'
import {BotContext} from '@/src/types/telegraf'

export function errorHandler(): Middleware<BotContext> {
  return async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      console.error(ctx, error)
      await ctx.reply('Неизвестная ошибка.')
    }
  }
}
