import {Prisma, PrismaClient, User, UserCompletedSection, UserCompletedSubsection} from '@prisma/client'
import {SectionModel, Storage, SubsectionModel} from '@/types/storage'

export default class StoragePrisma implements Storage{
  private readonly prisma: PrismaClient = new PrismaClient()

  public async getSectionsUser(userTelegramID: number): Promise<SectionModel[]> {
    const sections = await this.prisma.section.findMany()
    const completedSections = await this.getCompletedSectionsUser(userTelegramID)

    return sections.map(section => {
      const newSection = {...section, available: false} as SectionModel
      if (newSection.alwaysAvailable || completedSections.find(completedSection => completedSection.sectionID === newSection.id)) {
        newSection.available = true
      }
      return newSection
    })
  }

  public async getSubsectionsUserBySectionID(userTelegramID: number, sectionID: number): Promise<SubsectionModel[]> {
    const subsections = await this.prisma.subsection.findMany({where: {sectionID}})
    const completedSubsections = await this.getCompletedSubsectionsUser(userTelegramID)

    return subsections.map(subsection => {
      const newSubsection = {...subsection, available: false} as SubsectionModel
      if (newSubsection.alwaysAvailable || completedSubsections.find(completedSubsection => completedSubsection.subsectionID === newSubsection.id)) {
        newSubsection.available = true
      }
      return newSubsection
    })
  }

  private async getCompletedSubsectionsUser(userTelegramID: number): Promise<UserCompletedSubsection[]> {
    const completedSubsections = await this.getUser(userTelegramID).completedSubsections()
    if (!completedSubsections) await this.addUser(userTelegramID)
    return completedSubsections || []
  }

  private async getCompletedSectionsUser(userTelegramID: number): Promise<UserCompletedSection[]> {
    const completedSections = await this.getUser(userTelegramID).completedSections()
    if (!completedSections) await this.addUser(userTelegramID)
    return completedSections || []
  }

  private async addUser(telegramID: number): Promise<void> {
    await this.prisma.user.create({data: {telegramID}})
  }

  private getUser(telegramID: number): Prisma.Prisma__UserClient<User | null> {
    return this.prisma.user.findUnique({where: {telegramID}})
  }
}
