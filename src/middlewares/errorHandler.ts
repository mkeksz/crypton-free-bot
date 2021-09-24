import {Middleware} from 'telegraf'
import {BotContext} from '@/src/types/telegraf'
import locales from '../locales/ru.json'

export function errorHandler(): Middleware<BotContext> {
  return async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      console.error(ctx, error)
      await ctx.reply(locales.shared.something_went_wrong)
    }
  }
}
