import {SceneContext, BaseScene} from 'telegraf/typings/scenes'
import {Update} from 'telegraf/typings/core/types/typegram'
import {NarrowedContext, Scenes, Types} from 'telegraf'
import * as http from 'http'
import Storage from '../Storage/Storage'

export type WebhookCallback = (req: (http.IncomingMessage & { body?: Update | undefined }), res: http.ServerResponse, next?: () => void) => Promise<void>

export type Scene = BaseScene<SceneContext>

export type ActionContext = NarrowedContext<BotContext & { match: RegExpExecArray }, Types.MountMap['callback_query']>
export interface BotContext extends Scenes.SceneContext {
  storage: Storage
}
