import type { FoodLog } from './nutritionEngine'

export interface MealTiming {
  timestamp: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  hourOfDay: number
  minuteOfDay: number
  totalMinutesFromMidnight: number
  isLate: boolean
  isCaffeine: boolean
  isHeavy: boolean
}

export interface CircadianAnalysis {
  eatingWindow: number
  firstMealTime: string
  lastMealTime: string
  lastMealHoursBeforeSleep: number
  sleepReadinessScore: number
  digestiveBufferStatus: 'optimal' | 'good' | 'fair' | 'poor' | 'critical'
  isEarlyEater: boolean
  isLateEater: boolean
  caffeineIssues: boolean
  lastCaffeineTime?: string
  warnings: string[]
  recommendations: string[]
  weeklyPattern: {
    averageLastMealTime: number
    consistencyScore: number
    daysWithLateMeals: number
    improvementTrend: 'improving' | 'stable' | 'declining'
  }
}

export interface UserSleepPreferences {
  targetSleepTime: string
  targetWakeTime: string
  desiredDigestiveBuffer: number
}

const DEFAULT_SLEEP_TIME = '22:00'
const DEFAULT_WAKE_TIME = '06:30'
const OPTIMAL_DIGESTION_BUFFER = 240
const GOOD_DIGESTION_BUFFER = 180
const FAIR_DIGESTION_BUFFER = 120
const CAFFEINE_CLEARANCE_TIME = 480

export function parseTimeString(timeStr: string): { hours: number; minutes: number; totalMinutes: number } {
  if (!timeStr || !timeStr.includes(':')) {
    return {
      hours: 0,
      minutes: 0,
      totalMinutes: 0
    }
  }
  const [hours, minutes] = timeStr.split(':').map(Number)
  return {
    hours: isNaN(hours) ? 0 : hours,
    minutes: isNaN(minutes) ? 0 : minutes,
    totalMinutes: (isNaN(hours) ? 0 : hours) * 60 + (isNaN(minutes) ? 0 : minutes)
  }
}

export function timeStringFromMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24
  const minutes = totalMinutes % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

export function extractMealTimings(foodLogs: FoodLog[]): MealTiming[] {
  return foodLogs.map(log => {
    const date = new Date(log.timestamp)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const totalMinutes = hours * 60 + minutes

    const isLate = hours >= 20
    const isCaffeine = log.food.tags?.includes('caffeine') || 
                       log.food.name.toLowerCase().includes('coffee') ||
                       log.food.name.toLowerCase().includes('tea')
    
    const isHeavy = (log.food.protein || 0) > 20 || (log.food.fat || 0) > 15

    return {
      timestamp: log.timestamp,
      mealType: log.mealType || 'snack',
      hourOfDay: hours,
      minuteOfDay: minutes,
      totalMinutesFromMidnight: totalMinutes,
      isLate,
      isCaffeine,
      isHeavy
    }
  })
}

