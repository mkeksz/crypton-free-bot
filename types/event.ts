import {EventContext} from '@/types/telegraf'

export type EventExecute = (context: EventContext) => Promise<void>

export enum EventTypes {
  command = 'command'
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
