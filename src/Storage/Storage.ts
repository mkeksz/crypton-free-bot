import {PrismaClient, User} from '@prisma/client'
import {
  convertToLessonStorage,
  convertToQuizStorage,
  convertToSectionOfUser,
  getOptionsOfIncludeForSections
} from './helpers'
import {FullSectionStorage, LessonStorage, QuizStorage, SectionOfUser, SectionStorage} from '../types/storage'
import {MessageEntity} from 'telegraf/typings/core/types/typegram'

// TODO Сделать рефакторинг Storage (не забыть про src/types/storage.ts). Сейчас код очень запутанный. Возможно также потребуется изменить модели в schema.prisma.
export default class Storage {
  private readonly prisma = new PrismaClient()

  public async getQuizOfSectionByPosition(sectionID: number, position: number): Promise<QuizStorage | null> {
    const quiz = await this.prisma.quiz.findMany({where: {sectionID, position}})
    if (quiz.length === 0) return null
    return convertToQuizStorage(quiz[0])
  }

  public async getQuizzesOfSection(sectionID: number): Promise<QuizStorage[]> {
    const quizzes = await this.prisma.quiz.findMany({where: {sectionID}})
    return quizzes.map(convertToQuizStorage)
  }

  public async getQuizByID(id: number): Promise<QuizStorage | null> {
    const quiz = await this.prisma.quiz.findUnique({where: {id}})
    if (!quiz) return null
    return convertToQuizStorage(quiz)
  }

  public async getLessonByID(id: number): Promise<LessonStorage | null> {
    const lesson = await this.prisma.lesson.findUnique({where: {id}})
    if (!lesson) return null
    return convertToLessonStorage(lesson)
  }

  public async getChildSections(parentSectionID: number): Promise<SectionStorage[]> {
    return await this.prisma.section.findMany({where: {parentSectionID}})
  }

  public async getChildSectionsOfUser(userID: number, parentSectionID: number): Promise<SectionOfUser[]> {
    const sections = await this.prisma.section.findMany({
      where: {active: true, parentSectionID},
      include: getOptionsOfIncludeForSections(userID)
    })
    return sections.map(convertToSectionOfUser)
  }

  public async addSection(title: string, parentSectionID?: number): Promise<void> {
    const count = await this.prisma.section.count({where: {parentSectionID: parentSectionID ? parentSectionID : null}})
    await this.prisma.section.create({data: {textButton: title, position: count, parentSectionID}})
  }

  public async updateSection(sectionID: number, data: {active?: boolean, position?: number, alwaysAvailable?: boolean, textButton?: string, openAfterSectionID?: number | null}): Promise<SectionStorage> {
    const notOpenAfter = data.openAfterSectionID === undefined || data.openAfterSectionID === null

    return await this.prisma.section.update({
      where: {id: sectionID},
      data: {
        active: data.active,
        position: data.position,
        alwaysAvailable: data.alwaysAvailable,
        textButton: data.textButton,
        opensAfterSections: data.openAfterSectionID !== undefined ? {
          set: notOpenAfter ? [] : {
            id: data.openAfterSectionID!
          }
        } : undefined
      }
    })
  }

  public async deleteSection(sectionID: number): Promise<void> {
    const subsections = await this.prisma.section.findMany({where: {parentSectionID: sectionID}})
    for (const subsection of subsections) {
      const deleteCompleted = this.prisma.userCompletedSection.deleteMany({where: {sectionID: subsection.id}})
      const deleteLessons = this.prisma.lesson.deleteMany({where: {sectionID: subsection.id}})
      const deleteQuiz = this.prisma.quiz.deleteMany({where: {sectionID: subsection.id}})
      await Promise.all([deleteCompleted, deleteLessons, deleteQuiz])
    }
    const deleteCompleted = this.prisma.userCompletedSection.deleteMany({where: {sectionID}})
    const deleteLessons = this.prisma.lesson.deleteMany({where: {sectionID}})
    const deleteQuiz = this.prisma.quiz.deleteMany({where: {sectionID}})
    const deleteSubsections = this.prisma.section.deleteMany({where: {parentSectionID: sectionID}})
    await Promise.all([deleteCompleted, deleteLessons, deleteQuiz, deleteSubsections])
    await this.prisma.section.delete({where: {id: sectionID}})
  }

