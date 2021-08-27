import {SectionModel, Storage, SubsectionModel} from '../../types/storage'

interface SectionTest extends SectionModel {
  subsections: SubsectionModel[]
}

export default class TestStorage implements Storage {
  private sectionsOfUsers: Map<number, SectionTest[]> = new Map()

  public async getSectionsUser(userID: number): Promise<SectionModel[]> {
    return this.sectionsOfUsers.get(userID) ?? []
  }

  public async getSubsectionsUserBySectionID(userID: number, sectionID: number): Promise<SubsectionModel[]> {
    const sections = this.sectionsOfUsers.get(userID)
    if (!sections) return []
    const section = sections.find(section => section.id === sectionID)
    return section?.subsections || []
  }

  public addSectionToUser(userID: number, section: SectionTest): void {
    const sections = this.sectionsOfUsers.get(userID) ?? []
    sections.push(section)
    this.sectionsOfUsers.set(userID, sections)
  }

  public addSubsectionToUser(userID: number, sectionID: number, subsection: SubsectionModel): void {
    const sections = this.sectionsOfUsers.get(userID) ?? []
    const section = sections.find(section => section.id === sectionID)
    if (!section) return
    section.subsections.push(subsection)
  }
}
