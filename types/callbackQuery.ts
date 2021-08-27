export enum CallbackQueryName {
  section = 's',
  subsection = 'ss'
}

export interface CallbackQueryData<T = unknown> {
  n: CallbackQueryName,
  d?: T
}
