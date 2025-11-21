import { calculateBasalMetabolicRate, calculateTotalDailyEnergyExpenditure, type ExerciseProfile } from './exerciseEngine'

export interface UserNutritionProfile extends ExerciseProfile {
  dietaryPattern?: 'omnivore' | 'vegetarian' | 'vegan'
  healthGoal?: 'maintenance' | 'weight-loss' | 'weight-gain' | 'muscle-gain' | 'athletic-performance'
  specialConditions?: ('pregnancy' | 'lactation' | 'elderly')[]
  lastProfileUpdate?: number
}

export interface PersonalizedDailyValues {
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
  
  hydrationMl: number
}

export function calculatePersonalizedDailyValues(profile: UserNutritionProfile): PersonalizedDailyValues {
  const weightKg = profile.weightUnit === 'kg' ? profile.weight : profile.weight * 0.453592
  const isMale = profile.sex === 'male'
  const isFemale = profile.sex === 'female'
  const isPregnant = profile.specialConditions?.includes('pregnancy')
  const isLactating = profile.specialConditions?.includes('lactation')
  const isElderly = profile.age >= 65 || profile.specialConditions?.includes('elderly')
  const isVegan = profile.dietaryPattern === 'vegan'
  const isVegetarian = profile.dietaryPattern === 'vegetarian' || isVegan
  
  const tdee = calculateTotalDailyEnergyExpenditure(profile)
  
  let calories = tdee
  if (profile.healthGoal === 'weight-loss') {
    calories = tdee - 500
  } else if (profile.healthGoal === 'weight-gain' || profile.healthGoal === 'muscle-gain') {
    calories = tdee + 300
  } else if (profile.healthGoal === 'athletic-performance') {
    calories = tdee + 200
  }
  
  let proteinGPerKg = 0.8
  if (profile.fitnessLevel === 'very-active' || profile.fitnessLevel === 'extremely-active') {
    proteinGPerKg = 1.6
  } else if (profile.fitnessLevel === 'moderately-active') {
    proteinGPerKg = 1.2
  } else if (profile.fitnessLevel === 'lightly-active') {
    proteinGPerKg = 1.0
  }
  
  if (profile.healthGoal === 'muscle-gain' || profile.healthGoal === 'athletic-performance') {
    proteinGPerKg = Math.max(proteinGPerKg, 1.8)
  }
  
  if (isElderly) {
    proteinGPerKg = Math.max(proteinGPerKg, 1.0)
  }
  
  if (isPregnant) {
    proteinGPerKg += 0.3
  }
  
  if (isLactating) {
    proteinGPerKg += 0.4
  }
  
  const protein = Math.round(proteinGPerKg * weightKg)
  
  const fiber = Math.round((calories / 1000) * 14)
  
  const proteinCalories = protein * 4
  const fatCalories = calories * 0.30
  const carbCalories = calories - proteinCalories - fatCalories
  
  const carbs = Math.round(carbCalories / 4)
  const fat = Math.round(fatCalories / 9)
  
  let vitaminA = isMale ? 900 : 700
  if (isPregnant) vitaminA = 770
  if (isLactating) vitaminA = 1300
  
  let vitaminC = isMale ? 90 : 75
  if (profile.fitnessLevel === 'very-active' || profile.fitnessLevel === 'extremely-active') {
    vitaminC += 25
  }
  if (isPregnant) vitaminC = 85
  if (isLactating) vitaminC = 120
  
  let vitaminD = 20
  if (isElderly) vitaminD = 20
  if (isPregnant || isLactating) vitaminD = 15
  
  let vitaminE = 15
  if (isPregnant) vitaminE = 15
  if (isLactating) vitaminE = 19
  
  let vitaminK = isMale ? 120 : 90
  
  let vitaminB1 = isMale ? 1.2 : 1.1
  if (isPregnant) vitaminB1 = 1.4
  if (isLactating) vitaminB1 = 1.4
  if (profile.fitnessLevel === 'very-active' || profile.fitnessLevel === 'extremely-active') {
    vitaminB1 += 0.3
  }
  
  let vitaminB2 = isMale ? 1.3 : 1.1
  if (isPregnant) vitaminB2 = 1.4
  if (isLactating) vitaminB2 = 1.6
  if (profile.fitnessLevel === 'very-active' || profile.fitnessLevel === 'extremely-active') {
    vitaminB2 += 0.3
  }
  
  let vitaminB3 = isMale ? 16 : 14
  if (isPregnant) vitaminB3 = 18
  if (isLactating) vitaminB3 = 17
  if (profile.fitnessLevel === 'very-active' || profile.fitnessLevel === 'extremely-active') {
    vitaminB3 += 3
  }
  
  let vitaminB6 = profile.age < 51 ? 1.3 : (isMale ? 1.7 : 1.5)
  if (isPregnant) vitaminB6 = 1.9
  if (isLactating) vitaminB6 = 2.0
  
  let vitaminB9 = 400
  if (isPregnant) vitaminB9 = 600
  if (isLactating) vitaminB9 = 500
  
  let vitaminB12 = 2.4
  if (isPregnant) vitaminB12 = 2.6
  if (isLactating) vitaminB12 = 2.8
  if (isVegan) vitaminB12 = 6.0
  if (isElderly) vitaminB12 = 2.8
  
  let calcium = profile.age < 51 ? 1000 : (isMale ? 1000 : 1200)
  if (profile.age < 19) calcium = 1300
  if (isPregnant || isLactating) calcium = 1000
  if (isElderly && isFemale) calcium = 1200
  
  let iron = 8
  if (isFemale && profile.age >= 19 && profile.age <= 50) {
    iron = 18
  }
  if (isPregnant) iron = 27
  if (isLactating) iron = 9
  if (isVegetarian) iron = Math.round(iron * 1.8)
  if (isElderly) iron = 8
  
  let magnesium = isMale ? 420 : 320
  if (profile.age >= 19 && profile.age <= 30) {
    magnesium = isMale ? 400 : 310
  }
  if (isPregnant) magnesium = 350
  if (isLactating) magnesium = 310
  if (profile.fitnessLevel === 'very-active' || profile.fitnessLevel === 'extremely-active') {
    magnesium += 50
  }
  
  let zinc = isMale ? 11 : 8
  if (isPregnant) zinc = 11
  if (isLactating) zinc = 12
  if (isVegetarian) zinc = Math.round(zinc * 1.5)
  
  let selenium = 55
  if (isPregnant) selenium = 60
  if (isLactating) selenium = 70
  
  let copper = 900
  if (isPregnant) copper = 1000
  if (isLactating) copper = 1300
  
  let manganese = isMale ? 2.3 : 1.8
  if (isPregnant) manganese = 2.0
  if (isLactating) manganese = 2.6
  
  const sodium = 2300
  
  let potassium = 3500
  if (isMale) potassium = 3400
  if (isFemale) potassium = 2600
  if (isPregnant) potassium = 2900
  if (isLactating) potassium = 2800
  if (profile.fitnessLevel === 'very-active' || profile.fitnessLevel === 'extremely-active') {
    potassium += 500
  }
  
  let hydrationMl = Math.round(weightKg * 33)
  if (profile.fitnessLevel === 'very-active' || profile.fitnessLevel === 'extremely-active') {
    hydrationMl += 500
  }
  if (isLactating) {
    hydrationMl += 700
  }
  
  return {
    calories,
    protein,
    carbs,
    fat,
    fiber,
    vitaminA,
    vitaminC,
    vitaminD,
    vitaminE,
    vitaminK,
    vitaminB1,
    vitaminB2,
    vitaminB3,
    vitaminB6,
    vitaminB9,
    vitaminB12,
    calcium,
    iron,
    magnesium,
    zinc,
    selenium,
    copper,
    manganese,
    sodium,
    potassium,
    hydrationMl
  }
}

export function shouldPromptProfileUpdate(lastUpdate: number | undefined): boolean {
  if (!lastUpdate) return true
  
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
  const timeSinceUpdate = Date.now() - lastUpdate
  
  return timeSinceUpdate >= sevenDaysMs
}

export function getDaysSinceLastUpdate(lastUpdate: number | undefined): number {
  if (!lastUpdate) return Infinity
  
  const daysSince = Math.floor((Date.now() - lastUpdate) / (24 * 60 * 60 * 1000))
  return daysSince
}
