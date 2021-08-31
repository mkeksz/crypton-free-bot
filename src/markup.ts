import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {Markup} from 'telegraf'
import {QueryName} from '@/types/callbackQuery'
import {LessonStorage, SectionOfUser} from '@/types/storage'
import {BUTTONS, INLINE_BUTTONS} from '@/src/texts'
import {createQueryDataJSON} from '@/src/events/utils.queryData'

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

type AnswerButtonsData = [text: string, isRight: 0 | 1 | undefined][]
function getAnswerButtons(lesson: LessonStorage): InlineKeyboardMarkup {
  const buttonsData = JSON.parse(lesson.AnswerButtons!) as AnswerButtonsData

  const buttons: InlineKeyboardButton[][] = []
  for (const buttonData of buttonsData) {
    const dataJSON = buttonData[1]
      ? createQueryDataJSON(QueryName.nextLesson, [lesson.sectionID, lesson.position + 1])
      : createQueryDataJSON(QueryName.wrongAnswerLesson)
    buttons.push([{text: buttonData[0], callback_data: dataJSON}])
  }
  return {inline_keyboard: buttons}
}

function getNextLesson(sectionID: number, nextPosition: number): InlineKeyboardMarkup {
  const dataJSON = createQueryDataJSON(QueryName.nextLesson, [sectionID, nextPosition])
  const button: InlineKeyboardButton = {text: INLINE_BUTTONS.nextLesson, callback_data: dataJSON}
  return {inline_keyboard: [[button]]}
}

function getTrainingSections(sections: SectionOfUser[], needBackButton = false): InlineKeyboardMarkup {
  const toButton = (section: SectionOfUser): InlineKeyboardButton[] => {
    const dataJSON = createQueryDataJSON(QueryName.section, section.id)
    return [{text: `${section.available ? '' : '🔒 '}${section.textButton}`, callback_data: dataJSON}]
  }

  const sortSections = sections.sort((a, b) => a.position - b.position)
  const buttons = sortSections.map(toButton)
  if (needBackButton) {
    const dataJSON = createQueryDataJSON(QueryName.backToMainSections)
    buttons.push([{text: INLINE_BUTTONS.backToSections, callback_data: dataJSON}])
  } else {
    const dataJSON = createQueryDataJSON(QueryName.backToMenu)
    buttons.push([{text: INLINE_BUTTONS.backToMenu, callback_data: dataJSON}])
  }
  return {inline_keyboard: buttons}
}
