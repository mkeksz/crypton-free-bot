import {CallbackQueryName} from '@/types/callbackQuery'
import {ClientEvent, EventTypes} from '@/types/event'
import {getDataFromCallbackQuery} from '@/src/events/utils'
import {INLINE_KEYBOARDS} from '@/src/markup'
import {REPLIES} from '@/src/texts'

const event: ClientEvent<'callback_query'> = {
  name: CallbackQueryName.section,
  type: EventTypes.callbackQuery,
  execute: async (context, storage) => {
    const data = getDataFromCallbackQuery(context.callbackQuery)
    const userID = context.from?.id
    if (!userID || typeof data?.d !== 'number') return

    const section = await storage.getSectionOfUserByID(userID, data.d)
    if (!section) return // TODO сделать отправку сообщения о неизвестной команде и вернуть пользователя в главное меню (это же выполнять при неизвестной ошибке и добавить во всех событиях)
    const childSections = await storage.getChildSectionsOfUser(userID, section.id)
    await context.editMessageText(REPLIES.selectedSection(section), INLINE_KEYBOARDS.trainingSections(childSections, true))
  }
}

export default event
