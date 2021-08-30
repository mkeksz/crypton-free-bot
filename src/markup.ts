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
  trainingSections: getTrainingSections
}

function getTrainingSections(sections: SectionOfUser[], needBackButton = false): Markup.Markup<InlineKeyboardMarkup> {
  const sortSections = sections.sort((a, b) => a.position - b.position)
  const buttons = sortSections.map(toButton)
  if (needBackButton) {
    const callbackData: CallbackQueryData = {n: CallbackQueryName.backToMainSections}
    buttons.push([{text: INLINE_BUTTONS.backToSections, callback_data: JSON.stringify(callbackData)}])
  }
  return Markup.inlineKeyboard(buttons)
}

function toButton(section: SectionOfUser): [InlineKeyboardButton.CallbackButton] {
  const callbackData = {d: section.id, n: CallbackQueryName.section} as CallbackQueryData<number>
  return [{text: `${section.available ? '' : '🔒 '}${section.textButton}`, callback_data: JSON.stringify(callbackData)}]
}
