import {Middleware} from 'telegraf'
import Storage from '@/src/Storage/Storage'
import {BotContext} from '@/src/types/telegraf'

export function addStorage(storage: Storage): Middleware<BotContext> {
  return async (ctx, next) => {
    ctx.state['storage'] = storage
    await next()
  }
}
