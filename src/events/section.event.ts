import {getNumberData} from '@/src/events/utils.queryData'
import {ClientEvent, EventTypes} from '@/types/event'
import {showLesson} from '@/src/events/utils.context'
import {ANSWER_CB_QUERY, REPLIES} from '@/src/texts'
import {QueryName} from '@/types/callbackQuery'
import {INLINE_KEYBOARDS} from '@/src/markup'

const event: ClientEvent<'callback_query'> = {
  name: QueryName.section,
  type: EventTypes.callbackQuery,
  execute: async (context, storage) => {
    const sectionID = getNumberData(context.callbackQuery)
    const userID = context.from?.id
    if (!userID || !sectionID) return

    const section = await storage.getSectionOfUserByID(userID, sectionID)
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
