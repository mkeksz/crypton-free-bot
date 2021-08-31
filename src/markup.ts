import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {Markup} from 'telegraf'
import {NextLessonData, QueryData, QueryName} from '@/types/callbackQuery'
import {LessonStorage, SectionOfUser} from '@/types/storage'
import {BUTTONS, INLINE_BUTTONS} from '@/src/texts'

export const KEYBOARDS = {
  main: Markup.keyboard([
    [BUTTONS.training],
    [BUTTONS.discord, BUTTONS.ecosystem],
    [BUTTONS.calendar, BUTTONS.support],
    [BUTTONS.chat, BUTTONS.nft]
  ]).resize()
}

export const INLINE_KEYBOARDS = {
  discord: Markup.inlineKeyboard([[{text: INLINE_BUTTONS.discord, url: 'link-to-discord.ru'}]]),
  trainingSections: getTrainingSections,
  nextLesson: getNextLesson,
  answerButtons: getAnswerButtons
}

// TODO объявить функцию для генерации объекта QueryData, чтобы не создавать вручную
type AnswerButtonsData = [text: string, isRight: 0 | 1 | undefined][]
function getAnswerButtons(lesson: LessonStorage): InlineKeyboardMarkup {
  const buttonsData = JSON.parse(lesson.AnswerButtons!) as AnswerButtonsData

  const buttons: InlineKeyboardButton[][] = []
  for (const buttonData of buttonsData) {
    let callbackData = {d: [lesson.sectionID, lesson.position + 1], n: QueryName.nextLesson} as QueryData
    if (!buttonData[1]) callbackData = {n: QueryName.wrongAnswerLesson}
    const jsonData = JSON.stringify(callbackData)
    buttons.push([{text: buttonData[0], callback_data: jsonData}])
  }
  return {inline_keyboard: buttons}
}

function getNextLesson(sectionID: number, nextPosition: number): InlineKeyboardMarkup {
  const callbackData = {d: [sectionID, nextPosition], n: QueryName.nextLesson} as QueryData<NextLessonData>
  const jsonData = JSON.stringify(callbackData)
  const button: InlineKeyboardButton = {text: INLINE_BUTTONS.nextLesson, callback_data: jsonData}
  return {inline_keyboard: [[button]]}
}

function getTrainingSections(sections: SectionOfUser[], needBackButton = false): InlineKeyboardMarkup {
  const toButton = (section: SectionOfUser): InlineKeyboardButton[] => {
    const callbackData = {d: section.id, n: QueryName.section} as QueryData<number>
    const jsonData = JSON.stringify(callbackData)
    return [{text: `${section.available ? '' : '🔒 '}${section.textButton}`, callback_data: jsonData}]
  }

  const sortSections = sections.sort((a, b) => a.position - b.position)
  const buttons = sortSections.map(toButton)
  if (needBackButton) {
    const callbackData: QueryData = {n: QueryName.backToMainSections}
    const jsonData = JSON.stringify(callbackData)
    buttons.push([{text: INLINE_BUTTONS.backToSections, callback_data: jsonData}])
  } else {
    const callbackData: QueryData = {n: QueryName.backToMenu}
    const jsonData = JSON.stringify(callbackData)
    buttons.push([{text: INLINE_BUTTONS.backToMenu, callback_data: jsonData}])
  }
  return {inline_keyboard: buttons}
}
