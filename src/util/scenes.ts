import {BotContext} from '@/src/types/telegraf'

export function getSectionIDFromSceneState(ctx: BotContext): number | undefined {
  const state = ctx.scene.state as {sectionID: number}
  const sectionID = Number(state.sectionID)
  if (isNaN(sectionID)) return undefined
  return state.sectionID
}
