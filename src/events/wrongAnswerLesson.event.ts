import {QueryName} from '@/types/callbackQuery'
import {getLesson, showLesson} from '@/src/events/utils.context'
import {getWaitSecondsData} from '@/src/events/utils.queryData'
import {ClientEvent, EventTypes} from '@/types/event'
import {ANSWER_CB_QUERY} from '@/src/texts'

const event: ClientEvent<'callback_query'> = {
  name: QueryName.wrongAnswerLesson,
  type: EventTypes.callbackQuery,
  execute: async (context, storage) => {
    const waitSeconds = getWaitSecondsData(context.callbackQuery)
    if (waitSeconds > 0) {
      await context.answerCbQuery(ANSWER_CB_QUERY.wait(waitSeconds))
      return
    }

    const lesson = await getLesson(context, storage)
    if (!lesson) return
    await context.answerCbQuery(ANSWER_CB_QUERY.wrongAnswer)
    await showLesson(context, storage, lesson, true)
  }
}

export default event
