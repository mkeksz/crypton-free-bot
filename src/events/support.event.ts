import {ClientEvent, EventTypes} from '@/types/event'
import {BUTTONS, REPLIES} from '@/src/texts'

const event: ClientEvent = {
  name: BUTTONS.support,
  type: EventTypes.text,
  execute: async context => {
    await context.replyWithMarkdownV2(REPLIES.support)
  }
}

export default event
