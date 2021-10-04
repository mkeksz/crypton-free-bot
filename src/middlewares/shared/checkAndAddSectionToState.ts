import {Middleware} from 'telegraf'
import {getSectionIDFromActionData, getSectionIDFromSceneState} from '@/src/util/sections'
import {ActionContext, BotContext} from '@/src/types/telegraf'
import {showAlertOldButton} from '@/src/util/alerts'

export function checkAndAddSectionToState(hasActionData: boolean): Middleware<ActionContext | BotContext> {
  return async (ctx, next) => {
    const stateSectionID = getSectionIDFromSceneState(ctx)
    const actionDataSectionID = hasActionData ? getSectionIDFromActionData(ctx as ActionContext) : null
    if (stateSectionID === undefined || (actionDataSectionID !== null && actionDataSectionID !== stateSectionID)) {
      return showAlertOldButton(ctx)
    }
    const section = await ctx.storage.getSectionOfUserByID(ctx.from!.id, stateSectionID)
    if (!section) return showAlertOldButton(ctx)
    ctx.state['section'] = section
    return next()
  }
}
