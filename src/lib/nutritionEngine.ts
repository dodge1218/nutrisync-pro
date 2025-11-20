import type { Food } from '../data/foods'
import { getNutrientDV, type NutrientKey } from './dailyValues'

export interface FoodLog {
  id: string
  foodId: string
  food: Food
  quantity: number
  timestamp: string
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

export interface NutrientTotals {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  vitaminA: number
  vitaminC: number
  vitaminD: number
  vitaminE: number
  vitaminK: number
  vitaminB1: number
  vitaminB2: number
  vitaminB3: number
  vitaminB6: number
  vitaminB9: number
  vitaminB12: number
  calcium: number
  iron: number
  magnesium: number
  zinc: number
  selenium: number
  copper: number
  manganese: number
  sodium: number
  potassium: number
}

export interface NutrientGap {
  nutrient: NutrientKey
  current: number
  target: number
  percentOfDV: number
  status: 'low' | 'adequate' | 'high'
  severity: 'critical' | 'moderate' | 'minor' | 'good'
}

export interface TimingConflict {
  type: 'coffee-iron' | 'calcium-iron' | 'late-heavy-meal'
  description: string
  affectedMeals: string[]
  impact: 'high' | 'medium' | 'low'
  suggestion: string
}

export interface SynergySuggestion {
  type: 'add-enhancer' | 'remove-inhibitor' | 'timing-adjustment'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  warmOption?: string
}

export interface WellnessAudit {
  gbdi: number
  adrenalLoad: number
  mineralTrioSufficiency: number
  fermentedFoodCount: number
  plantDiversityCount: number
  ultraProcessedBurden: number
  gutStressorPresent: boolean
  warmFoodRatio: number
}

export interface StapleCompliance {
  liver: { target: string; actual: number; met: boolean }
  culturedDairy: { target: string; actual: number; met: boolean }
  pumpkinSeeds: { target: string; actual: number; met: boolean }
}

export interface AnalysisResult {
  totals: NutrientTotals
  gaps: NutrientGap[]
  timingConflicts: TimingConflict[]
  synergySuggestions: SynergySuggestion[]
  wellnessAudit: WellnessAudit
  stapleCompliance?: StapleCompliance
  gutSupportScore: number
  topFixes: string[]
}

export function calculateNutrientTotals(logs: FoodLog[]): NutrientTotals {
  const totals: NutrientTotals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    vitaminA: 0,
    vitaminC: 0,
    vitaminD: 0,
    vitaminE: 0,
    vitaminK: 0,
    vitaminB1: 0,
    vitaminB2: 0,
    vitaminB3: 0,
    vitaminB6: 0,
    vitaminB9: 0,
    vitaminB12: 0,
    calcium: 0,
    iron: 0,
    magnesium: 0,
    zinc: 0,
    selenium: 0,
    copper: 0,
    manganese: 0,
    sodium: 0,
    potassium: 0,
  }

  logs.forEach(log => {
    const multiplier = log.quantity
    const food = log.food

    totals.calories += food.calories * multiplier
    totals.protein += food.protein * multiplier
    totals.carbs += food.carbs * multiplier
    totals.fat += food.fat * multiplier
    totals.fiber += food.fiber * multiplier
    totals.vitaminA += food.vitaminA * multiplier
    totals.vitaminC += food.vitaminC * multiplier
    totals.vitaminD += food.vitaminD * multiplier
    totals.vitaminE += food.vitaminE * multiplier
    totals.vitaminK += food.vitaminK * multiplier
    totals.vitaminB1 += food.vitaminB1 * multiplier
    totals.vitaminB2 += food.vitaminB2 * multiplier
    totals.vitaminB3 += food.vitaminB3 * multiplier
    totals.vitaminB6 += food.vitaminB6 * multiplier
    totals.vitaminB9 += food.vitaminB9 * multiplier
    totals.vitaminB12 += food.vitaminB12 * multiplier
    totals.calcium += food.calcium * multiplier
    totals.iron += food.iron * multiplier
    totals.magnesium += food.magnesium * multiplier
    totals.zinc += food.zinc * multiplier
    totals.selenium += food.selenium * multiplier
    totals.copper += food.copper * multiplier
    totals.manganese += food.manganese * multiplier
    totals.sodium += food.sodium * multiplier
    totals.potassium += food.potassium * multiplier
  })

