import {SectionOfUser, Storage} from '../../types/storage'

interface SectionTest extends SectionOfUser {
  subsections: SectionOfUser[]
}

export default class TestStorage implements Storage {
  private sectionsOfUsers: Map<number, SectionTest[]> = new Map()

  public async getSectionOfUserByID(userID: number, sectionID: number): Promise<SectionOfUser | null> {
    const sections = this.sectionsOfUsers.get(userID) ?? []
    return sections.find(section => section.id === sectionID) ?? null
  }

  public async getSectionsOfUser(userID: number, onlyParents = false): Promise<SectionOfUser[]> {
    return this.sectionsOfUsers.get(userID) ?? []
  }

  public async getChildSectionsOfUser(userID: number, parentSectionID: number): Promise<SectionOfUser[]> {
    const sections = this.sectionsOfUsers.get(userID)
    if (!sections) return []
    const section = sections.find(section => section.id === parentSectionID)
    return section?.subsections || []
  }

  public addSectionToUser(userID: number, section: SectionOfUser): void {
    const sections = this.sectionsOfUsers.get(userID) ?? []
    sections.push({...section, subsections: []})
    this.sectionsOfUsers.set(userID, sections)
  }

  public addSubsectionToUser(userID: number, sectionID: number, subsection: SectionOfUser): void {
    const sections = this.sectionsOfUsers.get(userID) ?? []
    const section = sections.find(section => section.id === sectionID)
    if (!section) return
    section.subsections.push(subsection)
  }
}
