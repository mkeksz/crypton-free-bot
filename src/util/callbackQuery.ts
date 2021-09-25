import {BotContext} from '@/src/types/telegraf'

export function getCallbackQueryData(ctx: BotContext): string {
  if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) return ''
  return ctx.callbackQuery.data
}
