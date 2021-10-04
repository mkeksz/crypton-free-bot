import {ActionContext, BotContext} from '@/src/types/telegraf'
import {SectionStorage} from '@/src/types/storage'

export function getSectionIDFromSceneState(ctx: BotContext): number {
  const state = ctx.scene.state as {sectionID: number}
  return Number(state.sectionID)
}

export function getLessonIDFromSceneState(ctx: BotContext): number {
  const state = ctx.scene.state as {lessonID: number}
  return Number(state.lessonID)
}

export function getQuizIDFromSceneState(ctx: BotContext): number {
  const state = ctx.scene.state as {quizID: number}
  return Number(state.quizID)
}

export function getSectionIDFromActionData(ctx: ActionContext): number {
  const data = ctx.match[0]
  const [,sectionID] = data.split(':')
  return Number(sectionID)
}

export function getLessonIDFromActionData(ctx: ActionContext): number {
  const data = ctx.match[0]
  const [,lessonID] = data.split(':')
  return Number(lessonID)
}

export function getQuizIDFromActionData(ctx: ActionContext): number {
  const data = ctx.match[0]
  const [,quizID] = data.split(':')
  return Number(quizID)
}

export async function getAllParentSections(ctx: BotContext): Promise<SectionStorage[]> {
  const sections = await ctx.storage.getAllSections(true)
  return sections.sort((a, b) => a.position - b.position)
}
