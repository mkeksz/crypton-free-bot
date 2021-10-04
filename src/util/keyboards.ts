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

export function getBackKeyboard(): Markup.Markup<ReplyKeyboardMarkup> {
  const backKeyboard = locales.keyboards.back_keyboard
  const keyboard = Markup.keyboard([[backKeyboard.back]])
  return keyboard.resize()
}


export function checkTextMainKeyboard(text: string): boolean {
  let isMainKeyboard = false
  for (const value of Object.values(locales.keyboards.main_keyboard)) {
    if (value === text) isMainKeyboard = true
  }
  return isMainKeyboard
}
