import {Lesson, Section} from '@prisma/client'

export interface SectionOfUser extends Section {
  available: boolean
}

export type LessonStorage = Lesson

export declare class Storage {
  public getLessonOfSectionByPosition(sectionID: number, position: number): Promise<LessonStorage | null>
  public getSectionsOfUser(userID: number, onlyParents: boolean): Promise<SectionOfUser[]>
  public getChildSectionsOfUser(userID: number, parentSectionID: number): Promise<SectionOfUser[]>
  public getSectionOfUserByID(userID: number, sectionID: number): Promise<SectionOfUser | null>
}
