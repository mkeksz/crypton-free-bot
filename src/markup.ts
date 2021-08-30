import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {Markup} from 'telegraf'
import {CallbackQueryData, CallbackQueryName} from '@/types/callbackQuery'
import {BUTTONS, INLINE_BUTTONS} from '@/src/texts'
import {SectionOfUser} from '@/types/storage'

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
  nextLesson: getNextLesson
}

function getNextLesson(nextPosition: number): InlineKeyboardMarkup {
  const callbackData = {d: nextPosition, n: CallbackQueryName.nextLesson} as CallbackQueryData<number>
  const jsonData = JSON.stringify(callbackData)
  const button: InlineKeyboardButton = {text: INLINE_BUTTONS.nextLesson, callback_data: jsonData}
  return {inline_keyboard: [[button]]}
}

function getTrainingSections(sections: SectionOfUser[], needBackButton = false): InlineKeyboardMarkup {
  const toButton = (section: SectionOfUser): InlineKeyboardButton[] => {
    const callbackData = {d: section.id, n: CallbackQueryName.section} as CallbackQueryData<number>
    const jsonData = JSON.stringify(callbackData)
    return [{text: `${section.available ? '' : '🔒 '}${section.textButton}`, callback_data: jsonData}]
  }

  const sortSections = sections.sort((a, b) => a.position - b.position)
  const buttons = sortSections.map(toButton)
  if (needBackButton) {
    const callbackData: CallbackQueryData = {n: CallbackQueryName.backToMainSections}
    const jsonData = JSON.stringify(callbackData)
    buttons.push([{text: INLINE_BUTTONS.backToSections, callback_data: jsonData}])
  }
  return {inline_keyboard: buttons}
}
