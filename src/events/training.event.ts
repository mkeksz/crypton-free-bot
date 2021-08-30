import {ClientEvent, EventTypes} from '@/types/event'
import {INLINE_KEYBOARDS} from '@/src/markup'
import {BUTTONS, REPLIES} from '@/src/texts'

const event: ClientEvent<'text'> = {
  name: BUTTONS.training,
  type: EventTypes.text,
  execute: async (context, storage) => {
    const sections = await storage.getSectionsOfUser(context.from.id, true)
    await context.replyWithMarkdownV2(REPLIES.training, INLINE_KEYBOARDS.trainingSections(sections))
  }
}

export default event
