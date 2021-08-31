import {ClientEvent, CommandNames, EventTypes} from '@/types/event'
import {REPLIES} from '@/src/texts'
import {goToMainMenu} from '@/src/events/utils.context'

const event: ClientEvent<'text'> = {
  name: CommandNames.start,
  type: EventTypes.command,
  execute: async context => {
    await goToMainMenu(context, REPLIES.start)
  }
}

export default event
