import type { FoodLog } from './nutritionEngine'
import type { ExerciseLog } from './exerciseEngine'

export interface PostWorkoutRecommendation {
  mealType: 'snack' | 'meal'
  timing: string
  protein: number
  carbs: number
  calories: number
  suggestions: string[]
  rationale: string
  hydration: string
}

export interface WorkoutNutritionInsight {
  exerciseType: string
  caloriesBurned: number
  duration: number
  needsRecovery: boolean
  proteinBoost: boolean
  carbRepletion: boolean
  electrolytes: boolean
  timing: 'within-30min' | 'within-2hours' | 'next-meal'
}

export function analyzeWorkoutNutritionNeeds(
  exercise: ExerciseLog,
  todayFoodLogs: FoodLog[]
): WorkoutNutritionInsight {
  const activityName = exercise.activityName.toLowerCase()
  const isStrengthTraining = activityName.includes('lift') ||
    activityName.includes('strength') ||
    activityName.includes('weight')

  const isCardio = activityName.includes('run') ||
    activityName.includes('walk') ||
    activityName.includes('bike') ||
    activityName.includes('swim') ||
    activityName.includes('cycle')

  const isHighIntensity = exercise.caloriesBurned > 400 || exercise.duration > 60

  const needsRecovery = isStrengthTraining || isHighIntensity
  const proteinBoost = isStrengthTraining
  const carbRepletion = isCardio && exercise.duration > 45
  const electrolytes = isCardio && exercise.duration > 60

  let timing: 'within-30min' | 'within-2hours' | 'next-meal' = 'next-meal'
  if (isStrengthTraining || isHighIntensity) {
    timing = 'within-30min'
  } else if (exercise.caloriesBurned > 200) {
    timing = 'within-2hours'
  }

  return {
    exerciseType: isStrengthTraining ? 'strength' : isCardio ? 'cardio' : 'general',
    caloriesBurned: exercise.caloriesBurned,
    duration: exercise.duration,
    needsRecovery,
    proteinBoost,
    carbRepletion,
    electrolytes,
    timing
  }
}

export function generatePostWorkoutRecommendation(
  insight: WorkoutNutritionInsight
): PostWorkoutRecommendation {
  const baseProtein = insight.proteinBoost ? 25 : 15
  const baseCarbs = insight.carbRepletion ? 40 : 20
  const baseCalories = (baseProtein * 4) + (baseCarbs * 4) + 50

  const suggestions: string[] = []
  let rationale = ''

  if (insight.exerciseType === 'strength') {
    suggestions.push(
      'Greek yogurt with berries and honey',
      'Protein smoothie with banana and almond butter',
      'Eggs with sweet potato',
      'Chicken breast with quinoa',
      'Protein shake with oats'
    )
    rationale = 'After strength training, prioritize protein (20-30g) for muscle recovery and moderate carbs to replenish glycogen.'
  } else if (insight.exerciseType === 'cardio') {
    suggestions.push(
      'Oatmeal with banana and protein powder',
      'Turkey sandwich on whole grain bread',
      'Rice bowl with salmon and vegetables',
      'Smoothie with berries, spinach, and protein',
      'Toast with avocado and eggs'
    )
    rationale = 'After cardio, balance carbs for glycogen repletion with moderate protein for recovery.'
  } else {
    suggestions.push(
      'Trail mix with nuts and dried fruit',
      'Apple with almond butter',
      'Yogurt parfait',
      'Hummus with vegetables and pita',
      'Cottage cheese with fruit'
    )
    rationale = 'Light recovery nutrition to support your workout without overdoing calories.'
  }

  let hydration = 'Drink 16-20 oz water'
  if (insight.electrolytes) {
    hydration = 'Drink 20-24 oz water with electrolytes (coconut water, or add pinch of sea salt)'
    suggestions.unshift('Coconut water (natural electrolytes)')
  }

  const timingMessage = insight.timing === 'within-30min'
    ? 'within 30 minutes for optimal recovery'
    : insight.timing === 'within-2hours'
    ? 'within 1-2 hours'
    : 'at your next meal'

  return {
    mealType: insight.caloriesBurned > 300 ? 'meal' : 'snack',
    timing: timingMessage,
    protein: baseProtein,
    carbs: baseCarbs,
    calories: baseCalories,
    suggestions,
    rationale,
    hydration
  }
}

export function getPostWorkoutMealSuggestions(
  todayExercises: ExerciseLog[],
  todayFoodLogs: FoodLog[]
): PostWorkoutRecommendation | null {
  if (todayExercises.length === 0) return null

  const latestExercise = todayExercises.sort((a, b) => b.timestamp - a.timestamp)[0]
  
  const hoursSinceExercise = (Date.now() - latestExercise.timestamp) / (1000 * 60 * 60)
  if (hoursSinceExercise > 3) {
    return null
  }

  const insight = analyzeWorkoutNutritionNeeds(latestExercise, todayFoodLogs)
  return generatePostWorkoutRecommendation(insight)
}

export function analyzeProteinDistribution(foodLogs: FoodLog[]): {
  breakfast: number
  lunch: number
  dinner: number
  snacks: number
  total: number
  isWellDistributed: boolean
  recommendation?: string
} {
  const distribution = {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
    snacks: 0,
    total: 0
  }

  foodLogs.forEach(log => {
    const protein = log.food.protein * log.quantity
    distribution.total += protein
    
    if (log.mealType === 'breakfast') distribution.breakfast += protein
    else if (log.mealType === 'lunch') distribution.lunch += protein
    else if (log.mealType === 'dinner') distribution.dinner += protein
    else distribution.snacks += protein
  })

  const meals = [distribution.breakfast, distribution.lunch, distribution.dinner]
  const minProtein = Math.min(...meals.filter(p => p > 0))
  const maxProtein = Math.max(...meals)
  
  const isWellDistributed = distribution.total === 0 || (maxProtein - minProtein) / distribution.total < 0.4

  let recommendation: string | undefined
  if (!isWellDistributed && distribution.total > 0) {
    if (distribution.breakfast < 15) {
      recommendation = 'Consider adding more protein to breakfast for better muscle protein synthesis throughout the day'
    } else if (distribution.lunch < 20) {
      recommendation = 'Boost lunch protein to maintain energy and support afternoon activities'
    } else if (distribution.dinner > distribution.total * 0.6) {
      recommendation = 'You\'re loading most protein at dinner - try distributing more evenly across meals'
    }
  }

  return {
    ...distribution,
    isWellDistributed,
    recommendation
  }
}
