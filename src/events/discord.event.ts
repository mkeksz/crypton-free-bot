import {ClientEvent, EventTypes} from '@/types/event'
import {INLINE_KEYBOARDS} from '@/src/markup'
import {BUTTONS, REPLIES} from '@/src/texts'

const event: ClientEvent = {
  name: BUTTONS.discord,
  type: EventTypes.text,
  execute: async context => {
    await context.replyWithMarkdownV2(REPLIES.discord, INLINE_KEYBOARDS.discord)
  }
}

export default event
