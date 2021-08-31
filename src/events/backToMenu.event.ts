import {QueryName} from '@/types/callbackQuery'
import {getQueryData} from '@/src/events/utils'
import {ClientEvent, EventTypes} from '@/types/event'

const event: ClientEvent<'callback_query'> = {
  name: QueryName.backToMenu,
  type: EventTypes.callbackQuery,
  execute: async context => {
    const data = getQueryData(context.callbackQuery)
    const userID = context.from?.id
    if (!userID || !data) return
    await context.deleteMessage()
  }
}

export default event
