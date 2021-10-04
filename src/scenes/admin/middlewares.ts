import {getSectionIDFromActionData} from '@/src/util/sections'
import {showAlertOldButton} from '@/src/util/alerts'
import {ActionContext} from '@/src/types/telegraf'
import {Middleware} from 'telegraf'

export function checkAndAddSectionToState(): Middleware<ActionContext> {
  return async (ctx, next) => {
    const sectionID = getSectionIDFromActionData(ctx as ActionContext)
    const section = await ctx.storage.getSectionByID(sectionID)
    if (!section) return showAlertOldButton(ctx)
    ctx.state['section'] = section
    return next()
  }
}
