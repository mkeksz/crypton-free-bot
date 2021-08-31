import {Lesson, Quiz, Section} from '@prisma/client'

export enum StepName {
  waitAnswerLesson = 'waitAnswerLesson'
}

export type StarsOfSection = 0 | 1 | 2 | 3

export interface SectionOfUser extends Section {
  available: boolean,
  stars: StarsOfSection,
  availableQuiz: boolean,
  fullCompleted: boolean
}
export interface StepOfUser {
  lessonID?: number,
  messageID?: number,
  name: StepName
}
export type QuizStorage = Quiz
export type LessonStorage = Lesson

export declare class Storage {
  public getQuizOfSectionByPosition(sectionID: number, position: number): Promise<QuizStorage | null>
  public updateCompletedSection(userID: number, sectionID: number, fullCompleted?: boolean, stars?: number): Promise<void>
  public setStepUser(userID: number, stepData: StepOfUser | null): Promise<void>
  public getStepUser(userID: number): Promise<StepOfUser | null>
  public getLessonOfSectionByPosition(sectionID: number, position: number): Promise<LessonStorage | null>
  public getLessonByID(lessonID: number): Promise<LessonStorage | null>
  public getSectionsOfUser(userID: number, onlyParents: boolean): Promise<SectionOfUser[]>
  public getChildSectionsOfUser(userID: number, parentSectionID: number): Promise<SectionOfUser[]>
  public getSectionOfUserByID(userID: number, sectionID: number): Promise<SectionOfUser | null>
}
