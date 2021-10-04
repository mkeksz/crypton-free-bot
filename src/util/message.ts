import {MessageEntity} from 'telegraf/typings/core/types/typegram'
import {BotContext} from '@/src/types/telegraf'

export function getMessageText(ctx: BotContext): {text: string, entities?: MessageEntity[]} {
  if (!ctx.message) return {text: ''}
  const isCaption = 'caption' in ctx.message
  const isText = 'text' in ctx.message
  if (!isText && !isCaption) return {text: ''}
  const text = isText ? ctx.message.text : ctx.message.caption!
  const entities = (isText && ctx.message.entities) || (isCaption && ctx.message.caption_entities)
  if (!entities) return {text}
  return {text, entities}
}
