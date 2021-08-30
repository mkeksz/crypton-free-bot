import {Section} from '@prisma/client'

export interface SectionOfUser extends Section {
  available: boolean
}

export declare class Storage {
  public getSectionsOfUser(userID: number, onlyParents: boolean): Promise<SectionOfUser[]>
  public getChildSectionsOfUser(userID: number, parentSectionID: number): Promise<SectionOfUser[]>
  public getSectionOfUserByID(userID: number, sectionID: number): Promise<SectionOfUser | null>
}
