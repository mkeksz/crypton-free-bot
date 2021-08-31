import {getNextQuiz} from '@/src/events/utils.queryData'
import {ClientEvent, EventContext, EventTypes} from '@/types/event'
import {QueryName} from '@/types/callbackQuery'
import {showQuiz} from '@/src/events/utils.context'
import {REPLIES} from '@/src/texts'
import {SectionOfUser, StarsOfSection} from '@/types/storage'

const event: ClientEvent<'callback_query'> = {
  name: QueryName.startQuiz,
  type: EventTypes.callbackQuery,
  execute: async (context, storage) => {
    const nextQuizData = getNextQuiz(context.callbackQuery)
    if (!nextQuizData) return
    const [sectionID, position, numRightAnswers] = nextQuizData
    const quiz = await storage.getQuizOfSectionByPosition(sectionID, position)
    if (!quiz) {
      const userID = context.from?.id
      if (!userID) return
      const section = await storage.getSectionOfUserByID(userID, sectionID)
      if (!section || !section.available) return

      const beforeSections = await storage.getSectionsOfUser(userID, false)

      const stars = getStars(numRightAnswers, position)
      await storage.updateCompletedSection(userID, sectionID, true, section.stars < stars ? stars : undefined)

      const afterSections = await storage.getSectionsOfUser(userID, false)

      await context.editMessageText(REPLIES.fullCompleted(numRightAnswers, position, stars))
      await sendNewAvailableSections(context, beforeSections, afterSections)
      return
    }
    await showQuiz(context, storage, quiz, numRightAnswers)
  }
}

export default event

function getStars(numRightAnswers: number, questions: number): StarsOfSection {
  const percentRightAnswers = numRightAnswers * 100 / questions
  let stars: StarsOfSection = 0
  if (percentRightAnswers === 100) stars = 3
  else if (percentRightAnswers > 90) stars = 2
  else if (percentRightAnswers > 80) stars = 1
  return stars
}

async function sendNewAvailableSections(context: EventContext<'callback_query'>, beforeSections: SectionOfUser[], afterSections: SectionOfUser[]): Promise<void> {
  const newSections: SectionOfUser[] = []

  for (const section of beforeSections) {
    const afterSection = afterSections.find(afterSection => afterSection.id === section.id)
    if (!afterSection) continue
    if (section.available !== afterSection.available && afterSection.available) {
      newSections.push(section)
    }
  }
  if (newSections.length === 0) return

  const sectionNames = newSections.map(section => section.textButton)
  await context.reply(REPLIES.newSections(sectionNames))
}
