import {ActionContext} from '@/src/types/telegraf'
import {Middleware} from 'telegraf'

export function checkAndAddArrowToState(): Middleware<ActionContext> {
  return async (ctx, next) => {
    const data = ctx.match[0]
    const [,,arrow] = data.split(':')
    ctx.state['arrow'] = arrow
    return next()
  }
}
