import type { FoodLog, NutrientTotals } from './nutritionEngine'
import type { StressLog } from '../components/StressTracker'
import { getNutrientDV } from './dailyValues'

export interface AdrenalLoadResult {
  score: number
  category: 'low' | 'moderate' | 'high'
  categoryLabel: string
  dietaryLoad: number
  stressLoad: number
  recommendations: string[]
  supportiveNutrients: {
    nutrient: string
    current: number
    target: number
    status: 'low' | 'adequate' | 'high'
  }[]
}

export function calculateEnhancedAdrenalLoad(
  logs: FoodLog[],
  totals: NutrientTotals,
  stressLog?: StressLog
): AdrenalLoadResult {
  let dietaryLoad = calculateDietaryLoad(logs, totals)
  let stressLoad = stressLog ? calculateStressLoad(stressLog) : 50

  const combinedScore = (dietaryLoad * 0.4) + (stressLoad * 0.6)

  const category = 
    combinedScore <= 33 ? 'low' :
    combinedScore <= 66 ? 'moderate' : 'high'

  const categoryLabel = 
    combinedScore <= 33 ? 'Low Stress - Maintenance Mode' :
    combinedScore <= 66 ? 'Moderate Stress - Active Support' : 
    'High Stress - Urgent Intervention'

  const supportiveNutrients = analyzeSupportiveNutrients(totals)
  const recommendations = generateAdrenalRecommendations(
    category,
    logs,
    totals,
    stressLog,
    supportiveNutrients
  )

  return {
    score: Math.round(combinedScore),
    category,
    categoryLabel,
    dietaryLoad: Math.round(dietaryLoad),
    stressLoad: Math.round(stressLoad),
    recommendations,
    supportiveNutrients
  }
}

function calculateDietaryLoad(logs: FoodLog[], totals: NutrientTotals): number {
  let load = 0

  const coffeeCount = logs.filter(log => 
    log.food.name.toLowerCase().includes('coffee') || 
    log.food.name.toLowerCase().includes('espresso')
  ).length
  load += Math.min(coffeeCount * 12, 30)

  const teaCount = logs.filter(log => 
    log.food.name.toLowerCase().includes('tea') && 
    !log.food.name.toLowerCase().includes('herbal')
  ).length
  load += Math.min(teaCount * 6, 15)

  const refinedCarbs = logs.filter(log => 
    log.food.tags.includes('refined-carbs') || 
    log.food.tags.includes('ultra-processed')
  ).length
  load += Math.min(refinedCarbs * 8, 25)

  const alcoholCount = logs.filter(log => 
    log.food.tags.includes('alcohol')
  ).length
  load += Math.min(alcoholCount * 15, 30)

  const magnesiumPercent = (totals.magnesium / getNutrientDV('magnesium')) * 100
  if (magnesiumPercent < 50) load += 15
  else if (magnesiumPercent < 70) load += 8

  const vitaminCPercent = (totals.vitaminC / getNutrientDV('vitaminC')) * 100
  if (vitaminCPercent < 50) load += 10
  else if (vitaminCPercent < 70) load += 5

  const bVitaminAvg = (
    (totals.vitaminB1 / getNutrientDV('vitaminB1')) +
    (totals.vitaminB6 / getNutrientDV('vitaminB6')) +
    (totals.vitaminB12 / getNutrientDV('vitaminB12'))
  ) / 3 * 100
  
  if (bVitaminAvg < 50) load += 12
  else if (bVitaminAvg < 70) load += 6

  const proteinPercent = (totals.protein / getNutrientDV('protein')) * 100
  if (proteinPercent < 70) load += 8

  return Math.max(0, Math.min(100, load))
}

function calculateStressLoad(stressLog: StressLog): number {
  let load = 0

  load += stressLog.stressLevel * 10

  const sleepScore = 10 - stressLog.sleepQuality
  load += sleepScore * 4

  const energyScore = 10 - stressLog.energyLevel
  load += energyScore * 3

  load += stressLog.physicalSymptoms.length * 3
  load += stressLog.mentalSymptoms.length * 3

  return Math.max(0, Math.min(100, load))
}

