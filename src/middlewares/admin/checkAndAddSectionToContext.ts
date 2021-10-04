import {Middleware} from 'telegraf'
import {AdminSectionContext} from '@/src/types/admin'
import {getSectionIDFromSceneState} from '@/src/util/sections'
import {BotContext} from '@/src/types/telegraf'
import {showAlertOldButton} from '@/src/util/alerts'

export function checkAndAddSectionToContext(checkParent = false): Middleware<AdminSectionContext> {
  return async (ctx, next) => {
    const sectionID = getSectionIDFromSceneState(ctx as BotContext)
    const section = await ctx.storage.getSectionByID(sectionID)
    if (!section || (checkParent && !section.parentSectionID)) return showAlertOldButton(ctx)
    ctx.section = section
    return next()
  }
}
