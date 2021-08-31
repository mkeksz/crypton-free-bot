import {QueryName} from '@/types/callbackQuery'
import {ClientEvent, EventTypes} from '@/types/event'
import {ANSWER_CB_QUERY} from '@/src/texts'

const event: ClientEvent<'callback_query'> = {
  name: QueryName.wrongAnswerLesson,
  type: EventTypes.callbackQuery,
  execute: async context => {
    // TODO создает задержку в 1 минуту перед нажатием другого варианта ответа
    //  (можно редактировать все инлайн-кнопки добавив к ним время нажатия ложного ответа. И если с того времени уже прошла минута, то разрешается нажать
    await context.answerCbQuery(ANSWER_CB_QUERY.wrongAnswer)
  }
}

export default event
