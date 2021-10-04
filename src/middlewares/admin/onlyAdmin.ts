import {Middleware} from 'telegraf'
import {BotContext} from '@/src/types/telegraf'
import locales from '@/src/locales/ru.json'
import config from '@/config'

export function onlyAdmin(): Middleware<BotContext> {
  return async (ctx, next) => {
    if (ctx.from!.id !== config.TG_ADMIN_ID) return ctx.reply(locales.shared.only_admin)
    return next()
  }
}
