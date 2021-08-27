import {MessageSubType, MountMap, UpdateType} from 'telegraf/typings/telegram-types'
import {Context, NarrowedContext} from 'telegraf'
import {Storage} from '@/types/storage'

type MatchedContext<C extends Context, T extends UpdateType | MessageSubType> = NarrowedContext<C, MountMap[T]>
export type TypeContext = 'text' | 'callback_query'

export type EventContext<T extends TypeContext = TypeContext> = MatchedContext<Context, T>
export type EventCallback<T extends TypeContext = TypeContext> = (context: EventContext<T>) => Promise<void>
export type EventExecute<T extends TypeContext = TypeContext> = (context: EventContext<T>, storage: Storage) => Promise<void>

export enum CommandNames {
  start = 'start'
}
export type EventNames = CommandNames | string

export enum EventTypes {
  command = 'command',
  text = 'text'
}

export interface ClientEvent<T extends TypeContext = TypeContext> {
  name: EventNames,
  type: EventTypes,
  execute: EventExecute<T>
}