  return totals
}

export function detectNutrientGaps(totals: NutrientTotals): NutrientGap[] {
  const gaps: NutrientGap[] = []

  const nutrients: NutrientKey[] = [
    'protein', 'carbs', 'fat', 'fiber',
    'vitaminA', 'vitaminC', 'vitaminD', 'vitaminE', 'vitaminK',
    'vitaminB1', 'vitaminB2', 'vitaminB3', 'vitaminB6', 'vitaminB9', 'vitaminB12',
    'calcium', 'iron', 'magnesium', 'zinc', 'selenium', 'copper', 'manganese',
    'sodium', 'potassium'
  ]

  nutrients.forEach(nutrient => {
    const current = totals[nutrient]
    const target = getNutrientDV(nutrient)
    const percentOfDV = (current / target) * 100

    let status: 'low' | 'adequate' | 'high'
    let severity: 'critical' | 'moderate' | 'minor' | 'good'

    if (nutrient === 'sodium') {
      status = percentOfDV > 100 ? 'high' : 'adequate'
      severity = percentOfDV > 150 ? 'critical' : percentOfDV > 100 ? 'moderate' : 'good'
    } else {
      if (percentOfDV < 50) {
        status = 'low'
        severity = 'critical'
      } else if (percentOfDV < 80) {
        status = 'low'
        severity = 'moderate'
      } else if (percentOfDV < 100) {
        status = 'adequate'
        severity = 'minor'
      } else {
        status = 'adequate'
        severity = 'good'
      }
    }

    gaps.push({
      nutrient,
      current,
      target,
      percentOfDV,
      status,
      severity
    })
  })

  return gaps.sort((a, b) => {
    if (a.severity === 'critical' && b.severity !== 'critical') return -1
    if (a.severity !== 'critical' && b.severity === 'critical') return 1
    return a.percentOfDV - b.percentOfDV
  })
}

export function detectTimingConflicts(logs: FoodLog[]): TimingConflict[] {
  const conflicts: TimingConflict[] = []

  logs.forEach((log, index) => {
    const hasIron = log.food.iron > 2
    const hasHighCalcium = log.food.calcium > 200

    if (hasIron) {
      const nearbyLogs = logs.filter((otherLog, otherIndex) => {
        if (otherIndex === index) return false
        const timeDiff = Math.abs(
          new Date(log.timestamp).getTime() - new Date(otherLog.timestamp).getTime()
        )
        return timeDiff < 2 * 60 * 60 * 1000
      })

      nearbyLogs.forEach(nearbyLog => {
        if (nearbyLog.food.name.toLowerCase().includes('coffee')) {
          conflicts.push({
            type: 'coffee-iron',
            description: 'Coffee consumed near iron-rich meal reduces iron absorption by up to 60%',
            affectedMeals: [log.food.name, nearbyLog.food.name],
            impact: 'high',
            suggestion: 'Space coffee at least 2 hours from iron-rich meals. Try herbal tea instead, or enjoy coffee between meals.'
          })
        }

        if (nearbyLog.food.calcium > 200) {
          conflicts.push({
            type: 'calcium-iron',
            description: 'High calcium intake with iron reduces iron absorption',
            affectedMeals: [log.food.name, nearbyLog.food.name],
            impact: 'medium',
            suggestion: 'Separate calcium-rich foods (dairy, fortified foods) from iron-rich meals by 2-3 hours for optimal absorption.'
          })
        }
      })
    }
  })

  const lateHeavyMeals = logs.filter(log => {
    const hour = new Date(log.timestamp).getHours()
    return hour >= 20 && log.food.calories > 400
  })

  if (lateHeavyMeals.length > 0) {
    conflicts.push({
      type: 'late-heavy-meal',
      description: 'Heavy meals late in the evening can disrupt sleep quality and digestion',
      affectedMeals: lateHeavyMeals.map(log => log.food.name),
      impact: 'medium',
      suggestion: 'Try to finish heavier meals by 7-8pm. If eating late, choose lighter, warm options like soup or cooked vegetables.'
    })
  }

  return conflicts
}

