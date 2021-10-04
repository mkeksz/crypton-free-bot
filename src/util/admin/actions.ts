import {getDeleteInlineKeyboard, getReenterInlineKeyboard} from '@/src/inlineKeyboards/admin'
import {AdminSceneState, AdminSectionContext} from '@/src/types/admin'
import {clearWaitTextSceneState} from '@/src/util/admin/scene'
import {FullSectionStorage} from '@/src/types/storage'
import {getMessageText} from '@/src/util/message'
import {BotContext} from '@/src/types/telegraf'
import locales from '@/src/locales/ru.json'

export async function active(ctx: AdminSectionContext): Promise<void> {
  await ctx.storage.updateSection(ctx.section.id, {active: !ctx.section.active})
  ctx.scene.reenter()
}

export async function forAll(ctx: AdminSectionContext): Promise<void> {
  await ctx.storage.updateSection(ctx.section.id, {alwaysAvailable: !ctx.section.alwaysAvailable})
  ctx.scene.reenter()
}

export async function waitText(ctx: BotContext, text: string, stateText?: string): Promise<void> {
  const state = ctx.scene.state as AdminSceneState
  state.waitText = true
  state.editMessageID = ctx.callbackQuery!.message!.message_id
  state.text = stateText
  const reply_markup = getReenterInlineKeyboard().reply_markup
  ctx.editMessageText(text, {parse_mode: 'HTML', reply_markup})
}

export async function sureDelete(ctx: AdminSectionContext): Promise<void> {
  const reply_markup = getDeleteInlineKeyboard().reply_markup
  const text = locales.scenes.admin_section.sure_delete_section.replace('%title%', ctx.section.textButton)
  ctx.editMessageText(text, {parse_mode: 'HTML', reply_markup})
}

export async function reenter(ctx: BotContext): Promise<void> {
  clearWaitTextSceneState(ctx)
  ctx.scene.reenter()
}

export async function editTitle(ctx: AdminSectionContext): Promise<void> {
  const state = ctx.scene.state as AdminSceneState
  const titleSection = getMessageText(ctx).text
  await ctx.storage.updateSection(Number(ctx.section.id), {textButton: titleSection})
  const reply_markup = getReenterInlineKeyboard().reply_markup
  const text = locales.scenes.admin_section.edited_title_section.replace('%title%', titleSection)
  ctx.telegram.editMessageText(ctx.chat!.id, state.editMessageID, undefined, text, {parse_mode: 'HTML', reply_markup})
  ctx.deleteMessage()
  clearWaitTextSceneState(ctx)
}

export async function selectOpenAfter(ctx: AdminSectionContext): Promise<void> {
  const openAfterSection = ctx.state['openAfterSection'] as FullSectionStorage
  await ctx.storage.updateSection(ctx.section.id, {openAfterSectionID: openAfterSection.id})
  ctx.scene.reenter()
}
