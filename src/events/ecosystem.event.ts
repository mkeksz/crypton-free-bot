import {ClientEvent, EventTypes} from '@/types/event'
import {BUTTONS, REPLIES} from '@/src/texts'

const event: ClientEvent = {
  name: BUTTONS.ecosystem,
  type: EventTypes.text,
  execute: async context => {
    await context.replyWithMarkdownV2(REPLIES.ecosystem)
  }
}

export default event
