import {LessonStorage, QuizStorage, SectionStorage} from '@/src/types/storage'
import {BotContext} from '@/src/types/telegraf'

export async function swapSectionPositions(ctx: BotContext, array: SectionStorage[] | LessonStorage[] | QuizStorage[], target: SectionStorage | LessonStorage, direction: ('up' | 'down'), type: 'section' | 'lesson' | 'quiz'): Promise<boolean> {
  const sortedArray = array.sort((a, b) => a.position - b.position)
  const indexTarget = sortedArray.findIndex(section => section.id === target.id)
  const indexSwapTarget = direction === 'up' ? indexTarget - 1 : indexTarget + 1
  const swapTarget = sortedArray[indexSwapTarget < 0 ? 0 : indexSwapTarget]
  if (!swapTarget || swapTarget.id === target.id) return false
  const newPositionTarget = swapTarget.position
  const newPositionSwapTarget = target.position

  if (type === 'section') {
    await ctx.storage.updateSection(target.id, {position: newPositionTarget})
    await ctx.storage.updateSection(swapTarget.id, {position: newPositionSwapTarget})
  } else if (type === 'lesson') {
    await ctx.storage.updateLesson(target.id, {position: newPositionTarget})
    await ctx.storage.updateLesson(swapTarget.id, {position: newPositionSwapTarget})
  } else if (type === 'quiz') {
    await ctx.storage.updateQuiz(target.id, {position: newPositionTarget})
    await ctx.storage.updateQuiz(swapTarget.id, {position: newPositionSwapTarget})
  }
  return true
}
