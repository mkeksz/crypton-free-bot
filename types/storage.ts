import {Lesson, Section} from '@prisma/client'

export enum StepName {
  waitAnswerLesson = 'waitAnswerLesson'
}

export interface SectionOfUser extends Section {
  available: boolean
}
export interface StepOfUser {
  lessonID?: number,
  messageID?: number,
  name: StepName
}

export type LessonStorage = Lesson

export declare class Storage {
  public setStepUser(userID: number, stepData: StepOfUser | null): Promise<void>
  public getStepUser(userID: number): Promise<StepOfUser | null>
  public getLessonOfSectionByPosition(sectionID: number, position: number): Promise<LessonStorage | null>
  public getLessonByID(lessonID: number): Promise<LessonStorage | null>
  public getSectionsOfUser(userID: number, onlyParents: boolean): Promise<SectionOfUser[]>
  public getChildSectionsOfUser(userID: number, parentSectionID: number): Promise<SectionOfUser[]>
  public getSectionOfUserByID(userID: number, sectionID: number): Promise<SectionOfUser | null>
}
