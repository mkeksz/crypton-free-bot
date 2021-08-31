import {CallbackQuery} from 'typegram/callback'
import {NextLessonData, NextQuizData, QueryData, QueryName} from '@/types/callbackQuery'
import {getUnixTime} from '@/src/utils'

export function getNextLesson(callbackQuery: CallbackQuery): NextLessonData | null {
  const data = getQueryData(callbackQuery)
  if (!data || !Array.isArray(data.d) || typeof data.d[0] !== 'number' || typeof data.d[1] !== 'number') return null
  return data.d as NextLessonData
}

export function getNextQuiz(callbackQuery: CallbackQuery): NextQuizData | null {
  const data = getQueryData(callbackQuery)
  if (!data || !Array.isArray(data.d) || typeof data.d[0] !== 'number' || typeof data.d[1] !== 'number' || typeof data.d[2] !== 'number') return null
  return data.d as NextQuizData
}

export function getNumberData(callbackQuery: CallbackQuery): number | null {
  const data = getQueryData(callbackQuery)
  if (!data || typeof data.d !== 'number') return null
  return data.d
}

export function getWaitSecondsData(callbackQuery: CallbackQuery): number {
  const time = getTimeData(callbackQuery) ?? 0
  const currentTime = getUnixTime()
  return 60 - (currentTime - time)
}

export function getTimeData(callbackQuery: CallbackQuery): number | null {
  const data = getQueryData(callbackQuery)
  if (!data || typeof data.t !== 'number') return null
  return data.t
}

export function getQueryData(callbackQuery: CallbackQuery): QueryData | null {
  if (!('data' in callbackQuery)) return null
  const data = JSON.parse(callbackQuery.data) as QueryData
  if (!data.n) return null
  return data
}

export function createQueryDataJSON<T = unknown>(name: QueryName, data?: T, unixTime?: number): string {
  const callbackData = {d: data, n: name, t: unixTime} as QueryData<T>
  return JSON.stringify(callbackData)
}
