import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {Markup} from 'telegraf'
import {NextLessonOrQuizData, QueryName} from '@/types/callbackQuery'
import {LessonStorage, SectionOfUser} from '@/types/storage'
import {BUTTONS, INLINE_BUTTONS} from '@/src/texts'
import {createQueryDataJSON} from '@/src/events/utils.queryData'
import {getUnixTime} from '@/src/utils'

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
  answerButtons: getAnswerButtons,
  backToLesson: getBackToLesson,
  startQuiz: getStartQuiz,
}

function getStartQuiz(sectionID: number, parentSectionID: number, nextPosition:number): InlineKeyboardMarkup {
  const dataStart: NextLessonOrQuizData = [sectionID, nextPosition]
  const dataStartJSON = createQueryDataJSON(QueryName.startQuiz, dataStart)
  const dataLaterJSON = createQueryDataJSON(QueryName.section, parentSectionID)

  const buttons: InlineKeyboardButton[][] = []
  buttons.push([{text: INLINE_BUTTONS.startQuiz, callback_data: dataStartJSON}])
  buttons.push([{text: INLINE_BUTTONS.laterQuiz, callback_data: dataLaterJSON}])
  return {inline_keyboard: buttons}
}

function getBackToLesson(sectionID: number, position: number): InlineKeyboardMarkup {
  return getNextLesson(sectionID, position, true)
}

type AnswerButtonsData = [text: string, isRight: 0 | 1 | undefined][]
function getAnswerButtons(lesson: LessonStorage, hasTime = false): InlineKeyboardMarkup {
  const buttonsData = JSON.parse(lesson.answerButtons!) as AnswerButtonsData

  const buttons: InlineKeyboardButton[][] = []
  for (const buttonData of buttonsData) {
    const name = buttonData[1] ? QueryName.nextLesson : QueryName.wrongAnswerLesson
    const data = [lesson.sectionID, lesson.position + (buttonData[1] ? 1 : 0)]
    const time = hasTime ? getUnixTime() : undefined
    const dataJSON = createQueryDataJSON(name, data, time)
    buttons.push([{text: buttonData[0], callback_data: dataJSON}])
  }
  return {inline_keyboard: buttons}
}

function getNextLesson(sectionID: number, nextPosition: number, isBack = false): InlineKeyboardMarkup {
  const dataJSON = createQueryDataJSON(QueryName.nextLesson, [sectionID, nextPosition])
  const button: InlineKeyboardButton = {text: isBack ? INLINE_BUTTONS.againLesson : INLINE_BUTTONS.nextLesson, callback_data: dataJSON}
  return {inline_keyboard: [[button]]}
}

function getTrainingSections(sections: SectionOfUser[], needBackButton = false): InlineKeyboardMarkup {
  const toButton = (section: SectionOfUser): InlineKeyboardButton[] => {
    const dataJSON = createQueryDataJSON(QueryName.section, section.id)
    const button = [{text: `${section.available ? '' : '🔒 '}${section.textButton}`, callback_data: dataJSON}]
    if (section.availableQuiz) {
      const dataQuizJSON = createQueryDataJSON<NextLessonOrQuizData>(QueryName.startQuiz, [section.id, 0])
      button.push({text: 'Quiz', callback_data: dataQuizJSON})
    }
    return button
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
