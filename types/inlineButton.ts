export enum InlineCallbackType {
  section = 's',
  subsection = 'ss'
}

export interface InlineCallbackData {
  type: InlineCallbackType,
  id: number
}
