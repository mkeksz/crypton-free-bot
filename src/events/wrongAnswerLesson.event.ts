import {QueryName} from '@/types/callbackQuery'
import {ClientEvent, EventTypes} from '@/types/event'
import {ANSWER_CB_QUERY} from '@/src/texts'

const event: ClientEvent<'callback_query'> = {
  name: QueryName.wrongAnswerLesson,
  type: EventTypes.callbackQuery,
  execute: async context => {
    await context.answerCbQuery(ANSWER_CB_QUERY.wrongAnswer)
  }
}

export default event
