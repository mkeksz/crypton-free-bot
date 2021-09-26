import {getMainKeyboard} from '@/src/util/keyboards'
import {BotContext} from '@/src/types/telegraf'
import locales from '../locales/ru.json'

export async function goToMainMenu(ctx: BotContext): Promise<void> {
  await ctx.scene.leave()
  await ctx.reply(locales.shared.main_menu, getMainKeyboard())
}

export async function saveMe(ctx: BotContext): Promise<void> {
  ctx.scene.reset()
  await goToMainMenu(ctx)
}
