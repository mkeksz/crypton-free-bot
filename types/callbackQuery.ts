export enum QueryName {
  section = 's',
  backToMainSections = 'bs',
  backToMenu = 'bm',
  nextLesson = 'nl',
  wrongAnswerLesson = 'al'
}

export interface QueryData<T = unknown> {
  n: QueryName,
  d?: T
}

export type NextLessonQueryData = [sectionID: number, nextPosition: number]
