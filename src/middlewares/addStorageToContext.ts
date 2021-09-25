import {Middleware} from 'telegraf'
import Storage from '@/src/Storage/Storage'
import {BotContext} from '@/src/types/telegraf'

export function addStorageToContext(storage: Storage): Middleware<BotContext> {
  return async (ctx, next) => {
    ctx.storage = storage
    await next()
  }
}