export function generateSynergySuggestions(logs: FoodLog[], totals: NutrientTotals): SynergySuggestion[] {
  const suggestions: SynergySuggestion[] = []

  const hasIronRichFoods = logs.some(log => log.food.iron > 2)
  const hasVitaminC = totals.vitaminC > 25
  const hasNonHemeIron = logs.some(log => log.food.tags.includes('non-heme-iron'))

  if (hasNonHemeIron && !hasVitaminC) {
    suggestions.push({
      type: 'add-enhancer',
      title: 'Add Vitamin C to Boost Iron Absorption',
      description: 'You consumed plant-based iron but no vitamin C. Adding vitamin C can triple non-heme iron absorption.',
      priority: 'high',
      warmOption: 'Add cooked bell peppers, tomatoes, or broccoli to your iron-rich meal. Squeeze lemon juice on lentils or spinach.'
    })
  }

  if (hasIronRichFoods && logs.some(log => log.food.calcium > 200)) {
    suggestions.push({
      type: 'remove-inhibitor',
      title: 'Separate Calcium and Iron',
      description: 'High calcium foods can reduce iron absorption when eaten together.',
      priority: 'medium',
      warmOption: 'Enjoy your dairy or calcium supplements 2-3 hours apart from iron-rich meals.'
    })
  }

  const magnesiumGap = (totals.magnesium / getNutrientDV('magnesium')) * 100
  if (magnesiumGap < 60) {
    suggestions.push({
      type: 'add-enhancer',
      title: 'Increase Magnesium for Stress & Sleep',
      description: 'You\'re low on magnesium, which supports relaxation, sleep quality, and muscle recovery.',
      priority: 'high',
      warmOption: 'Add cooked spinach, pumpkin seeds (roasted), or warm dark chocolate to your meals.'
    })
  }

  const fiberGap = (totals.fiber / getNutrientDV('fiber')) * 100
  const hasFermentedFoods = logs.some(log => log.food.tags.includes('fermented'))

  if (fiberGap < 70 && !hasFermentedFoods) {
    suggestions.push({
      type: 'add-enhancer',
      title: 'Support Your Gut Microbiome',
      description: 'Low fiber and no fermented foods detected. Your gut bacteria need more fuel and reinforcements.',
      priority: 'high',
      warmOption: 'Add warm lentil soup, cooked oats, or roasted vegetables. Consider adding kefir or yogurt if you tolerate dairy.'
    })
  }

  const potassiumGap = (totals.potassium / getNutrientDV('potassium')) * 100
  if (potassiumGap < 60) {
    suggestions.push({
      type: 'add-enhancer',
      title: 'Boost Potassium for Electrolyte Balance',
      description: 'Low potassium can affect blood pressure, hydration, and muscle function.',
      priority: 'medium',
      warmOption: 'Add baked sweet potato, cooked spinach, or avocado to your meals.'
    })
  }

  return suggestions
}

export function calculateGutSupportScore(logs: FoodLog[], totals: NutrientTotals): number {
  let score = 0

  const fiberPercent = Math.min((totals.fiber / getNutrientDV('fiber')) * 100, 100)
  score += fiberPercent * 0.35

  const fermentedFoodCount = logs.filter(log => 
    log.food.tags.includes('fermented') || log.food.tags.includes('probiotic')
  ).length
  score += Math.min(fermentedFoodCount * 15, 25)

  const plantFoods = new Set(logs.filter(log => 
    log.food.category === 'vegetables' || 
    log.food.category === 'fruits' || 
    log.food.category === 'legumes' ||
    log.food.category === 'grains'
  ).map(log => log.food.id))
  const plantDiversity = plantFoods.size
  score += Math.min(plantDiversity * 3, 20)

  const ultraProcessedCount = logs.filter(log => 
    log.food.tags.includes('ultra-processed')
  ).length
  const ultraProcessedPenalty = Math.min(ultraProcessedCount * 5, 15)
  score -= ultraProcessedPenalty

  const polyphenolRichCount = logs.filter(log => 
    log.food.tags.includes('polyphenol-rich') || log.food.tags.includes('antioxidant')
  ).length
  score += Math.min(polyphenolRichCount * 5, 15)

  const gutStressors = logs.filter(log => log.food.gutStressors).length
  score -= gutStressors * 10

  return Math.max(0, Math.min(100, score))
}

