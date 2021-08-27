import {CallbackQueryName} from '@/types/callbackQuery'
import {ClientEvent, EventTypes} from '@/types/event'
import {getDataFromCallbackQuery} from '@/src/events/utils'

const event: ClientEvent<'callback_query'> = {
  name: CallbackQueryName.section,
  type: EventTypes.callbackQuery,
  execute: async (context, storage) => {
    const data = getDataFromCallbackQuery(context.callbackQuery)
    console.log(data)
  }
}

export default event
