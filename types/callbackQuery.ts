export enum CallbackQueryName {
  section = 's',
  backToMainSections = 'bs'
}

export interface CallbackQueryData<T = unknown> {
  n: CallbackQueryName,
  d?: T
}
