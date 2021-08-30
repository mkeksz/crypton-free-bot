export enum QueryName {
  section = 's',
  backToMainSections = 'bs',
  nextLesson = 'nl'
}

export interface QueryData<T = unknown> {
  n: QueryName,
  d?: T
}

export type NextLessonQueryData = [sectionID: number, nextPosition: number]
