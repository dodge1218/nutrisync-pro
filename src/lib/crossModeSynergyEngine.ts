import type { FoodLog, NutrientTotals } from './nutritionEngine'
import type { StressLog } from '../components/StressTracker'

export interface CrossModeSynergy {
  id: string
  type: 'correlation' | 'recommendation' | 'alert' | 'celebration'
  modes: ('nutriwell' | 'sleepsync' | 'lifeflow')[]
  title: string
  description: string
  metrics: Record<string, any>
  confidence: number
  actionable: boolean
  suggestedAction?: string
  createdAt: string
  dismissed: boolean
}

export interface SynergyInsight {
  type: 'nutrient-activity' | 'gbdi-stress' | 'sleep-nutrition' | 'energy-performance'
  title: string
  description: string
  confidence: number
  action?: string
}

export function detectNutrientActivitySynergies(
  foodLogs: FoodLog[],
  schedules: any[],
  days: number = 7
): SynergyInsight[] {
  const insights: SynergyInsight[] = []
  
  const dates = []
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }

  let highProteinBreakfasts = 0
  let morningWorkouts = 0
  let lowMagnesiumDays = 0
  let missedExerciseDays = 0

  dates.forEach(dateStr => {
    const dayLogs = foodLogs.filter(log => log.timestamp.startsWith(dateStr))
    const daySchedule = schedules.find(s => s.date === dateStr)

    const breakfastLogs = dayLogs.filter(log => {
      const hour = parseInt(log.timestamp.split('T')[1]?.substring(0, 2) || '12')
      return hour >= 6 && hour <= 10
    })

    let breakfastProtein = 0
    breakfastLogs.forEach(log => {
      breakfastProtein += (log.food.nutrients?.protein || 0) * log.quantity
    })

    if (breakfastProtein > 25) highProteinBreakfasts++

    if (daySchedule) {
      const morningExercise = daySchedule.activities?.some((a: any) => {
        const hour = parseInt(a.startTime.split(':')[0])
        return a.category === 'exercise' && hour >= 6 && hour <= 12
      })
      if (morningExercise) morningWorkouts++

      const hasExercise = daySchedule.activities?.some((a: any) => a.category === 'exercise')
      if (!hasExercise) missedExerciseDays++
    }

    const nutrients = getDailyNutrients(dayLogs)
    if (nutrients.magnesium < 200) {
      lowMagnesiumDays++
    }
  })

  if (highProteinBreakfasts >= 4 && morningWorkouts >= 3) {
    insights.push({
      type: 'nutrient-activity',
      title: 'Optimal Pre-Workout Nutrition Pattern',
      description: `You consistently fuel morning workouts with high-protein breakfasts. This supports muscle recovery and performance.`,
      confidence: 85,
      action: 'Continue this pattern - aim for 25-30g protein before morning exercise.'
    })
  }

  if (lowMagnesiumDays >= 4 && missedExerciseDays >= 3) {
    insights.push({
      type: 'nutrient-activity',
      title: 'Low Magnesium May Impact Activity',
      description: `On ${lowMagnesiumDays} days with low magnesium intake, you missed scheduled exercise. Magnesium supports energy and muscle function.`,
      confidence: 70,
      action: 'Add magnesium-rich foods (pumpkin seeds, dark leafy greens, dark chocolate) on exercise days.'
    })
  }

  return insights
}

