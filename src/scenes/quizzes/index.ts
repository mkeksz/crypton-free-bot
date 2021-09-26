import {Scenes} from 'telegraf'
import {checkAndAddSectionToState} from '@/src/middlewares/shared/checkAndAddSectionToState'
import {BotContext} from '@/src/types/telegraf'
import {checkAndAddQuizToState} from '@/src/scenes/quizzes/middlewares'
import {getRightAnswersFromActionData, countStars, showQuiz} from '@/src/scenes/quizzes/helpers'
import {SectionOfUser} from '@/src/types/storage'

const quizzes = new Scenes.BaseScene<BotContext>('quizzes')

quizzes.enter(checkAndAddSectionToState(false), checkAndAddQuizToState(false), showQuiz)

quizzes.action(/^nq:[0-9]+:[0-9]+:[0-9]+$/, checkAndAddSectionToState(true), checkAndAddQuizToState(true), showQuiz)

quizzes.action(/^eq:[0-9]+::[0-9]+$/, checkAndAddSectionToState(true), async ctx => {
  const rightAnswers = getRightAnswersFromActionData(ctx)
  const section = ctx.state['section'] as SectionOfUser
  const numQuizzes = section.quizzes.length
  const stars = countStars(rightAnswers, numQuizzes)
  await ctx.storage.updateCompletedSection(ctx.from!.id, section.id, true, stars > section.stars ? stars : undefined)
  ctx.editMessageText(`Quiz пройден!\n${rightAnswers} верных ответов из ${numQuizzes}.\nПолучено звёзд: ${stars}`)
  ctx.scene.enter('trainingSections')
})

export default quizzes