function analyzeSupportiveNutrients(totals: NutrientTotals) {
  const nutrients = [
    {
      nutrient: 'Magnesium',
      current: Math.round(totals.magnesium),
      target: getNutrientDV('magnesium'),
      status: getStatus(totals.magnesium, getNutrientDV('magnesium'))
    },
    {
      nutrient: 'Vitamin B5 (Pantothenic Acid)',
      current: Math.round(totals.vitaminB6),
      target: getNutrientDV('vitaminB6'),
      status: getStatus(totals.vitaminB6, getNutrientDV('vitaminB6'))
    },
    {
      nutrient: 'Vitamin B6',
      current: Math.round(totals.vitaminB6),
      target: getNutrientDV('vitaminB6'),
      status: getStatus(totals.vitaminB6, getNutrientDV('vitaminB6'))
    },
    {
      nutrient: 'Vitamin B12',
      current: Math.round(totals.vitaminB12 * 10) / 10,
      target: getNutrientDV('vitaminB12'),
      status: getStatus(totals.vitaminB12, getNutrientDV('vitaminB12'))
    },
    {
      nutrient: 'Vitamin C',
      current: Math.round(totals.vitaminC),
      target: getNutrientDV('vitaminC'),
      status: getStatus(totals.vitaminC, getNutrientDV('vitaminC'))
    },
    {
      nutrient: 'Zinc',
      current: Math.round(totals.zinc * 10) / 10,
      target: getNutrientDV('zinc'),
      status: getStatus(totals.zinc, getNutrientDV('zinc'))
    }
  ]

  return nutrients
}

function getStatus(current: number, target: number): 'low' | 'adequate' | 'high' {
  const percent = (current / target) * 100
  if (percent < 70) return 'low'
  if (percent > 150) return 'high'
  return 'adequate'
}

function generateAdrenalRecommendations(
  category: 'low' | 'moderate' | 'high',
  logs: FoodLog[],
  totals: NutrientTotals,
  stressLog: StressLog | undefined,
  supportiveNutrients: any[]
): string[] {
  const recommendations: string[] = []

  const coffeeCount = logs.filter(log => 
    log.food.name.toLowerCase().includes('coffee')
  ).length

  if (category === 'high' && coffeeCount > 1) {
    recommendations.push('URGENT: Reduce caffeine intake. Try switching afternoon coffee to herbal tea or decaf.')
  } else if (category === 'moderate' && coffeeCount > 2) {
    recommendations.push('Consider reducing coffee to 1-2 cups daily, especially after noon.')
  }

  if (stressLog?.sleepQuality && stressLog.sleepQuality < 6) {
    recommendations.push('Poor sleep detected. Prioritize magnesium-rich foods (spinach, pumpkin seeds, dark chocolate) in the evening.')
  }

  const magnesiumLow = supportiveNutrients.find(n => n.nutrient === 'Magnesium')?.status === 'low'
  if (magnesiumLow) {
    recommendations.push('Magnesium deficiency contributes to stress. Add almonds, avocados, black beans, or consider magnesium glycinate supplement.')
  }

  const bVitaminsLow = supportiveNutrients.filter(n => 
    n.nutrient.includes('Vitamin B') && n.status === 'low'
  ).length > 0
  
  if (bVitaminsLow && category !== 'low') {
    recommendations.push('B-vitamins are critical for stress response. Add eggs, salmon, nutritional yeast, or liver to boost B-complex intake.')
  }

  const vitaminCLow = supportiveNutrients.find(n => n.nutrient === 'Vitamin C')?.status === 'low'
  if (vitaminCLow) {
    recommendations.push('Vitamin C supports adrenal function during stress. Add bell peppers, citrus fruits, broccoli, or strawberries.')
  }

  if (stressLog?.energyLevel && stressLog.energyLevel < 5 && totals.protein < getNutrientDV('protein') * 0.7) {
    recommendations.push('Low energy + low protein = fatigue cycle. Prioritize protein at breakfast (eggs, Greek yogurt, or protein shake).')
  }

  const refinedCarbs = logs.filter(log => 
    log.food.tags.includes('refined-carbs') || log.food.tags.includes('ultra-processed')
  ).length
  
  if (refinedCarbs > 2 && category !== 'low') {
    recommendations.push('Refined carbs spike cortisol. Replace with complex carbs like oats, quinoa, sweet potatoes.')
  }

  if (stressLog?.physicalSymptoms?.includes('Digestive issues')) {
    recommendations.push('Stress + digestive issues: Try fermented foods (kefir, sauerkraut), warm meals, and avoid raw/cold foods temporarily.')
  }

  if (stressLog?.mentalSymptoms?.includes('Anxiety') || stressLog?.mentalSymptoms?.includes('Racing thoughts')) {
    recommendations.push('Anxiety symptoms present. Consider magnesium, omega-3s (fatty fish), and chamomile tea. Avoid excess caffeine.')
  }

  if (category === 'high' && recommendations.length === 0) {
    recommendations.push('High stress detected. Focus on whole foods, adequate protein, and minimize stimulants. Consider adaptogenic herbs like ashwagandha.')
  }

  if (recommendations.length === 0) {
    recommendations.push('Your stress levels appear manageable. Continue with balanced nutrition and stress management practices.')
  }

  return recommendations.slice(0, 5)
}
