import {MessageEntity} from 'telegraf/typings/core/types/typegram'
import {LessonStorage} from '@/src/types/storage'

export function getTextWithMedia(lesson: LessonStorage): {text: string, entities?: MessageEntity[]} {
  const mediaSymbol = lesson.media ? '  ' : ''
  const mediaOffset = 1
  let entities = lesson.entitiesArray
  if (mediaSymbol) {
    if (!entities) entities = []
    entities = entities.map(entity => ({...entity, offset: entity.offset + mediaOffset, length: entity.length + mediaOffset}))
    entities.unshift({type: 'text_link', url: lesson.media!, length: mediaOffset, offset: 0})
  }
  return {text: mediaSymbol + lesson.text, entities}
}
