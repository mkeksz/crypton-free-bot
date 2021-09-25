import {Middleware} from 'telegraf'
import {getSectionFromActionData, showAlertLockedSection} from './helpers'
import {showAlertOldButton} from '@/src/util/alerts'
import {ActionContext} from '@/src/types/telegraf'

export function checkAndAddSectionToState(isSubsection: boolean): Middleware<ActionContext> {
  return async (ctx, next) => {
    const section = await getSectionFromActionData(ctx)
    const hasParent = section?.parentSectionID !== null
    if (!section || (!isSubsection && hasParent) || (isSubsection && !hasParent)) return showAlertOldButton(ctx)
    if (!section.available) return showAlertLockedSection(ctx)
    ctx.state['section'] = section
    return next()
  }
}
