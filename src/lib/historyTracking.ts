import type { FoodLog, NutrientTotals } from './nutritionEngine'
import { calculateNutrientTotals, performWellnessAudit } from './nutritionEngine'
import { getNutrientDV, type NutrientKey } from './dailyValues'

export interface DailySnapshot {
  date: string
  totals: NutrientTotals
  gbdi: number
  calories: number
  percentages: {
    [key in NutrientKey]?: number
  }
  compositeScore: number
}

export interface HistoryData {
  dailySnapshots: DailySnapshot[]
  lastResetDate: string
}

export function getDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getTodayKey(): string {
  return getDateKey(new Date())
}

export function shouldResetForNewDay(lastResetDate: string): boolean {
  return lastResetDate !== getTodayKey()
}

export function filterLogsForDate(logs: FoodLog[], dateKey: string): FoodLog[] {
  return logs.filter(log => {
    const logDate = new Date(log.timestamp)
    return getDateKey(logDate) === dateKey
  })
}

export function calculateCompositeScore(totals: NutrientTotals, gbdi: number): number {
  const macroKeys: NutrientKey[] = ['protein', 'fiber']
  const vitaminKeys: NutrientKey[] = [
    'vitaminA', 'vitaminC', 'vitaminD', 'vitaminE', 'vitaminK',
    'vitaminB1', 'vitaminB2', 'vitaminB3', 'vitaminB6', 'vitaminB9', 'vitaminB12'
  ]
  const mineralKeys: NutrientKey[] = [
    'calcium', 'iron', 'magnesium', 'zinc', 'selenium', 'copper', 'manganese', 'potassium'
  ]

  const calculateAverage = (keys: NutrientKey[]) => {
    let total = 0
    let count = 0
    for (const key of keys) {
      const value = totals[key] || 0
      const dv = getNutrientDV(key)
      if (dv > 0) {
        const percentage = Math.min((value / dv) * 100, 150)
        total += percentage
        count++
      }
    }
    return count > 0 ? total / count : 0
  }

  const macroScore = calculateAverage(macroKeys)
  const vitaminScore = calculateAverage(vitaminKeys)
  const mineralScore = calculateAverage(mineralKeys)

  const composite = (gbdi * 0.30) + (macroScore * 0.25) + (vitaminScore * 0.25) + (mineralScore * 0.20)
  
  return Math.min(composite, 100)
}

export function calculateMicronutrientComposite(totals: NutrientTotals): number {
  const mineralKeys: NutrientKey[] = [
    'calcium', 'iron', 'magnesium', 'zinc', 'selenium', 'copper', 'manganese', 'potassium'
  ]
  
  let total = 0
  let count = 0
  
  for (const key of mineralKeys) {
    const value = totals[key] || 0
    const dv = getNutrientDV(key)
    if (dv > 0) {
      const percentage = Math.min((value / dv) * 100, 150)
      total += percentage
      count++
    }
  }
  
  return count > 0 ? total / count : 0
}

export function calculateVitaminComposite(totals: NutrientTotals): number {
  const vitaminKeys: NutrientKey[] = [
    'vitaminA', 'vitaminC', 'vitaminD', 'vitaminE', 'vitaminK',
    'vitaminB1', 'vitaminB2', 'vitaminB3', 'vitaminB6', 'vitaminB9', 'vitaminB12'
  ]
  
  let total = 0
  let count = 0
  
  for (const key of vitaminKeys) {
    const value = totals[key] || 0
    const dv = getNutrientDV(key)
    if (dv > 0) {
      const percentage = Math.min((value / dv) * 100, 150)
      total += percentage
      count++
    }
  }
  
  return count > 0 ? total / count : 0
}

export function createDailySnapshot(logs: FoodLog[], date: string): DailySnapshot {
  const totals = calculateNutrientTotals(logs)
  const wellness = performWellnessAudit(logs, totals)
  
  const percentages: { [key in NutrientKey]?: number } = {}
  const nutrientKeys: NutrientKey[] = [
    'protein', 'carbs', 'fat', 'fiber',
    'vitaminA', 'vitaminC', 'vitaminD', 'vitaminE', 'vitaminK',
    'vitaminB1', 'vitaminB2', 'vitaminB3', 'vitaminB6', 'vitaminB9', 'vitaminB12',
    'calcium', 'iron', 'magnesium', 'zinc', 'selenium', 'copper', 'manganese', 'potassium'
  ]

  for (const key of nutrientKeys) {
    const value = totals[key] || 0
    const dv = getNutrientDV(key)
    if (dv > 0) {
      percentages[key] = (value / dv) * 100
    }
  }

  const compositeScore = calculateCompositeScore(totals, wellness.gbdi)

  return {
    date,
    totals,
    gbdi: wellness.gbdi,
    calories: totals.calories,
    percentages,
    compositeScore
  }
}

export function updateHistoryData(
  currentHistory: HistoryData | null,
  foodLogs: FoodLog[]
): HistoryData {
  const today = getTodayKey()
  const history = currentHistory || { dailySnapshots: [], lastResetDate: today }

  const last7Days = getLast7DaysKeys()
  const newSnapshots: DailySnapshot[] = []

  for (const dateKey of last7Days) {
    const logsForDate = filterLogsForDate(foodLogs, dateKey)
    const snapshot = createDailySnapshot(logsForDate, dateKey)
    newSnapshots.push(snapshot)
  }

  const filteredFoodLogs = foodLogs.filter(log => {
    const logDate = new Date(log.timestamp)
    const logKey = getDateKey(logDate)
    return last7Days.includes(logKey)
  })

  return {
    dailySnapshots: newSnapshots,
    lastResetDate: today
  }
}

export function getLast7DaysKeys(): string[] {
  const keys: string[] = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    keys.push(getDateKey(date))
  }
  
  return keys
}

export function getDayLabel(dateKey: string): string {
  if (!dateKey) return 'Unknown'
  
  const today = getTodayKey()
  if (dateKey === today) return 'Today'
  
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (dateKey === getDateKey(yesterday)) return 'Yesterday'
  
  const parts = dateKey.split('-')
  if (parts.length !== 3) return 'Invalid Date'
  
  const [year, month, day] = parts
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return dayNames[date.getDay()]
}

export function getShortDayLabel(dateKey: string): string {
  if (!dateKey) return 'N/A'
  
  const today = getTodayKey()
  if (dateKey === today) return 'Today'
  
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (dateKey === getDateKey(yesterday)) return 'Yesterday'
  
  const parts = dateKey.split('-')
  if (parts.length !== 3) return 'N/A'
  
  const [year, month, day] = parts
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  return dayNames[date.getDay()]
}
