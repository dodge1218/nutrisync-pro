import type { Food } from '../data/foods'
import { getNutrientDV, type NutrientKey } from './dailyValues'
import type { ExerciseLog } from './exerciseEngine'

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

export interface PostWorkoutSuggestion {
  type: 'protein' | 'carbs' | 'hydration' | 'electrolytes'
  title: string
  description: string
  priority: 'high' | 'medium'
  suggestion: string
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
  postWorkoutSuggestions: PostWorkoutSuggestion[]
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
      warmOption: 'Try a Bell Pepper Stir Fry, Tomato Soup, or squeeze lemon on your meal.'
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
      warmOption: 'Try a Warm Spinach Salad, Pumpkin Seed Granola, or Dark Chocolate.'
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
      warmOption: 'Try Lentil Soup, Oatmeal with Berries, or a Kefir Smoothie.'
    })
  }

  const potassiumGap = (totals.potassium / getNutrientDV('potassium')) * 100
  if (potassiumGap < 60) {
    suggestions.push({
      type: 'add-enhancer',
      title: 'Boost Potassium for Electrolyte Balance',
      description: 'Low potassium can affect blood pressure, hydration, and muscle function.',
      priority: 'medium',
      warmOption: 'Try Baked Sweet Potato Fries, Avocado Toast, or a Spinach Omelet.'
    })
  }

  const vitaminDGap = (totals.vitaminD / getNutrientDV('vitaminD')) * 100
  const hasVitaminKFoods = logs.some(log => log.food.vitaminK > 20)
  if (vitaminDGap < 50 && !hasVitaminKFoods) {
    suggestions.push({
      type: 'add-enhancer',
      title: 'Vitamin D + K2: The Bone Health Duo',
      description: 'Low vitamin D detected, and no vitamin K foods. These work together to direct calcium to bones, not arteries.',
      priority: 'high',
      warmOption: 'Try Grilled Salmon with Sautéed Kale or a Sardine Salad.'
    })
  }

  const hasFatSolubleVitamins = totals.vitaminA > 100 || totals.vitaminD > 2 || totals.vitaminE > 2
  const hasHealthyFats = totals.fat > 10
  if (hasFatSolubleVitamins && !hasHealthyFats) {
    suggestions.push({
      type: 'add-enhancer',
      title: 'Add Healthy Fats for Vitamin Absorption',
      description: 'You have fat-soluble vitamins (A, D, E, K) but low dietary fat. These vitamins need fat to be absorbed.',
      priority: 'high',
      warmOption: 'Add Olive Oil Dressing, Avocado Slices, or a handful of Nuts to your meal.'
    })
  }

  const zincGap = (totals.zinc / getNutrientDV('zinc')) * 100
  if (zincGap < 60) {
    suggestions.push({
      type: 'add-enhancer',
      title: 'Boost Zinc for Immune Function',
      description: 'Zinc is critical for immune health, wound healing, and hormone production. You\'re running low.',
      priority: 'medium',
      warmOption: 'Try a Beef Burger, Roasted Chickpeas, or Pumpkin Seed Snack.'
    })
  }

  const proteinGap = (totals.protein / getNutrientDV('protein')) * 100
  if (proteinGap < 70) {
    suggestions.push({
      type: 'add-enhancer',
      title: 'Increase Protein for Muscle & Satiety',
      description: 'Protein intake is below optimal levels. Adequate protein supports muscle mass, recovery, and keeps you full.',
      priority: 'medium',
      warmOption: 'Try Grilled Chicken Breast, a Greek Yogurt Bowl, or Lentil Stew.'
    })
  }

  const calciumGap = (totals.calcium / getNutrientDV('calcium')) * 100
  const hasMagnesium = totals.magnesium > 150
  if (calciumGap < 60 && hasMagnesium) {
    suggestions.push({
      type: 'add-enhancer',
      title: 'Balance Calcium with Your Magnesium',
      description: 'You have decent magnesium but low calcium. These minerals work together for bone and muscle health.',
      priority: 'medium',
      warmOption: 'Try a Kefir Smoothie, Sardines on Toast, or Fortified Plant Milk.'
    })
  }

  const b12Gap = (totals.vitaminB12 / getNutrientDV('vitaminB12')) * 100
  if (b12Gap < 50) {
    suggestions.push({
      type: 'add-enhancer',
      title: 'Critical B12 Deficiency Detected',
      description: 'Vitamin B12 is essential for nerve function, DNA synthesis, and energy. Deficiency causes fatigue and neurological issues.',
      priority: 'high',
      warmOption: 'Try Beef Liver Pate, Grilled Salmon, or Eggs Benedict.'
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
  wellnessAudit: WellnessAudit,
  totals: NutrientTotals,
  gutSupportScore: number,
  dietaryPattern: 'omnivore' | 'vegetarian' | 'vegan' = 'omnivore'
): string[] {
  const fixes: Array<{ priority: number; text: string }> = []

  if (gutSupportScore < 60) {
    fixes.push({
      priority: 12,
      text: "Gut Score Low - Add a 'Super Gut Food' like Kimchi, Kefir, or Raspberries to boost your score!"
    })
  }

  const criticalGaps = gaps.filter(g => g.severity === 'critical')
  const moderateGaps = gaps.filter(g => g.severity === 'moderate')
  
  const isVegan = dietaryPattern === 'vegan'
  const isVegetarian = dietaryPattern === 'vegetarian' || isVegan

  criticalGaps.forEach(gap => {
    let priority = 10
    let text = ''

    if (gap.nutrient === 'fiber' && gap.percentOfDV < 50) {
      text = `Boost fiber to ${Math.round(getNutrientDV('fiber') * 0.8)}g - Try Lentil Soup, a Quinoa Bowl, or Oatmeal with Berries`
      priority = 10
    } else if (gap.nutrient === 'magnesium' && gap.percentOfDV < 50) {
      const needed = Math.round(getNutrientDV('magnesium') * 0.8 - gap.current)
      text = `Need ${needed}mg magnesium - Try a Spinach Salad with Pumpkin Seeds or Dark Chocolate Dessert`
      priority = 9
    } else if (gap.nutrient === 'vitaminD' && gap.percentOfDV < 50) {
      if (isVegan) {
        text = `Vitamin D critically low - Consider D3 supplement (2000 IU) or fortified plant milk smoothie`
      } else {
        text = `Vitamin D critically low - Try Grilled Salmon, Sardines on Toast, or a D3 supplement`
      }
      priority = 8
    } else if (gap.nutrient === 'iron' && gap.percentOfDV < 50) {
      const hasVitaminC = totals.vitaminC > 30
      if (hasVitaminC) {
        if (isVegan) {
           text = `Iron at ${Math.round(gap.percentOfDV)}% - Try Lentil Stew, Tofu Stir Fry, or Spinach Salad`
        } else {
           text = `Iron at ${Math.round(gap.percentOfDV)}% - Try Beef Bolognese, Lentil Soup, or a Steak Salad`
        }
      } else {
        if (isVegan) {
          text = `Iron critically low AND no vitamin C - Try Lentil Soup with Bell Peppers or Spinach Salad with Lemon Dressing`
        } else {
          text = `Iron critically low AND no vitamin C - Try Beef Stir Fry with Broccoli or Lentils with Peppers`
        }
        priority = 11
      }
    } else if (gap.nutrient === 'potassium' && gap.percentOfDV < 50) {
      const needed = Math.round(getNutrientDV('potassium') * 0.8 - gap.current)
      text = `Need ${needed}mg potassium - Try a Sweet Potato Side, Avocado Toast, or a Banana Smoothie`
      priority = 7
    } else if (gap.nutrient === 'vitaminC' && gap.percentOfDV < 50) {
      text = `Vitamin C low (${Math.round(gap.percentOfDV)}%) - Try a Fruit Salad, Roasted Broccoli, or Bell Pepper Snacks`
      priority = 6
    } else if (gap.nutrient === 'vitaminB12' && gap.percentOfDV < 50) {
      if (isVegan) {
        text = `B12 critically low - Add fortified nutritional yeast to pasta or take a B12 supplement`
      } else {
        text = `B12 critically low - Try Grilled Salmon, Scrambled Eggs, or Beef Liver Pate`
      }
      priority = 8
    } else if (gap.nutrient === 'calcium' && gap.percentOfDV < 50) {
      if (isVegan) {
         text = `Calcium low - Try Tofu Stir Fry, Fortified Cereal, or a Green Smoothie`
      } else {
         text = `Calcium low - Try a Greek Yogurt Parfait, Cheese Omelet, or Sardines`
      }
      priority = 7
    } else if (gap.nutrient === 'zinc' && gap.percentOfDV < 50) {
      if (isVegan) {
        text = `Zinc deficient (${Math.round(gap.percentOfDV)}%) - Try Roasted Chickpeas, Pumpkin Seed Granola, or Cashew Stir Fry`
      } else {
        text = `Zinc deficient (${Math.round(gap.percentOfDV)}%) - Try a Beef Burger, Oysters, or Roast Chicken`
      }
      priority = 7
    }

    if (text) {
      fixes.push({ priority, text })
    }
  })

  if (wellnessAudit.fermentedFoodCount === 0 && wellnessAudit.gbdi < 60) {
    const suggestion = isVegan 
      ? 'sauerkraut (½ cup, billions CFU) or kimchi' 
      : 'kefir (1 cup, 10+ probiotic strains) or sauerkraut (½ cup, billions CFU)'
    
    fixes.push({ 
      priority: 9, 
      text: `Gut health critical - Add ${suggestion}` 
    })
  }

  if (wellnessAudit.adrenalLoad > 70) {
    fixes.push({ 
      priority: 8, 
      text: `Adrenal load high (${Math.round(wellnessAudit.adrenalLoad)}/100) - Cut caffeine, add magnesium, increase vitamin C` 
    })
  }

  if (wellnessAudit.plantDiversityCount < 10 && moderateGaps.length > 3) {
    fixes.push({
      priority: 7,
      text: `Low plant diversity (${wellnessAudit.plantDiversityCount} types) - Aim for 30+ different plants/week for microbiome health`
    })
  }

  const highPrioritySynergy = synergySuggestions.find(s => s.priority === 'high')
  if (highPrioritySynergy && fixes.length < 5) {
    fixes.push({
      priority: 8,
      text: highPrioritySynergy.warmOption || highPrioritySynergy.description
    })
  }

  const proteinGap = gaps.find(g => g.nutrient === 'protein')
  if (proteinGap && proteinGap.percentOfDV < 70) {
    const needed = Math.round(getNutrientDV('protein') * 0.9 - proteinGap.current)
    const suggestion = isVegan
      ? `Lentil Soup, Tofu Scramble, or Protein Smoothie`
      : `Chicken Breast, Greek Yogurt Parfait, or Grilled Salmon`
      
    fixes.push({
      priority: 6,
      text: `Protein at ${Math.round(proteinGap.percentOfDV)}% - Add ${needed}g more (Try ${suggestion})`
    })
  }

  return fixes
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3)
    .map(f => f.text)
}

export function detectPostWorkoutNeeds(logs: FoodLog[], exerciseLogs: ExerciseLog[]): PostWorkoutSuggestion[] {
  const suggestions: PostWorkoutSuggestion[] = []
  const now = Date.now()
  const twoHoursAgo = now - (2 * 60 * 60 * 1000)

  // Find recent intense workouts (last 2 hours)
  const recentWorkouts = exerciseLogs.filter(log => 
    log.timestamp >= twoHoursAgo && 
    (log.intensity === 'high' || log.duration >= 45)
  )

  if (recentWorkouts.length === 0) return suggestions

  // Check if a meal was logged AFTER the workout
  const lastWorkoutTime = Math.max(...recentWorkouts.map(w => w.timestamp))
  const mealsAfterWorkout = logs.filter(log => {
    const logTime = new Date(log.timestamp).getTime()
    return logTime > lastWorkoutTime
  })

  const hasMealAfter = mealsAfterWorkout.length > 0
  
  // Calculate totals for post-workout meal if it exists
  let postWorkoutProtein = 0
  let postWorkoutCarbs = 0
  
  if (hasMealAfter) {
    const totals = calculateNutrientTotals(mealsAfterWorkout)
    postWorkoutProtein = totals.protein
    postWorkoutCarbs = totals.carbs
  }

  // Generate suggestions
  const workoutType = recentWorkouts[0].activityName.toLowerCase()
  const isStrength = workoutType.includes('lift') || workoutType.includes('strength') || workoutType.includes('bodyweight')
  const isCardio = !isStrength

  if (!hasMealAfter) {
    if (isStrength) {
      suggestions.push({
        type: 'protein',
        title: 'Post-Workout Protein Needed',
        description: 'You finished a strength workout but haven\'t logged a recovery meal yet.',
        priority: 'high',
        suggestion: 'Eat 20-30g of protein within 2 hours to maximize muscle repair. Try a protein shake, eggs, or chicken.'
      })
    } else {
      suggestions.push({
        type: 'carbs',
        title: 'Refuel Your Glycogen',
        description: 'You finished a cardio session. Your body needs carbs to replenish energy stores.',
        priority: 'medium',
        suggestion: 'Eat a balanced meal with carbs and protein. Oatmeal with fruit or a turkey sandwich are great options.'
      })
    }
    
    suggestions.push({
      type: 'hydration',
      title: 'Rehydrate',
      description: 'Don\'t forget to replace fluids lost during exercise.',
      priority: 'high',
      suggestion: 'Drink 16-24oz of water. If you sweat heavily, consider electrolytes.'
    })
  } else {
    // Analyze the post-workout meal
    if (isStrength && postWorkoutProtein < 20) {
      suggestions.push({
        type: 'protein',
        title: 'Increase Post-Workout Protein',
        description: `Your post-workout meal only had ${Math.round(postWorkoutProtein)}g protein. Aim for 20-30g.`,
        priority: 'medium',
        suggestion: 'Add a side of Greek yogurt, a hard-boiled egg, or a scoop of protein powder.'
      })
    }
    
    if (isCardio && postWorkoutCarbs < 30) {
       suggestions.push({
        type: 'carbs',
        title: 'Add Carbs for Recovery',
        description: `Your post-workout meal was low in carbs (${Math.round(postWorkoutCarbs)}g). Carbs help restore energy.`,
        priority: 'medium',
        suggestion: 'Add a banana, rice, or sweet potato to your meal.'
      })
    }
  }

  return suggestions
}

export function analyzeDailyIntake(
  logs: FoodLog[], 
  userProfile?: { staples?: boolean; dietaryPattern?: 'omnivore' | 'vegetarian' | 'vegan' },
  exerciseLogs?: ExerciseLog[]
): AnalysisResult {
  const totals = calculateNutrientTotals(logs)
  const gaps = detectNutrientGaps(totals)
  const timingConflicts = detectTimingConflicts(logs)
  const synergySuggestions = generateSynergySuggestions(logs, totals)
  const wellnessAudit = performWellnessAudit(logs, totals)
  const gutSupportScore = calculateGutSupportScore(logs, totals)
  const topFixes = generateTopFixes(gaps, synergySuggestions, wellnessAudit, totals, gutSupportScore, userProfile?.dietaryPattern)
  const postWorkoutSuggestions = exerciseLogs ? detectPostWorkoutNeeds(logs, exerciseLogs) : []

  const result: AnalysisResult = {
    totals,
    gaps,
    timingConflicts,
    synergySuggestions,
    postWorkoutSuggestions,
    wellnessAudit,
    gutSupportScore,
    topFixes
  }

  if (userProfile?.staples) {
    result.stapleCompliance = checkStapleCompliance(logs)
  }

  return result
}

export function calculateIndividualFoodGutScore(food: Food): number {
  // If a manual score is assigned, use it
  if (food.gutScore !== undefined) {
    return food.gutScore
  }

  let score = 5 // Start neutral

  // 1. Nutrient-based adjustments
  // Fiber is the #1 fuel for the microbiome
  if (food.fiber > 0) score += Math.min(food.fiber / 2, 3) // +1 per 2g, max +3
  
  // Sugar feeds bad bacteria/yeast
  if (food.carbs > 10 && food.fiber < 1) {
    // Estimate sugar if not explicit (high carb low fiber usually means sugar/starch)
    // We don't have a sugar field, so we use tags or inference
    if (food.tags.includes('sugar') || food.tags.includes('sweetener')) {
      score -= 2
    }
  }

  // Protein is neutral-to-good, but high saturated fat can be inflammatory (handled by tags)
  if (food.protein > 15) score += 0.5

  // 2. Tag-based adjustments
  const tags = food.tags || []

  // Positives
  if (tags.includes('fermented') || tags.includes('probiotic')) score += 4
  if (tags.includes('prebiotic')) score += 2
  if (tags.includes('polyphenol-rich') || tags.includes('antioxidant')) score += 1
  if (tags.includes('omega-3') || tags.includes('healthy-fat')) score += 1
  if (tags.includes('whole-grain')) score += 1
  if (tags.includes('fruit') || tags.includes('vegetable')) score += 1
  if (tags.includes('bone-broth') || tags.includes('collagen')) score += 2

  // Negatives
  if (tags.includes('ultra-processed')) score -= 4
  else if (tags.includes('processed')) score -= 1.5

  if (tags.includes('fried')) score -= 2
  if (tags.includes('alcohol')) score -= 4
  if (tags.includes('artificial-sweetener')) score -= 2
  if (tags.includes('high-sodium')) score -= 0.5
  if (tags.includes('inflammatory')) score -= 2

  // 3. Explicit Gut Stressor Flag
  if (food.gutStressors) {
    score -= 3
  }

  // Clamp score between 0 and 10
  return Math.max(0, Math.min(10, Math.round(score * 10) / 10))
}
