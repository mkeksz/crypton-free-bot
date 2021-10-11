import {Middleware} from 'telegraf'
import {BotContext} from '@/src/types/telegraf'
import locales from '@/src/locales/ru.json'
import config from '@/config'

export function onlyAdmin(onlyMainAdmin = false): Middleware<BotContext> {
  return async (ctx, next) => {
    const userID = ctx.from!.id
    const user = await ctx.storage.getUserByID(userID)
    const isMainAdmin = userID === config.TG_ADMIN_ID
    if (!user || (onlyMainAdmin && !isMainAdmin) || (!user.admin && !isMainAdmin)) {
      ctx.scene.reset()
      return ctx.reply(locales.shared.only_admin)
    }
    return next()
  }
}
