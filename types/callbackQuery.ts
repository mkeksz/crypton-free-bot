export enum CallbackQueryName {
  section = 's',
  backToMainSections = 'bs',
  nextLesson = 'nl'
}

export interface CallbackQueryData<T = unknown> {
  n: CallbackQueryName,
  d?: T
}