export function detectGBDIStressSynergies(
  foodLogs: FoodLog[],
  stressLogs: StressLog[],
  days: number = 7
): SynergyInsight[] {
  const insights: SynergyInsight[] = []
  
  const dates = []
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }

  let lowGBDIHighStress = 0
  let highGBDILowStress = 0
  let lowFiberHighStress = 0

  dates.forEach(dateStr => {
    const dayLogs = foodLogs.filter(log => log.timestamp.startsWith(dateStr))
    const stressLog = stressLogs.find(log => log.date === dateStr)

    if (!stressLog) return

    const gbdiComponents: GBDIComponents = {
      fiber: 0,
      fermentedFoods: 0,
      plantDiversity: new Set(),
      polyphenolRichFoods: 0,
      prebioticFoods: 0,
      ultraProcessedBurden: 0,
      gutStressors: 0
    }

    dayLogs.forEach(log => {
      gbdiComponents.fiber += (log.food.nutrients?.fiber || 0) * log.quantity
      
      if (log.food.tags?.includes('fermented')) {
        gbdiComponents.fermentedFoods++
      }
      if (log.food.tags?.includes('polyphenol-rich')) {
        gbdiComponents.polyphenolRichFoods++
      }
      if (log.food.tags?.includes('prebiotic')) {
        gbdiComponents.prebioticFoods++
      }
      if (log.food.tags?.includes('ultra-processed')) {
        gbdiComponents.ultraProcessedBurden += log.quantity
      }
    })

    const gbdiScore = calculateGBDIScore(gbdiComponents)

    if (gbdiScore < 50 && stressLog.stressLevel >= 7) {
      lowGBDIHighStress++
    }
    if (gbdiScore > 70 && stressLog.stressLevel <= 4) {
      highGBDILowStress++
    }
    if (gbdiComponents.fiber < 20 && stressLog.stressLevel >= 7) {
      lowFiberHighStress++
    }
  })

  if (lowGBDIHighStress >= 3) {
    insights.push({
      type: 'gbdi-stress',
      title: 'Gut Health & Stress Connection Detected',
      description: `On ${lowGBDIHighStress} days with poor gut health, you also reported high stress. The gut-brain axis may be affecting mood and resilience.`,
      confidence: 80,
      action: 'Prioritize fermented foods, fiber, and plant diversity on stressful days. Schedule time for gut-supporting meals.'
    })
  }

  if (highGBDILowStress >= 4) {
    insights.push({
      type: 'gbdi-stress',
      title: 'Strong Gut Health Supports Low Stress',
      description: `You experience lower stress levels on days with excellent gut health. This validates your gut-supportive eating habits.`,
      confidence: 75
    })
  }

  if (lowFiberHighStress >= 3) {
    insights.push({
      type: 'gbdi-stress',
      title: 'Low Fiber Coincides with High Stress',
      description: `On ${lowFiberHighStress} high-stress days, your fiber intake was below target. Fiber feeds beneficial gut bacteria that produce mood-regulating neurotransmitters.`,
      confidence: 72,
      action: 'Add a high-fiber snack (berries with chia seeds, apple with almond butter) during stressful days.'
    })
  }

  return insights
}

export function detectSleepNutritionSynergies(
  foodLogs: FoodLog[],
  stressLogs: StressLog[],
  sleepPreferences: any,
  days: number = 7
): SynergyInsight[] {
  const insights: SynergyInsight[] = []
  
  const dates = []
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }

  let earlyDinnerGoodSleep = 0
  let lateDinnerPoorSleep = 0
  let highMagnesiumGoodSleep = 0

  dates.forEach(dateStr => {
    const dayLogs = foodLogs.filter(log => log.timestamp.startsWith(dateStr))
    const stressLog = stressLogs.find(log => log.date === dateStr)

    if (!stressLog) return

    const eveningMeals = dayLogs.filter(log => {
      const hour = parseInt(log.timestamp.split('T')[1]?.substring(0, 2) || '18')
      return hour >= 17 && hour <= 21
    })

    const lastMealTime = eveningMeals.length > 0
      ? Math.max(...eveningMeals.map(log => {
          const hour = parseInt(log.timestamp.split('T')[1]?.substring(0, 2) || '18')
          const min = parseInt(log.timestamp.split('T')[1]?.substring(3, 5) || '0')
          return hour * 60 + min
        }))
      : 0

    const targetSleepTime = sleepPreferences?.targetSleepTime || '22:00'
    const sleepHour = parseInt(targetSleepTime.split(':')[0])
    const sleepMin = parseInt(targetSleepTime.split(':')[1] || '0')
    const sleepMinutes = sleepHour * 60 + sleepMin

    const bufferMinutes = sleepMinutes - lastMealTime

    if (bufferMinutes >= 240 && stressLog.sleepQuality >= 7) {
      earlyDinnerGoodSleep++
    }
    if (bufferMinutes < 180 && stressLog.sleepQuality <= 5) {
      lateDinnerPoorSleep++
    }

    const nutrients = getDailyNutrients(dayLogs)
    if (nutrients.magnesium >= 300 && stressLog.sleepQuality >= 7) {
      highMagnesiumGoodSleep++
    }
  })

  if (earlyDinnerGoodSleep >= 4) {
    insights.push({
      type: 'sleep-nutrition',
      title: 'Early Dinner Improves Sleep Quality',
      description: `On ${earlyDinnerGoodSleep} days when you ate 4+ hours before bed, you reported excellent sleep quality.`,
      confidence: 85,
      action: 'Continue finishing dinner by 6-7pm for optimal sleep. Schedule earlier meal times in LifeFlow.'
    })
  }

  if (lateDinnerPoorSleep >= 3) {
    insights.push({
      type: 'sleep-nutrition',
      title: 'Late Meals Disrupt Sleep',
      description: `Eating within 3 hours of bedtime coincided with poor sleep on ${lateDinnerPoorSleep} days. Digestion interferes with sleep quality.`,
      confidence: 78,
      action: 'Move dinner earlier. If hungry late, choose a light snack like kefir or a small handful of nuts.'
    })
  }

  if (highMagnesiumGoodSleep >= 4) {
    insights.push({
      type: 'sleep-nutrition',
      title: 'Magnesium Supports Better Sleep',
      description: `Days with adequate magnesium intake (300mg+) showed better sleep quality. Magnesium promotes relaxation and sleep.`,
      confidence: 73,
      action: 'Maintain magnesium-rich foods or consider an evening supplement of magnesium glycinate.'
    })
  }

  return insights
}

