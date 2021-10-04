import {Predicate} from 'telegraf/typings/composer'
import {AdminSceneState} from '@/src/types/admin'
import {BotContext} from '@/src/types/telegraf'

export function waitingText(): Predicate<BotContext> {
  return ctx => {
    const state = ctx.scene.state as AdminSceneState
    return !!state.waitText && !!state.editMessageID
  }
}
