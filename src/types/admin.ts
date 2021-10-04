import {BotContext} from '@/src/types/telegraf'
import {FullSectionStorage, LessonStorage, QuizStorage} from '@/src/types/storage'

export type AdminLessonContext = BotContext & {lesson: LessonStorage}
export type AdminQuizContext = BotContext & {quiz: QuizStorage}
export type AdminSectionContext = BotContext & {section: FullSectionStorage}
export type AdminSceneState = {waitText?: boolean, editMessageID?: number, sectionID?: number, lessonID?: number, quizID?: number, text?: string}

