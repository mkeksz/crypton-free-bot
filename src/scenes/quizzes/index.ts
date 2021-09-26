import {Scenes} from 'telegraf'
import {checkAndAddSectionToState} from '@/src/middlewares/shared/checkAndAddSectionToState'
import {BotContext} from '@/src/types/telegraf'
import {checkAndAddQuizToState} from '@/src/scenes/quizzes/middlewares'
import {showQuiz} from '@/src/scenes/quizzes/helpers'

const quizzes = new Scenes.BaseScene<BotContext>('quizzes')

quizzes.enter(checkAndAddSectionToState(false), checkAndAddQuizToState(false), showQuiz)

export default quizzes
