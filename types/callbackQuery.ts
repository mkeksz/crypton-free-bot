export enum QueryName {
  section = 's',
  backToMainSections = 'bs',
  backToMenu = 'bm',
  nextLesson = 'nl',
  wrongAnswerLesson = 'al',
  startQuiz = 'sq'
}

export interface QueryData<T = unknown> {
  n: QueryName,
  d?: T,
  t?: number
}

export type NextLessonOrQuizData = [sectionID: number, nextPosition: number]
