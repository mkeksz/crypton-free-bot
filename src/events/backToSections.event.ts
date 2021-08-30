import {CallbackQueryName} from '@/types/callbackQuery'
import {ClientEvent, EventTypes} from '@/types/event'
import {getDataFromCallbackQuery} from '@/src/events/utils'
import {INLINE_KEYBOARDS} from '@/src/markup'
import {REPLIES} from '@/src/texts'

const event: ClientEvent<'callback_query'> = {
  name: CallbackQueryName.backToMainSections,
  type: EventTypes.callbackQuery,
  execute: async (context, storage) => {
    const data = getDataFromCallbackQuery(context.callbackQuery)
    const userID = context.from?.id
    if (!userID || !data) return

    const sections = await storage.getSectionsOfUser(userID, true)
    await context.editMessageText(REPLIES.training, {reply_markup: INLINE_KEYBOARDS.trainingSections(sections)})
  }
}

export default event
