import { Update } from 'telegraf/typings/core/types/typegram'
import * as http from 'http'

export type WebhookCallbackClient = (req: (http.IncomingMessage & { body?: Update | undefined }), res: http.ServerResponse, next?: () => void) => Promise<void>
