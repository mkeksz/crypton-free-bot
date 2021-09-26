import {Scenes} from 'telegraf'
import {getRightAnswersFromActionData, countStars, showQuiz, sendNewAvailableSections} from './helpers'
import {checkAndAddSectionToState} from '@/src/middlewares/shared/checkAndAddSectionToState'
import {checkAndAddQuizToState} from './middlewares'
import {SectionOfUser} from '@/src/types/storage'
import {BotContext} from '@/src/types/telegraf'
import locales from '@/src/locales/ru.json'

const quizzes = new Scenes.BaseScene<BotContext>('quizzes')

quizzes.enter(checkAndAddSectionToState(false), checkAndAddQuizToState(false), showQuiz)

quizzes.action(/^nq:[0-9]+:[0-9]+:[0-9]+$/, checkAndAddSectionToState(true), checkAndAddQuizToState(true), showQuiz)

quizzes.action(/^eq:[0-9]+::[0-9]+$/, checkAndAddSectionToState(true), async ctx => {
  const rightAnswers = getRightAnswersFromActionData(ctx)
  const section = ctx.state['section'] as SectionOfUser
  const numQuizzes = section.quizzes.length
  const stars = countStars(rightAnswers, numQuizzes)
  const userID = ctx.from!.id
  const beforeSections = await ctx.storage.getSectionsOfUser(userID, false)
  await ctx.storage.updateCompletedSection(userID, section.id, true, stars > section.stars ? stars : undefined)
  const afterSections = await ctx.storage.getSectionsOfUser(userID, false)
  const text = locales.scenes.quizzes.quiz_complete
    .replace('%answers%', String(rightAnswers))
    .replace('%quizzes%', String(numQuizzes))
    .replace('%stars%', String(stars))
  ctx.editMessageText(text)
  await sendNewAvailableSections(ctx, beforeSections, afterSections)
  ctx.scene.enter('trainingSections')
})

export default quizzes
