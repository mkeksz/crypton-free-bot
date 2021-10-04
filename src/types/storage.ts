import {Lesson, Quiz, Section} from '@prisma/client'
import {MessageEntity} from 'telegraf/typings/core/types/typegram'

export type StarsOfSection = 0 | 1 | 2 | 3
export type SectionStorage = Section
export type FullSectionStorage = Section & {opensAfterSections: Section[], parentSection: Section | null}
export interface LessonStorage extends Lesson {
  entitiesArray?: MessageEntity[]
}
export interface QuizStorage extends Quiz {
  entitiesArray?: MessageEntity[]
}

export interface SectionOfUser extends Section {
  available: boolean,
  stars: StarsOfSection,
  availableQuiz: boolean,
  hasQuizzes: boolean,
  fullCompleted: boolean,
  quizzes: {id: number}[],
  lessons: {id: number}[]
}
