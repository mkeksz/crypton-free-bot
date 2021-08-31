import {QueryName} from '@/types/callbackQuery'
import {ClientEvent, EventTypes} from '@/types/event'

const event: ClientEvent<'callback_query'> = {
  name: QueryName.backToMenu,
  type: EventTypes.callbackQuery,
  execute: async context => {
    await context.deleteMessage()
  }
}

export default event