  public async getSectionsOfUser(userID: number, onlyParents = false): Promise<SectionOfUser[]> {
    const sections = await this.prisma.section.findMany({
      where: {active: true, parentSectionID: onlyParents ? null : undefined},
      include: getOptionsOfIncludeForSections(userID)
    })
    return sections.map(convertToSectionOfUser)
  }

  public async getAllSections(onlyParent = false): Promise<SectionStorage[]> {
    return await this.prisma.section.findMany({where: {parentSectionID: onlyParent ? null : undefined}})
  }

  public async getSectionOfUserByID(userID: number, sectionID: number): Promise<SectionOfUser | null> {
    const section = await this.prisma.section.findUnique({
      where: {id: sectionID},
      include: getOptionsOfIncludeForSections(userID)
    })
    if (!section || !section.active) return null
    return convertToSectionOfUser(section)
  }

  public async getSectionByID(sectionID: number): Promise<FullSectionStorage | null> {
    return await this.prisma.section.findUnique({where: {id: sectionID}, include: {opensAfterSections: true, parentSection: true}})
  }

  public async getLessonOfSectionByPosition(sectionID: number, position: number): Promise<LessonStorage | null> {
    const lessons = await this.prisma.lesson.findMany({where: {sectionID, position}})
    if (lessons.length === 0) return null
    return convertToLessonStorage(lessons[0])
  }

  public async getLessonsOfSection(sectionID: number): Promise<LessonStorage[]> {
    const lessons = await this.prisma.lesson.findMany({where: {sectionID}})
    return lessons.map(convertToLessonStorage)
  }

  public async addLesson(sectionID: number, title: string, text = title, entities?: MessageEntity[]): Promise<LessonStorage> {
    const entitiesJSON = entities ? JSON.stringify(entities) : undefined
    const count = await this.prisma.lesson.count({where: {sectionID}})
    const lesson = await this.prisma.lesson.create({data: {sectionID, title, text, position: count, entities: entitiesJSON}})
    return convertToLessonStorage(lesson)
  }

  public async addQuiz(sectionID: number, title: string, text = title, buttons: string, entities?: MessageEntity[]): Promise<QuizStorage> {
    const entitiesJSON = entities ? JSON.stringify(entities) : undefined
    const count = await this.prisma.quiz.count({where: {sectionID}})
    const quiz = await this.prisma.quiz.create({data: {sectionID, title, text, position: count, entities: entitiesJSON, buttons}})
    return convertToQuizStorage(quiz)
  }

  public async updateLesson(lessonID: number, data: {position?: number, answerButtons?: string | null, answer?: string | null, text?: string, entities?: MessageEntity[] | null, media?: string | null}): Promise<LessonStorage> {
    const entitiesJSON = data.entities ? JSON.stringify(data.entities) : (data.entities === undefined ? undefined : null)
    const lesson = await this.prisma.lesson.update({
      where: {id: lessonID},
      data: {
        position: data.position,
        answerButtons: data.answerButtons,
        answer: data.answer,
        text: data.text,
        entities: entitiesJSON,
        media: data.media
      }
    })
    return convertToLessonStorage(lesson)
  }

  public async updateQuiz(quizID: number, data: {position?: number, buttons?: string, text?: string, entities?: MessageEntity[] | null}): Promise<QuizStorage> {
    const entitiesJSON = data.entities ? JSON.stringify(data.entities) : (data.entities === undefined ? undefined : null)
    const quiz = await this.prisma.quiz.update({
      where: {id: quizID},
      data: {
        position: data.position,
        buttons: data.buttons,
        text: data.text,
        entities: entitiesJSON
      }
    })
    return convertToQuizStorage(quiz)
  }

  public async deleteLesson(lessonID: number): Promise<void> {
    await this.prisma.lesson.delete({where: {id: lessonID}})
  }

  public async deleteQuiz(quizID: number): Promise<void> {
    await this.prisma.quiz.delete({where: {id: quizID}})
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

  public async addUserIfNeed(userID: number, admin?: boolean): Promise<void> {
    await this.prisma.user.upsert({
      where: {telegramID: userID},
      create: {telegramID: userID, admin},
      update: {admin},
      select: {telegramID: true}
    })
  }

  public async getAllAdmins(): Promise<User[]> {
    return await this.prisma.user.findMany({where: {admin: true}})
  }

  public async getUserByID(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({where: {telegramID: id}})
  }
}
