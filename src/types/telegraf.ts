import {BaseScene, SceneContext} from 'telegraf/typings/scenes'
import {Update} from 'telegraf/typings/core/types/typegram'
import * as http from 'http'
import Storage from '@/src/Storage/Storage'

export type WebhookCallback = (req: (http.IncomingMessage & { body?: Update | undefined }), res: http.ServerResponse, next?: () => void) => Promise<void>

export type Scene = BaseScene<SceneContext>

export interface BotContext extends SceneContext {
  state: {
    storage?: Storage
  }
}
