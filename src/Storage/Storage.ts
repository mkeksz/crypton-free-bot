import {PrismaClient} from '@prisma/client'
import {convertToSectionOfUser, getOptionsOfIncludeForSections} from './helpers'
import {LessonStorage, QuizStorage, SectionOfUser} from '../types/storage'

// TODO Сделать рефакторинг Storage (не забыть про src/types/storage.ts). Сейчас код очень запутанный.
export default class Storage {
  private readonly prisma = new PrismaClient()

  public async getQuizOfSectionByPosition(sectionID: number, position: number): Promise<QuizStorage | null> {
    const quiz = await this.prisma.quiz.findMany({where: {sectionID, position}})
    if (quiz.length === 0) return null
    return quiz[0]
  }

  public async getLessonByID(id: number): Promise<LessonStorage | null> {
    return await this.prisma.lesson.findUnique({where: {id}})
  }

  public async getChildSectionsOfUser(userID: number, parentSectionID: number): Promise<SectionOfUser[]> {
    const sections = await this.prisma.section.findMany({
      where: {active: true, parentSectionID},
      include: getOptionsOfIncludeForSections(userID)
    })
    return sections.map(convertToSectionOfUser)
  }

  public async getSectionsOfUser(userID: number, onlyParents = false): Promise<SectionOfUser[]> {
    const sections = await this.prisma.section.findMany({
      where: {active: true, parentSectionID: onlyParents ? null : undefined},
      include: getOptionsOfIncludeForSections(userID)
    })
    return sections.map(convertToSectionOfUser)
  }

  public async getSectionOfUserByID(userID: number, sectionID: number): Promise<SectionOfUser | null> {
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

  public async updateCompletedSection(userID: number, sectionID: number, fullCompleted?: boolean, stars?: number): Promise<void> {
    const completedSection = await this.prisma.userCompletedSection.upsert({
      where: {sectionID_userID: {userID, sectionID}},
      create: {sectionID, userID, fullCompleted, stars},
      update: {fullCompleted, stars},
      select: {sectionID: true, section: true}
    })
    if (!fullCompleted) return
    const subsections = await this.prisma.section.findMany({where: {parentSectionID: completedSection.section.parentSectionID}, select: {users: {where: {userID, fullCompleted: true}}}})
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

  public async addUserIfNeed(userID: number): Promise<void> {
    await this.prisma.user.upsert({
      where: {telegramID: userID},
      create: {telegramID: userID},
      update: {},
      select: {telegramID: true}
    })
  }
}
