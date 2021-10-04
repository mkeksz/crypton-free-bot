import {AdminSceneState} from '@/src/types/admin'
import {BotContext} from '@/src/types/telegraf'

export function clearWaitTextSceneState(ctx: BotContext): void {
  const state = ctx.scene.state as AdminSceneState
  state.waitText = undefined
  state.editMessageID = undefined
  state.text = undefined
}
