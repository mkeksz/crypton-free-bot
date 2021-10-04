import {getSectionIDFromActionData} from '@/src/util/sections'
import {AdminSectionContext} from '@/src/types/admin'
import {showAlertOldButton} from '@/src/util/alerts'
import {ActionContext} from '@/src/types/telegraf'
import {Middleware} from 'telegraf'

export function checkAndAddSubsectionToState(): Middleware<AdminSectionContext & ActionContext> {
  return async (ctx, next) => {
    const sectionID = getSectionIDFromActionData(ctx as ActionContext)
    const section = await ctx.storage.getSectionByID(sectionID)
    if (!section) return showAlertOldButton(ctx)
    ctx.state['subsection'] = section
    return next()
  }
}