export function performWellnessAudit(logs: FoodLog[], totals: NutrientTotals): WellnessAudit {
  const fermentedFoodCount = logs.filter(log => 
    log.food.tags.includes('fermented') || log.food.tags.includes('probiotic')
  ).length

  const plantFoods = new Set(logs.filter(log => 
    log.food.category === 'vegetables' || 
    log.food.category === 'fruits' || 
    log.food.category === 'legumes'
  ).map(log => log.food.id))
  const plantDiversityCount = plantFoods.size

  const ultraProcessedCount = logs.filter(log => 
    log.food.tags.includes('ultra-processed')
  ).length
  const totalFoods = logs.length
  const ultraProcessedBurden = totalFoods > 0 ? (ultraProcessedCount / totalFoods) * 100 : 0

  const gutStressorPresent = logs.some(log => log.food.gutStressors)

  const warmFoodCount = logs.filter(log => log.food.warmSuitable).length
  const warmFoodRatio = totalFoods > 0 ? (warmFoodCount / totalFoods) * 100 : 0

  const gbdi = calculateGBDI(logs, totals, fermentedFoodCount, plantDiversityCount, ultraProcessedBurden)

  const adrenalLoad = calculateAdrenalLoad(logs, totals)

  const magnesiumPercent = (totals.magnesium / getNutrientDV('magnesium')) * 100
  const potassiumPercent = (totals.potassium / getNutrientDV('potassium')) * 100
  const calciumPercent = (totals.calcium / getNutrientDV('calcium')) * 100
  const mineralTrioSufficiency = (magnesiumPercent + potassiumPercent + calciumPercent) / 3

  return {
    gbdi,
    adrenalLoad,
    mineralTrioSufficiency,
    fermentedFoodCount,
    plantDiversityCount,
    ultraProcessedBurden,
    gutStressorPresent,
    warmFoodRatio
  }
}

function calculateGBDI(
  logs: FoodLog[], 
  totals: NutrientTotals, 
  fermentedCount: number, 
  plantDiversity: number,
  ultraProcessedBurden: number
): number {
  let score = 50

  const fiberPercent = Math.min((totals.fiber / getNutrientDV('fiber')) * 100, 100)
  score += (fiberPercent - 50) * 0.3

  score += Math.min(fermentedCount * 8, 20)

  score += Math.min(plantDiversity * 2, 15)

  score -= ultraProcessedBurden * 0.5

  const gutStressorCount = logs.filter(log => log.food.gutStressors).length
  score -= gutStressorCount * 10

  const magnesiumPercent = (totals.magnesium / getNutrientDV('magnesium')) * 100
  if (magnesiumPercent < 60) score -= 5

  return Math.max(0, Math.min(100, score))
}

function calculateAdrenalLoad(logs: FoodLog[], totals: NutrientTotals): number {
  let load = 0

  const coffeeCount = logs.filter(log => 
    log.food.name.toLowerCase().includes('coffee')
  ).length
  load += coffeeCount * 15

  const sugarEstimate = totals.carbs * 0.4
  if (sugarEstimate > 50) load += (sugarEstimate - 50) * 0.2

  const ultraProcessedCount = logs.filter(log => 
    log.food.tags.includes('ultra-processed')
  ).length
  load += ultraProcessedCount * 10

  const magnesiumPercent = (totals.magnesium / getNutrientDV('magnesium')) * 100
  if (magnesiumPercent < 60) load += 10

  const vitaminCPercent = (totals.vitaminC / getNutrientDV('vitaminC')) * 100
  if (vitaminCPercent < 60) load += 5

  return Math.max(0, Math.min(100, load))
}

