import {Section} from '@prisma/client'
import {SectionOfUser, StarsOfSection} from '@/src/types/storage'

type FullSectionInfo = (Section & {users: {userID: number, stars: number, fullCompleted: boolean}[], opensAfterSections: {users: {sectionID: number}[]}[]})
type OptionsOfInclude = {
  users: {select: {userID: true, stars: true, fullCompleted: true}, where: {userID: number}},
  opensAfterSections: {select: {users: {select: {sectionID: true}, where: {userID: number, fullCompleted: true}}}}
}

export function getOptionsOfIncludeForSections(userID: number): OptionsOfInclude {
  return {
    users: {where: {userID}, select: {userID: true, stars: true, fullCompleted: true}},
    opensAfterSections: {select: {users: {where: {userID, fullCompleted: true}, select: {sectionID: true}}}}
  }
}

export function convertToSectionOfUser(section: FullSectionInfo): SectionOfUser {
  return {
    ...section,
    available: checkSectionIsAvailable(section),
    stars: getStarsOfSection(section),
    availableQuiz: checkAvailableQuiz(section),
    fullCompleted: checkFullCompleted(section)
  }
}

export function checkSectionIsAvailable(section: FullSectionInfo): boolean {
  const completedSections = section.opensAfterSections.filter(section => section.users.length > 0)
  return section.alwaysAvailable || completedSections.length > 0 || (section.users.length > 0 && section.users[0].fullCompleted)
}

export function getStarsOfSection(section: FullSectionInfo): StarsOfSection {
  return section.users.length > 0 ? section.users[0].stars as StarsOfSection : 0
}

export function checkAvailableQuiz(section: FullSectionInfo): boolean {
  return section.users.length > 0
}

export function checkFullCompleted(section: FullSectionInfo): boolean {
  return section.users.length > 0 ? section.users[0].fullCompleted : false
}
