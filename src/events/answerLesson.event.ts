import {ClientEvent, EventTypes} from '@/types/event'
import {StepName} from '@/types/storage'
import {INLINE_KEYBOARDS} from '@/src/markup'
import {REPLIES} from '@/src/texts'

const event: ClientEvent<'text'> = {
  name: StepName.waitAnswerLesson,
  type: EventTypes.text,
  execute: async (context, storage) => {
    const step = await storage.getStepUser(context.from.id)
    if (!step || !step.lessonID || !step.messageID) return

    const lesson = await storage.getLessonByID(step.lessonID)
    if (!lesson) return

    await context.deleteMessage()

    if (lesson.answer !== context.message.text) {
      try {
        await context.telegram.editMessageText(
          context.chat.id,
          step.messageID,
          undefined,
          REPLIES.notRightAnswerLesson,
          {reply_markup: INLINE_KEYBOARDS.backToLesson(lesson.sectionID, lesson.position)}
        )
      } catch {}
      return
    }

    await storage.setStepUser(context.from.id, null)
    await context.telegram.editMessageText(
      context.chat.id,
      step.messageID,
      undefined,
      REPLIES.rightAnswerLesson,
      {reply_markup: INLINE_KEYBOARDS.nextLesson(lesson.sectionID, lesson.position + 1)}
    )
  }
}

export default event
