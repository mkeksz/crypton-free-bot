import {ActionContext, BotContext} from '@/src/types/telegraf'

export function getSectionIDFromSceneState(ctx: BotContext): number | undefined {
  const state = ctx.scene.state as {sectionID: number}
  const sectionID = Number(state.sectionID)
  if (isNaN(sectionID)) return undefined
  return state.sectionID
}

export function getSectionIDFromActionData(ctx: ActionContext): number {
  const data = ctx.match[0]
  const [,sectionID] = data.split(':')
  return Number(sectionID)
}
