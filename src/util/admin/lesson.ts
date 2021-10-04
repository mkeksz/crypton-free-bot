import {ExtraEditMessageText} from 'telegraf/typings/telegram-types'
import {getLessonInlineKeyboard} from '@/src/inlineKeyboards/admin'
import {AdminLessonContext} from '@/src/types/admin'
import {getTextWithMedia} from '@/src/util/lesson'

export async function showAdminLesson(ctx: AdminLessonContext, editMessageID?: number): Promise<void> {
  const messageText = getTextWithMedia(ctx.lesson)

  const reply_markup = getLessonInlineKeyboard().reply_markup
  const extra = {reply_markup, entities: messageText.entities, disable_web_page_preview: !messageText.entities} as ExtraEditMessageText
  if (editMessageID) ctx.telegram.editMessageText(ctx.chat!.id, editMessageID, undefined, messageText.text, extra)
  else ctx.editMessageText(messageText.text, extra)
}
