import {NextLessonQueryData, QueryName} from '@/types/callbackQuery'
import {getDataFromCallbackQuery} from '@/src/events/utils'
import {ClientEvent, EventTypes} from '@/types/event'
import {showLesson} from '@/src/events/utils.context'

const event: ClientEvent<'callback_query'> = {
  name: QueryName.nextLesson,
  type: EventTypes.callbackQuery,
  execute: async (context, storage) => {
    const data = getDataFromCallbackQuery(context.callbackQuery)
    const userID = context.from?.id
    if (!userID || !data || !Array.isArray(data.d) || typeof data.d[0] !== 'number' || typeof data.d[1] !== 'number') return

    const [sectionID, lessonPosition] = data.d as NextLessonQueryData
    const section = await storage.getSectionOfUserByID(userID, sectionID)
    if (!section || !section.available) return
    const lesson = await storage.getLessonOfSectionByPosition(sectionID, lessonPosition)
    if (!lesson) return
    await showLesson(context, lesson)
  }
}

export default event
