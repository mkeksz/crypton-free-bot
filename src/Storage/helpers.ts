import {Lesson, Quiz, Section} from '@prisma/client'
import {LessonStorage, QuizStorage, SectionOfUser, StarsOfSection} from '@/src/types/storage'

type FullSectionInfo = (Section & {
  users: {userID: number, stars: number, fullCompleted: boolean}[],
  opensAfterSections: {users: {sectionID: number}[]}[],
  quizzes: {id: number}[],
  lessons: {id: number}[]
})
type OptionsOfInclude = {
  users: {select: {userID: true, stars: true, fullCompleted: true}, where: {userID: number}},
  opensAfterSections: {select: {users: {select: {sectionID: true}, where: {userID: number, fullCompleted: true}}}},
  quizzes: {select: {id: true}},
  lessons: {select: {id: true}}
}

export function getOptionsOfIncludeForSections(userID: number): OptionsOfInclude {
  return {
    users: {where: {userID}, select: {userID: true, stars: true, fullCompleted: true}},
    opensAfterSections: {select: {users: {where: {userID, fullCompleted: true}, select: {sectionID: true}}}},
    quizzes: {select: {id: true}},
    lessons: {select: {id: true}}
  }
}

export function convertToSectionOfUser(section: FullSectionInfo): SectionOfUser {
  return {
    ...section,
    available: checkSectionIsAvailable(section),
    stars: getStarsOfSection(section),
    availableQuiz: checkAvailableQuiz(section),
    hasQuizzes: checkHasQuizzes(section),
    fullCompleted: checkFullCompleted(section)
  }
}

export function convertToLessonStorage(lesson: Lesson): LessonStorage {
  return {
    ...lesson,
    entitiesArray: lesson.entities ? JSON.parse(lesson.entities) : undefined
  }
}

export function convertToQuizStorage(quiz: Quiz): QuizStorage {
  return {
    ...quiz,
    entitiesArray: quiz.entities ? JSON.parse(quiz.entities) : undefined
  }
}

export function checkSectionIsAvailable(section: FullSectionInfo): boolean {
  const completedSections = section.opensAfterSections.filter(section => section.users.length > 0)
  return section.alwaysAvailable || completedSections.length > 0 || (section.users.length > 0 && section.users[0].fullCompleted)
}

export function getStarsOfSection(section: FullSectionInfo): StarsOfSection {
  return section.users.length > 0 ? section.users[0].stars as StarsOfSection : 0
}

export function checkAvailableQuiz(section: FullSectionInfo): boolean {
  return section.users.length > 0
}

export function checkFullCompleted(section: FullSectionInfo): boolean {
  return section.users.length > 0 ? section.users[0].fullCompleted : false
}

export function checkHasQuizzes(section: FullSectionInfo): boolean {
  return section.quizzes.length > 0
}
