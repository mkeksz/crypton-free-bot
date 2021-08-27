import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {Markup} from 'telegraf'
import {CallbackQueryData, CallbackQueryName} from '@/types/callbackQuery'
import {BUTTONS, INLINE_BUTTONS} from '@/src/texts'
import {SectionModel} from '@/types/storage'

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
  trainingSections: (sections: SectionModel[]): Markup.Markup<InlineKeyboardMarkup> => {
    const toButton = (section: SectionModel): [InlineKeyboardButton.CallbackButton] => {
      const callbackData = {d: section.id, n: CallbackQueryName.section} as CallbackQueryData<number>
      return [{text: `${section.available ? '' : '🔒 '}${section.textButton}`, callback_data: JSON.stringify(callbackData)}]
    }

    const sortSections = sections.sort((a, b) => a.serial - b.serial)
    const buttons = sortSections.map(toButton)
    return Markup.inlineKeyboard(buttons)
  }
}
