import {CallbackQueryName} from '@/types/callbackQuery'
import {getDataFromCallbackQuery} from '@/src/events/utils'
import {ClientEvent, EventTypes} from '@/types/event'
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
    if (!section) return

    if (!section.parentSectionID) {
      const childSections = await storage.getChildSectionsOfUser(userID, section.id)
      await context.editMessageText(REPLIES.selectedSection(section), {
        parse_mode: 'MarkdownV2',
        reply_markup: INLINE_KEYBOARDS.trainingSections(childSections, true)
      })
    } else {
      const lesson = await storage.getLessonOfSectionByPosition(section.id, 0)
      if (!lesson) return
      await context.editMessageText(lesson.textMarkdown, {
        parse_mode: 'MarkdownV2',
        reply_markup: INLINE_KEYBOARDS.nextLesson(0)
      })
    }
  }
}

export default event
