import {ReplyKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {Markup} from 'telegraf'
import locales from '../locales/ru.json'

export function getMainKeyboard(): Markup.Markup<ReplyKeyboardMarkup> {
  const mainKeyboard = locales.keyboards.main_keyboard
  const keyboard = Markup.keyboard([
    [mainKeyboard.training],
    [mainKeyboard.discord, mainKeyboard.ecosystem],
    [mainKeyboard.calendar, mainKeyboard.support],
    [mainKeyboard.chat, mainKeyboard.nft]
  ])
  return keyboard.resize()
}