export function detectEnergyPerformanceSynergies(
  foodLogs: FoodLog[],
  stressLogs: StressLog[],
  schedules: any[],
  days: number = 7
): SynergyInsight[] {
  const insights: SynergyInsight[] = []
  
  const dates = []
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }

  let lowEnergyLowProtein = 0
  let highEnergyCompleteSchedule = 0
  let lowEnergyMissedTasks = 0

  dates.forEach(dateStr => {
    const dayLogs = foodLogs.filter(log => log.timestamp.startsWith(dateStr))
    const stressLog = stressLogs.find(log => log.date === dateStr)
    const daySchedule = schedules.find(s => s.date === dateStr)

    if (!stressLog || !daySchedule) return

    const nutrients = getDailyNutrients(dayLogs)
    const completedActivities = daySchedule.activities?.filter((a: any) => a.isCompleted).length || 0
    const totalActivities = daySchedule.activities?.length || 1

    if (stressLog.energyLevel <= 4 && nutrients.protein < 60) {
      lowEnergyLowProtein++
    }

    if (stressLog.energyLevel >= 7 && completedActivities / totalActivities >= 0.8) {
      highEnergyCompleteSchedule++
    }

    if (stressLog.energyLevel <= 4 && completedActivities / totalActivities < 0.5) {
      lowEnergyMissedTasks++
    }
  })

  if (lowEnergyLowProtein >= 3) {
    insights.push({
      type: 'energy-performance',
      title: 'Low Protein Correlates with Low Energy',
      description: `On ${lowEnergyLowProtein} low-energy days, your protein intake was below 60g. Protein stabilizes blood sugar and supports sustained energy.`,
      confidence: 75,
      action: 'Prioritize protein at each meal: eggs at breakfast, chicken/fish at lunch, legumes at dinner.'
    })
  }

  if (highEnergyCompleteSchedule >= 4) {
    insights.push({
      type: 'energy-performance',
      title: 'High Energy Drives Task Completion',
      description: `On ${highEnergyCompleteSchedule} days with high energy levels, you completed 80%+ of scheduled activities. Great momentum!`,
      confidence: 80
    })
  }

  if (lowEnergyMissedTasks >= 3) {
    insights.push({
      type: 'energy-performance',
      title: 'Low Energy Impacts Productivity',
      description: `Low energy days resulted in missing scheduled activities. Focus on sleep, nutrient-dense meals, and stress management.`,
      confidence: 70,
      action: 'On low-energy mornings, prioritize easier tasks first and add a 10-minute walk for energy boost.'
    })
  }

  return insights
}

export function generateCrossModeSynergies(
  foodLogs: FoodLog[],
  stressLogs: StressLog[],
  schedules: any[],
  sleepPreferences: any,
  days: number = 7
): CrossModeSynergy[] {
  const allInsights: SynergyInsight[] = []

  allInsights.push(...detectNutrientActivitySynergies(foodLogs, schedules, days))
  allInsights.push(...detectGBDIStressSynergies(foodLogs, stressLogs, days))
  allInsights.push(...detectSleepNutritionSynergies(foodLogs, stressLogs, sleepPreferences, days))
  allInsights.push(...detectEnergyPerformanceSynergies(foodLogs, stressLogs, schedules, days))

  return allInsights.map((insight, index) => ({
    id: `synergy-${Date.now()}-${index}`,
    type: insight.action ? 'recommendation' : 'celebration',
    modes: getModes(insight.type),
    title: insight.title,
    description: insight.description,
    metrics: { confidence: insight.confidence },
    confidence: insight.confidence,
    actionable: !!insight.action,
    suggestedAction: insight.action,
    createdAt: new Date().toISOString(),
    dismissed: false
  }))
}

function getModes(insightType: string): ('nutriwell' | 'sleepsync' | 'lifeflow')[] {
  switch (insightType) {
    case 'nutrient-activity':
      return ['nutriwell', 'lifeflow']
    case 'gbdi-stress':
      return ['nutriwell', 'lifeflow']
    case 'sleep-nutrition':
      return ['nutriwell', 'sleepsync']
    case 'energy-performance':
      return ['nutriwell', 'lifeflow']
    default:
      return ['nutriwell', 'sleepsync', 'lifeflow']
  }
}
