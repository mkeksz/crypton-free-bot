import {ClientEvent, EventTypes} from '@/types/event'
import {BUTTONS, REPLIES} from '@/src/texts'

const event: ClientEvent<'text'> = {
  name: BUTTONS.calendar,
  type: EventTypes.text,
  execute: async context => {
    await context.replyWithMarkdownV2(REPLIES.calendar)
  }
}

export default event
