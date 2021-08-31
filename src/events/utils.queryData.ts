import {CallbackQuery} from 'typegram/callback'
import {NextLessonData, QueryData} from '@/types/callbackQuery'

export function getNextLessonData(callbackQuery: CallbackQuery): NextLessonData | null {
  const data = getQueryData(callbackQuery)
  if (!data || !Array.isArray(data.d) || typeof data.d[0] !== 'number' || typeof data.d[1] !== 'number') return null
  return data.d as NextLessonData
}

export function getNumberData(callbackQuery: CallbackQuery): number | null {
  const data = getQueryData(callbackQuery)
  if (!data || typeof data.d !== 'number') return null
  return data.d
}

export function getQueryData(callbackQuery: CallbackQuery): QueryData | null {
  if (!('data' in callbackQuery)) return null
  const data = JSON.parse(callbackQuery.data) as QueryData
  if (!data.n) return null
  return data
}
