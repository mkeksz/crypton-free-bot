import {ClientEvent, CommandNames, EventTypes} from '@/types/event'
import {KEYBOARDS} from '@/src/markup'
import {REPLIES} from '@/src/texts'

const event: ClientEvent = {
  name: CommandNames.start,
  type: EventTypes.command,
  execute: async context => {
    await context.reply(REPLIES.start, KEYBOARDS.main)
  }
}

export default event
