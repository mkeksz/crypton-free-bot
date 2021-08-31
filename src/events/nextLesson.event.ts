import {getNextLessonData} from '@/src/events/utils.queryData'
import {ClientEvent, EventTypes} from '@/types/event'
import {showLesson} from '@/src/events/utils.context'
import {QueryName} from '@/types/callbackQuery'

const event: ClientEvent<'callback_query'> = {
  name: QueryName.nextLesson,
  type: EventTypes.callbackQuery,
  execute: async (context, storage) => {
    const data = getNextLessonData(context.callbackQuery)
    const userID = context.from?.id
    if (!userID || !data) return

    const [sectionID, lessonPosition] = data
    const section = await storage.getSectionOfUserByID(userID, sectionID)
    if (!section || !section.available) return
    const lesson = await storage.getLessonOfSectionByPosition(sectionID, lessonPosition)
    if (!lesson) return
    await showLesson(context, lesson)
  }
}

export default event
