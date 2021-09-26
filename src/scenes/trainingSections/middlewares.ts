import {Middleware} from 'telegraf'
import {showAlertLockedSection} from './helpers'
import {showAlertOldButton} from '@/src/util/alerts'
import {ActionContext} from '@/src/types/telegraf'
import {getSectionIDFromActionData} from '@/src/util/section'

export function checkAndAddSectionToState(isSubsection: boolean): Middleware<ActionContext> {
  return async (ctx, next) => {
    const sectionID = getSectionIDFromActionData(ctx)
    const section = await ctx.storage.getSectionOfUserByID(ctx.from!.id, sectionID)
    const hasParent = section?.parentSectionID !== null
    if (!section || (!isSubsection && hasParent) || (isSubsection && !hasParent) || (isSubsection && !section.lessons.length)) return showAlertOldButton(ctx)
    if (!section.available) return showAlertLockedSection(ctx)
    ctx.state['section'] = section
    return next()
  }
}
