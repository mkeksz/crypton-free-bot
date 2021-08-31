import {getLesson, showLesson} from '@/src/events/utils.context'
import {getNextLessonData, getWaitSecondsData} from '@/src/events/utils.queryData'
import {ClientEvent, EventTypes} from '@/types/event'
import {QueryName} from '@/types/callbackQuery'
import {ANSWER_CB_QUERY, REPLIES} from '@/src/texts'
import {INLINE_KEYBOARDS} from '@/src/markup'

const event: ClientEvent<'callback_query'> = {
  name: QueryName.nextLesson,
  type: EventTypes.callbackQuery,
  execute: async (context, storage) => {
    const waitSeconds = getWaitSecondsData(context.callbackQuery)
    if (waitSeconds > 0) {
      await context.answerCbQuery(ANSWER_CB_QUERY.wait(waitSeconds))
      return
    }

    const lesson = await getLesson(context, storage)
    if (lesson === undefined) return
    if (lesson === null) {
      const lessonData = getNextLessonData(context.callbackQuery)
      const [sectionID] = lessonData!
      const section = await storage.getSectionOfUserByID(context.from!.id, sectionID)
      if (!section || !section.parentSectionID) return
      await storage.updateCompletedSection(context.from!.id, section.id, false)
      await context.editMessageText(
        REPLIES.completedSection(section.textButton),
        {reply_markup: INLINE_KEYBOARDS.startQuiz(section.id, section.parentSectionID, 0)}
      )
      return
    }
    await showLesson(context, storage, lesson)
  }
}

export default event
