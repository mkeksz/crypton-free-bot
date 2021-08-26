import {BUTTONS, INLINE_BUTTONS} from '@/src/texts'
import {Markup} from 'telegraf'

export const KEYBOARDS = {
  main: Markup.keyboard([
    [BUTTONS.training],
    [BUTTONS.discord, BUTTONS.ecosystem],
    [BUTTONS.calendar, BUTTONS.support],
    [BUTTONS.chat, BUTTONS.nft]
  ]).resize()
}

export const INLINE_KEYBOARDS = {
  discord: Markup.inlineKeyboard([
    [{text: INLINE_BUTTONS.discord, url: 'link-to-discord.ru'}]
  ])
}
