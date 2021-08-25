import {ClientEvent, EventNames, EventTypes} from '@/types/event'

const event: ClientEvent = {
  name: EventNames.start,
  type: EventTypes.command,
  execute: async context => {
    await context.reply('Добро пожаловать!')
  }
}

export default event
