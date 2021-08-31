import {ClientEvent, EventTypes} from '@/types/event'
import {getLesson, showLesson} from '@/src/events/utils.context'
import {QueryName} from '@/types/callbackQuery'
import {getWaitSecondsData} from '@/src/events/utils.queryData'
import {ANSWER_CB_QUERY} from '@/src/texts'

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
    if (!lesson) return
    await showLesson(context, lesson)
  }
}

export default event
