import {PrismaClient, Section} from '@prisma/client'
import {SectionOfUser, Storage} from '@/types/storage'

export default class StoragePrisma implements Storage{
  private readonly prisma: PrismaClient = new PrismaClient()

  public async getChildSectionsOfUser(userID: number, parentSectionID: number): Promise<SectionOfUser[]> {
    await this.addUserIfNeed(userID)
    const sections = await this.prisma.section.findMany({
      where: {active: true, parentSectionID},
      include: getOptionsOfIncludeForSections(userID)
    })
    return sections.map(convertToSectionOfUser)
  }

  public async getSectionsOfUser(userID: number, onlyParents = false): Promise<SectionOfUser[]> {
    await this.addUserIfNeed(userID)
    const sections = await this.prisma.section.findMany({
      where: {active: true, parentSectionID: onlyParents ? null : undefined},
      include: getOptionsOfIncludeForSections(userID)
    })
    return sections.map(convertToSectionOfUser)
  }

  public async getSectionOfUserByID(userID: number, sectionID: number): Promise<SectionOfUser | null> {
    await this.addUserIfNeed(userID)
    const section = await this.prisma.section.findUnique({
      where: {id: sectionID},
      include: getOptionsOfIncludeForSections(userID)
    })
    if (!section || !section.active) return null
    return convertToSectionOfUser(section)
  }

  private async addUserIfNeed(userID: number): Promise<void> {
    await this.prisma.user.upsert({
      where: {telegramID: userID},
      create: {telegramID: userID},
      update: {},
      select: {telegramID: true}
    })
  }
}


type FullSectionInfo = (Section & {users: {userID: number}[], opensAfterSections: {users: {sectionID: number}[]}[]})
type OptionsOfInclude = {
  opensAfterSections: {select: {users: {select: {sectionID: true}, where: {userID: number}}}},
  users: {select: {userID: true}, where: {userID: number}}
}

function getOptionsOfIncludeForSections(userID: number): OptionsOfInclude {
  return {
    users: {where: {userID}, select: {userID: true}},
    opensAfterSections: {select: {users: {where: {userID}, select: {sectionID: true}}}}
  }
}

function convertToSectionOfUser(section: FullSectionInfo): SectionOfUser {
  return {...section, available: checkSectionIsAvailable(section)}
}

function checkSectionIsAvailable(section: FullSectionInfo): boolean {
  const completedSections = section.opensAfterSections.filter(section => section.users.length > 0)
  return section.alwaysAvailable || completedSections.length > 0 || section.users.length > 0
}
