import {BUTTONS, INLINE_BUTTONS} from '@/src/texts'
import {Markup} from 'telegraf'
import {SectionModel} from '@/types/storage'
import {InlineKeyboardButton} from 'telegraf/typings/core/types/typegram'
import {InlineCallbackData, InlineCallbackType} from '@/types/inlineButton'

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
  trainingSections: (sections: SectionModel[]) => {
    const toButton = (section: SectionModel): [InlineKeyboardButton.CallbackButton] => {
      const callbackData: InlineCallbackData = {id: section.id, type: InlineCallbackType.section}
      return [{text: `${section.available ? '' : '🔒 '}${section.textButton}`, callback_data: JSON.stringify(callbackData)}]
    }

    const sortSections = sections.sort((a, b) => a.serial - b.serial)
    const buttons = sortSections.map(toButton)
    return Markup.inlineKeyboard(buttons)
  }
}
