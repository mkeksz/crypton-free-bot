import {EventContext} from '@/types/telegraf'
import {Storage} from '@/types/storage'

export type EventExecute = (context: EventContext, storage: Storage) => Promise<void>

export enum EventTypes {
  command = 'command',
  text = 'text'
}

export enum CommandNames {
  start = 'start'
}

export type EventNames = CommandNames | string

export interface ClientEvent {
  name: EventNames,
  type: EventTypes,
  execute: EventExecute
}
