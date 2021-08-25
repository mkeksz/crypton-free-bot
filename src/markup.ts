import {BUTTONS} from '@/src/texts'
import {Markup} from 'telegraf'

export const KEYBOARDS = {
  main: Markup.keyboard([
    [BUTTONS.training],
    [BUTTONS.chat, BUTTONS.nft],
    [BUTTONS.calendar, BUTTONS.discord],
    [BUTTONS.ecosystem, BUTTONS.support]
  ]).resize()
}
