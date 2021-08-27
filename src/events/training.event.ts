import {ClientEvent, EventTypes} from '@/types/event'
import {BUTTONS, REPLIES} from '@/src/texts'
import {INLINE_KEYBOARDS} from '@/src/markup'

const event: ClientEvent<'text'> = {
  name: BUTTONS.training,
  type: EventTypes.text,
  execute: async (context, storage) => {
    const sections = await storage.getSectionsUser(context.from.id)
    await context.replyWithMarkdownV2(REPLIES.training, INLINE_KEYBOARDS.trainingSections(sections))
  }
}

export default event
