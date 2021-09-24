import {Lesson, Quiz, Section} from '@prisma/client'

export type StarsOfSection = 0 | 1 | 2 | 3
export type QuizStorage = Quiz
export type LessonStorage = Lesson

export interface SectionOfUser extends Section {
  available: boolean,
  stars: StarsOfSection,
  availableQuiz: boolean,
  fullCompleted: boolean
}
