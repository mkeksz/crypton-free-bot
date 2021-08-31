import {QueryName} from '@/types/callbackQuery'
import {getQueryData} from '@/src/events/utils'
import {ClientEvent, EventTypes} from '@/types/event'
import {INLINE_KEYBOARDS} from '@/src/markup'
import {ANSWER_CB_QUERY, REPLIES} from '@/src/texts'
import {showLesson} from '@/src/events/utils.context'

const event: ClientEvent<'callback_query'> = {
  name: QueryName.section,
  type: EventTypes.callbackQuery,
  execute: async (context, storage) => {
    const data = getQueryData(context.callbackQuery)
    const userID = context.from?.id
    if (!userID || typeof data?.d !== 'number') return

    const section = await storage.getSectionOfUserByID(userID, data.d)
    if (!section) return

    if (!section.available) {
      await context.answerCbQuery(ANSWER_CB_QUERY.lockedLesson)
      return
    }

    if (!section.parentSectionID) {
      const childSections = await storage.getChildSectionsOfUser(userID, section.id)
      await context.editMessageText(REPLIES.selectedSection(section), {
        parse_mode: 'MarkdownV2',
        reply_markup: INLINE_KEYBOARDS.trainingSections(childSections, true)
      })
    } else {
      const lesson = await storage.getLessonOfSectionByPosition(section.id, 0)
      if (!lesson) return
      await showLesson(context, lesson)
    }
  }
}

export default event
