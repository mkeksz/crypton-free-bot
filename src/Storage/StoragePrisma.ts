import {PrismaClient, Section} from '@prisma/client'
import {LessonStorage, QuizStorage, SectionOfUser, StarsOfSection, StepOfUser, Storage} from '@/types/storage'

export default class StoragePrisma implements Storage{
  private readonly prisma: PrismaClient = new PrismaClient()

  public async getQuizOfSectionByPosition(sectionID: number, position: number): Promise<QuizStorage | null> {
    const quiz = await this.prisma.quiz.findMany({where: {sectionID, position}})
    if (quiz.length === 0) return null
    return quiz[0]
  }

  public async setStepUser(userID: number, stepData: StepOfUser | null): Promise<void> {
    await this.addUserIfNeed(userID)
    const step = stepData ? JSON.stringify(stepData) : null
    await this.prisma.user.update({where: {telegramID: userID}, data: {step}})
  }

  public async getStepUser(userID: number): Promise<StepOfUser | null> {
    const user = await this.prisma.user.findUnique({where: {telegramID: userID}})
    if (!user?.step) return null
    return getStepFromJSON(user.step)
  }

  public async getLessonByID(id: number): Promise<LessonStorage | null> {
    return await this.prisma.lesson.findUnique({where: {id}})
  }

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

  public async getLessonOfSectionByPosition(sectionID: number, position: number): Promise<LessonStorage | null> {
    const lessons = await this.prisma.lesson.findMany({where: {sectionID, position}})
    if (lessons.length === 0) return null
    return lessons[0]
  }

  private async addUserIfNeed(userID: number): Promise<void> {
    await this.prisma.user.upsert({
      where: {telegramID: userID},
      create: {telegramID: userID},
      update: {},
      select: {telegramID: true}
    })
  }

  public async updateCompletedSection(userID: number, sectionID: number, completedQuiz?: boolean, stars?: number): Promise<void> {
    const completedSection = await this.prisma.userCompletedSection.upsert({
      where: {sectionID_userID: {userID, sectionID}},
      create: {sectionID, userID, completedQuiz, stars},
      update: {completedQuiz, stars},
      select: {sectionID: true, section: true}
    })
    if (!completedQuiz) return
    const subsections = await this.prisma.section.findMany({where: {parentSectionID: completedSection.section.parentSectionID}, select: {users: {where: {userID, completedQuiz: true}}}})
    if (subsections.length === 0) return

    let fullCompletedSubsections = true
    for (const subsection of subsections) {
      if (subsection.users.length === 0) {
        fullCompletedSubsections = false
        break
      }
    }

    if (!fullCompletedSubsections || !completedSection.section.parentSectionID) return
    await this.updateCompletedSection(userID, completedSection.section.parentSectionID, true)
  }
}


function getStepFromJSON(dataJSON: string): StepOfUser | null {
  const data = JSON.parse(dataJSON) as StepOfUser
  if (!data.name) return null
  return data
}

type FullSectionInfo = (Section & {users: {userID: number, stars: number, completedQuiz: boolean}[], opensAfterSections: {users: {sectionID: number}[]}[]})
type OptionsOfInclude = {
  users: {select: {userID: true, stars: true, completedQuiz: true}, where: {userID: number}},
  opensAfterSections: {select: {users: {select: {sectionID: true}, where: {userID: number, completedQuiz: true}}}}
}

function getOptionsOfIncludeForSections(userID: number): OptionsOfInclude {
  return {
    users: {where: {userID}, select: {userID: true, stars: true, completedQuiz: true}},
    opensAfterSections: {select: {users: {where: {userID, completedQuiz: true}, select: {sectionID: true}}}}
  }
}

function convertToSectionOfUser(section: FullSectionInfo): SectionOfUser {
  return {
    ...section,
    available: checkSectionIsAvailable(section),
    stars: getStarsOfSection(section),
    availableQuiz: checkAvailableQuiz(section),
    completedQuiz: checkCompletedQuiz(section)
  }
}

function checkSectionIsAvailable(section: FullSectionInfo): boolean {
  const completedSections = section.opensAfterSections.filter(section => section.users.length > 0)
  return section.alwaysAvailable || completedSections.length > 0 || (section.users.length > 0 && section.users[0].completedQuiz)
}

function getStarsOfSection(section: FullSectionInfo): StarsOfSection {
  return section.users.length > 0 ? section.users[0].stars as StarsOfSection : 0
}

function checkAvailableQuiz(section: FullSectionInfo): boolean {
  return section.users.length > 0
}

function checkCompletedQuiz(section: FullSectionInfo): boolean {
  return section.users.length > 0 ? section.users[0].completedQuiz : false
}