export function analyzeCircadianPattern(
  foodLogs: FoodLog[],
  sleepPreferences?: UserSleepPreferences
): CircadianAnalysis {
  const prefs = sleepPreferences || {
    targetSleepTime: DEFAULT_SLEEP_TIME,
    targetWakeTime: DEFAULT_WAKE_TIME,
    desiredDigestiveBuffer: OPTIMAL_DIGESTION_BUFFER
  }

  const timings = extractMealTimings(foodLogs)
  
  if (timings.length === 0) {
    return {
      eatingWindow: 0,
      firstMealTime: 'N/A',
      lastMealTime: 'N/A',
      lastMealHoursBeforeSleep: 0,
      sleepReadinessScore: 100,
      digestiveBufferStatus: 'optimal',
      isEarlyEater: false,
      isLateEater: false,
      caffeineIssues: false,
      warnings: ['No meals logged yet'],
      recommendations: ['Start logging meals with timestamps to get personalized sleep optimization insights'],
      weeklyPattern: {
        averageLastMealTime: 0,
        consistencyScore: 0,
        daysWithLateMeals: 0,
        improvementTrend: 'stable'
      }
    }
  }

  const sortedTimings = [...timings].sort((a, b) => 
    a.totalMinutesFromMidnight - b.totalMinutesFromMidnight
  )

  const firstMeal = sortedTimings[0]
  const lastMeal = sortedTimings[sortedTimings.length - 1]
  
  const eatingWindow = (lastMeal.totalMinutesFromMidnight - firstMeal.totalMinutesFromMidnight) / 60
  
  const targetSleepMinutes = parseTimeString(prefs.targetSleepTime).totalMinutes
  const lastMealMinutesBeforeSleep = targetSleepMinutes - lastMeal.totalMinutesFromMidnight
  const lastMealHoursBeforeSleep = lastMealMinutesBeforeSleep / 60

  let digestiveBufferStatus: CircadianAnalysis['digestiveBufferStatus'] = 'optimal'
  if (lastMealMinutesBeforeSleep >= OPTIMAL_DIGESTION_BUFFER) {
    digestiveBufferStatus = 'optimal'
  } else if (lastMealMinutesBeforeSleep >= GOOD_DIGESTION_BUFFER) {
    digestiveBufferStatus = 'good'
  } else if (lastMealMinutesBeforeSleep >= FAIR_DIGESTION_BUFFER) {
    digestiveBufferStatus = 'fair'
  } else if (lastMealMinutesBeforeSleep >= 60) {
    digestiveBufferStatus = 'poor'
  } else {
    digestiveBufferStatus = 'critical'
  }

  const sleepReadinessScore = Math.max(0, Math.min(100, 
    (lastMealMinutesBeforeSleep / OPTIMAL_DIGESTION_BUFFER) * 100
  ))

  const isEarlyEater = lastMeal.hourOfDay < 19
  const isLateEater = lastMeal.hourOfDay >= 20

  const caffeineTimings = timings.filter(t => t.isCaffeine)
  const lastCaffeine = caffeineTimings.length > 0 
    ? caffeineTimings[caffeineTimings.length - 1] 
    : null
  
  const caffeineMinutesBeforeSleep = lastCaffeine 
    ? targetSleepMinutes - lastCaffeine.totalMinutesFromMidnight 
    : CAFFEINE_CLEARANCE_TIME + 1
  
  const caffeineIssues = caffeineMinutesBeforeSleep < CAFFEINE_CLEARANCE_TIME

  const warnings: string[] = []
  const recommendations: string[] = []

  if (digestiveBufferStatus === 'critical' || digestiveBufferStatus === 'poor') {
    warnings.push(`Last meal only ${Math.round(lastMealHoursBeforeSleep * 10) / 10} hours before sleep`)
    recommendations.push('Move your last meal at least 3-4 hours before bedtime for optimal sleep quality')
  }

  if (lastMeal.isHeavy && lastMealMinutesBeforeSleep < 240) {
    warnings.push('Heavy meal too close to sleep time - proteins and fats take 4-5 hours to digest')
    recommendations.push('Choose lighter dinner options (vegetables, soup, fish) or eat earlier')
  }

  if (caffeineIssues && lastCaffeine) {
    warnings.push(`Caffeine consumed only ${Math.round(caffeineMinutesBeforeSleep / 60 * 10) / 10} hours before sleep`)
    recommendations.push('Stop caffeine intake at least 8-10 hours before bedtime')
  }

  if (eatingWindow > 14) {
    warnings.push(`Long eating window (${Math.round(eatingWindow)} hours) may impact circadian rhythm`)
    recommendations.push('Try time-restricted feeding: aim for 10-12 hour eating window')
  }

  if (isLateEater) {
    recommendations.push('Shift meals earlier in the day - early time-restricted feeding improves sleep and metabolism')
  }

  if (digestiveBufferStatus === 'optimal' && !caffeineIssues && eatingWindow < 12) {
    recommendations.push('Excellent meal timing! You\'re following optimal circadian principles for deep sleep')
  }

  const recentLogs = foodLogs.slice(-21)
  const dailyLastMeals: { [date: string]: number } = {}
  
  recentLogs.forEach(log => {
    const date = new Date(log.timestamp).toDateString()
    const timing = new Date(log.timestamp)
    const minutes = timing.getHours() * 60 + timing.getMinutes()
    
    if (!dailyLastMeals[date] || minutes > dailyLastMeals[date]) {
      dailyLastMeals[date] = minutes
    }
  })

  const lastMealTimes = Object.values(dailyLastMeals)
  const averageLastMealTime = lastMealTimes.length > 0
    ? lastMealTimes.reduce((a, b) => a + b, 0) / lastMealTimes.length
    : 0

  const daysWithLateMeals = lastMealTimes.filter(time => time >= 20 * 60).length

  const variance = lastMealTimes.length > 1
    ? lastMealTimes.reduce((sum, time) => sum + Math.pow(time - averageLastMealTime, 2), 0) / lastMealTimes.length
    : 0
  
  const consistencyScore = Math.max(0, 100 - Math.sqrt(variance) / 2)

  let improvementTrend: 'improving' | 'stable' | 'declining' = 'stable'
  if (lastMealTimes.length >= 7) {
    const firstHalf = lastMealTimes.slice(0, Math.floor(lastMealTimes.length / 2))
    const secondHalf = lastMealTimes.slice(Math.floor(lastMealTimes.length / 2))
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
    
    if (secondAvg < firstAvg - 30) improvementTrend = 'improving'
    else if (secondAvg > firstAvg + 30) improvementTrend = 'declining'
  }

  return {
    eatingWindow,
    firstMealTime: timeStringFromMinutes(firstMeal.totalMinutesFromMidnight),
    lastMealTime: timeStringFromMinutes(lastMeal.totalMinutesFromMidnight),
    lastMealHoursBeforeSleep,
    sleepReadinessScore: Math.round(sleepReadinessScore),
    digestiveBufferStatus,
    isEarlyEater,
    isLateEater,
    caffeineIssues,
    lastCaffeineTime: lastCaffeine ? timeStringFromMinutes(lastCaffeine.totalMinutesFromMidnight) : undefined,
    warnings,
    recommendations,
    weeklyPattern: {
      averageLastMealTime,
      consistencyScore: Math.round(consistencyScore),
      daysWithLateMeals,
      improvementTrend
    }
  }
}

export function getDigestiveBufferColor(status: CircadianAnalysis['digestiveBufferStatus']): string {
  switch (status) {
    case 'optimal': return 'text-green-600 bg-green-50 border-green-200'
    case 'good': return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'poor': return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'critical': return 'text-red-600 bg-red-50 border-red-200'
  }
}

export function getSleepReadinessMessage(score: number): string {
  if (score >= 90) return 'Excellent timing for deep, restorative sleep'
  if (score >= 75) return 'Good timing - body will be ready for quality sleep'
  if (score >= 50) return 'Fair timing - consider eating earlier tomorrow'
  if (score >= 25) return 'Poor timing - digestion may interfere with sleep'
  return 'Critical - eating too close to sleep significantly impacts sleep quality'
}
