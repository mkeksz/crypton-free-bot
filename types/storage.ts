import {Section, Subsection} from '@prisma/client'

export interface SectionModel extends Section {
  available: boolean
}

export interface SubsectionModel extends Subsection {
  available: boolean
}

export declare class Storage {
  public getSectionsUser(userID: number): Promise<SectionModel[]>
  public getSubsectionsUserBySectionID(userID: number, sectionID: number): Promise<SubsectionModel[]>
}
