import {EventContext} from '@/types/telegraf'

export enum EventNames {
  start = 'start'
}

export enum EventTypes {
  command = 'command'
}

export type EventExecute = (context: EventContext) => Promise<void>

export interface ClientEvent {
  name: EventNames,
  type: EventTypes,
  execute: EventExecute
}