export function checkStapleCompliance(logs: FoodLog[], weeklyLogs?: FoodLog[]): StapleCompliance {
  const logsToCheck = weeklyLogs || logs

  const liverCount = logsToCheck.filter(log => 
    log.food.id === 'beef-liver' || log.food.name.toLowerCase().includes('liver')
  ).length
  const liverMet = liverCount >= 2

  const culturedDairyCount = logsToCheck.filter(log => 
    log.food.tags.includes('cultured-dairy')
  ).length
  const culturedDairyMet = culturedDairyCount >= 2

  const pumpkinSeedsCount = logs.filter(log => 
    log.food.id === 'pumpkin-seeds' || log.food.name.toLowerCase().includes('pumpkin seed')
  ).length
  const pumpkinSeedsMet = pumpkinSeedsCount >= 1

  return {
    liver: { target: '2-3x/week', actual: liverCount, met: liverMet },
    culturedDairy: { target: '2x/week', actual: culturedDairyCount, met: culturedDairyMet },
    pumpkinSeeds: { target: 'daily', actual: pumpkinSeedsCount, met: pumpkinSeedsMet }
  }
}

export function generateTopFixes(
  gaps: NutrientGap[], 
  synergySuggestions: SynergySuggestion[], 
  wellnessAudit: WellnessAudit
): string[] {
  const fixes: string[] = []

  const criticalGaps = gaps.filter(g => g.severity === 'critical').slice(0, 2)
  criticalGaps.forEach(gap => {
    if (gap.nutrient === 'fiber') {
      fixes.push('Add 1-2 servings of cooked vegetables or lentils to reach fiber target')
    } else if (gap.nutrient === 'magnesium') {
      fixes.push('Add pumpkin seeds (1 oz) or cooked spinach (1 cup) for magnesium boost')
    } else if (gap.nutrient === 'vitaminD') {
      fixes.push('Add fatty fish (salmon, sardines) or consider vitamin D3 supplement')
    } else if (gap.nutrient === 'iron') {
      fixes.push('Add iron-rich food (lentils, liver) with vitamin C source (bell pepper, broccoli)')
    } else if (gap.nutrient === 'potassium') {
      fixes.push('Add baked sweet potato or cooked spinach for potassium')
    }
  })

  if (wellnessAudit.fermentedFoodCount === 0) {
    fixes.push('Add 1 serving of fermented food (kefir, yogurt, sauerkraut) for gut health')
  }

  if (wellnessAudit.adrenalLoad > 60) {
    fixes.push('Reduce caffeine and add magnesium-rich foods to support stress response')
  }

  const topSynergySuggestion = synergySuggestions.find(s => s.priority === 'high')
  if (topSynergySuggestion && fixes.length < 3) {
    fixes.push(topSynergySuggestion.warmOption || topSynergySuggestion.description)
  }

  return fixes.slice(0, 3)
}

export function analyzeDailyIntake(logs: FoodLog[], userProfile?: { staples?: boolean }): AnalysisResult {
  const totals = calculateNutrientTotals(logs)
  const gaps = detectNutrientGaps(totals)
  const timingConflicts = detectTimingConflicts(logs)
  const synergySuggestions = generateSynergySuggestions(logs, totals)
  const wellnessAudit = performWellnessAudit(logs, totals)
  const gutSupportScore = calculateGutSupportScore(logs, totals)
  const topFixes = generateTopFixes(gaps, synergySuggestions, wellnessAudit)

  const result: AnalysisResult = {
    totals,
    gaps,
    timingConflicts,
    synergySuggestions,
    wellnessAudit,
    gutSupportScore,
    topFixes
  }

  if (userProfile?.staples) {
    result.stapleCompliance = checkStapleCompliance(logs)
  }

  return result
}
