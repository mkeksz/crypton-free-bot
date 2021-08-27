import {SectionModel, Storage, SubsectionModel} from '../../types/storage'

export default class TestStorage implements Storage {
  private sectionsOfUsers: Map<number, SectionModel[]>
  private subsectionsOfUsers: Map<number, SubsectionModel[]>

  public constructor() {
    this.sectionsOfUsers = new Map()
    this.subsectionsOfUsers = new Map()
  }

  public async getSectionsUser(userID: number): Promise<SectionModel[]> {
    return this.sectionsOfUsers.get(userID) ?? []
  }

  public async getSubsectionsUserBySectionID(userID: number, sectionID: number): Promise<SubsectionModel[]> {
    return this.subsectionsOfUsers.get(userID) ?? []
  }

  public addSectionToUser(userID: number, section: SectionModel): void {
    const sections = this.sectionsOfUsers.get(userID) ?? []
    sections.push(section)
    this.sectionsOfUsers.set(userID, sections)
  }

  public addSubsectionToUser(userID: number, subsection: SubsectionModel): void {
    const subsections = this.subsectionsOfUsers.get(userID) ?? []
    subsections.push(subsection)
    this.sectionsOfUsers.set(userID, subsections)
  }
}
