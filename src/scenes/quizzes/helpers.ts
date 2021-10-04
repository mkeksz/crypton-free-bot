import {ActionContext, BotContext} from '@/src/types/telegraf'
import {getAnswersQuizInlineKeyboard} from './inlineKeyboards'
import {QuizStorage, SectionOfUser} from '@/src/types/storage'
import locales from '@/src/locales/ru.json'
import {ExtraEditMessageText} from 'telegraf/typings/telegram-types'

export async function showQuiz(ctx: BotContext | ActionContext): Promise<void> {
  const quiz = ctx.state['quiz'] as QuizStorage
  const isLastQuiz = ctx.state['isLastQuiz'] as boolean
  const rightAnswers = ctx.state['rightAnswers'] as number
  const reply_markup = getAnswersQuizInlineKeyboard(quiz, rightAnswers, isLastQuiz).reply_markup
  const extra = {reply_markup, disable_web_page_preview: true, entities: quiz.entitiesArray} as ExtraEditMessageText
  await ctx.editMessageText(quiz.text, extra)
}

export async function sendNewAvailableSections(ctx: BotContext, beforeSections: SectionOfUser[], afterSections: SectionOfUser[]): Promise<void> {
  const newSections: SectionOfUser[] = []
  for (const section of beforeSections) {
    const afterSection = afterSections.find(afterSection => afterSection.id === section.id)
    if (!afterSection) continue
    if (section.available !== afterSection.available && afterSection.available) newSections.push(section)
  }
  if (newSections.length === 0) return
  const sectionNames = newSections.map(section => section.textButton)
  const text = locales.scenes.quizzes.new_sections.replace('%sections%', sectionNames.join('\n'))
  await ctx.reply(text)
}

export function getQuizPositionFromActionData(ctx: ActionContext): number {
  const data = ctx.match[0]
  const [,,quizPosition] = data.split(':')
  return Number(quizPosition)
}

export function getRightAnswersFromActionData(ctx: ActionContext): number {
  const data = ctx.match[0]
  const [,,,rightAnswers] = data.split(':')
  return Number(rightAnswers)
}

export function countStars(rightAnswers: number, questions: number): number {
  const percentRightAnswers = rightAnswers * 100 / questions
  let stars = 0
  if (percentRightAnswers === 100) stars = 3
  else if (percentRightAnswers > 90) stars = 2
  else if (percentRightAnswers > 80) stars = 1
  return stars
}
