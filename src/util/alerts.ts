import {BotContext} from '@/src/types/telegraf'
import locales from '@/src/locales/ru.json'

export function showAlertOldButton(ctx: BotContext): Promise<true> {
  return ctx.answerCbQuery(locales.shared.old_button, {show_alert: true})
}
