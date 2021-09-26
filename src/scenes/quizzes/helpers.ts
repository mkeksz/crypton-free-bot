import {InlineKeyboardButton, InlineKeyboardMarkup} from 'telegraf/typings/core/types/typegram'
import {Markup} from 'telegraf'
import {ActionContext, BotContext} from '@/src/types/telegraf'
import {QuizStorage, SectionOfUser} from '@/src/types/storage'
import locales from '@/src/locales/ru.json'

export async function showQuiz(ctx: BotContext | ActionContext): Promise<void> {
  const quiz = ctx.state['quiz'] as QuizStorage
  const isLastQuiz = ctx.state['isLastQuiz'] as boolean
  const rightAnswers = ctx.state['rightAnswers'] as number
  const inlineKeyboard = getAnswersQuizInlineKeyboard(quiz, rightAnswers, isLastQuiz)
  await ctx.editMessageText(quiz.text, inlineKeyboard)
}

function getAnswersQuizInlineKeyboard(quiz: QuizStorage, rightAnswers: number, isLastQuiz: boolean): Markup.Markup<InlineKeyboardMarkup> {
  const answers = JSON.parse(quiz.buttons) as [string, 1?][]
  const buttons: InlineKeyboardButton[][] = answers.map(answer => {
    const rightAnswersData = answer[1] ? rightAnswers + 1 : rightAnswers
    let callbackData = `nq:${quiz.sectionID}:${quiz.position + 1}:${rightAnswersData}`
    if (isLastQuiz) callbackData = `eq:${quiz.sectionID}::${rightAnswersData}`
    return [{text: answer[0], callback_data: callbackData}]
  })
  return Markup.inlineKeyboard(buttons)
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
