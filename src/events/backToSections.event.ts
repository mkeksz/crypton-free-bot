import {QueryName} from '@/types/callbackQuery'
import {ClientEvent, EventTypes} from '@/types/event'
import {INLINE_KEYBOARDS} from '@/src/markup'
import {REPLIES} from '@/src/texts'

const event: ClientEvent<'callback_query'> = {
  name: QueryName.backToMainSections,
  type: EventTypes.callbackQuery,
  execute: async (context, storage) => {
    const userID = context.from?.id
    if (!userID) return

    const sections = await storage.getSectionsOfUser(userID, true)
    await context.editMessageText(REPLIES.training, {reply_markup: INLINE_KEYBOARDS.trainingSections(sections)})
  }
}

export default event
