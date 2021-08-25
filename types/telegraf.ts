import {MessageSubType, MountMap, UpdateType} from 'telegraf/typings/telegram-types'
import {Context, NarrowedContext} from 'telegraf'

type MatchedContext<C extends Context, T extends UpdateType | MessageSubType> = NarrowedContext<C, MountMap[T]>

export type EventContext = MatchedContext<Context, 'text'>
export type EventCallback = (context: EventContext) => Promise<void>
