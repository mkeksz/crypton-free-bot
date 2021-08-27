import {ClientEvent, EventTypes} from '@/types/event'
import {BUTTONS, REPLIES} from '@/src/texts'

const event: ClientEvent<'text'> = {
  name: BUTTONS.chat,
  type: EventTypes.text,
  execute: async context => {
    await context.replyWithMarkdownV2(REPLIES.chat)
  }
}

export default event
