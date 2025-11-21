export interface UserPhysicalProfile {
  weight?: number
  weightUnit?: 'kg' | 'lbs'
  height?: number
  heightUnit?: 'cm' | 'in'
  age?: number
  sex?: 'male' | 'female' | 'other'
}

export interface UserActivityProfile {
  activityLevel?: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extremely-active'
  fitnessGoal?: 'maintain' | 'lose-weight' | 'gain-muscle' | 'general-fitness'
}

export interface UserSleepProfile {
  goalSleepTime?: string
  goalWakeTime?: string
}

export interface UserLifestyleProfile {
  caffeineIntake?: number
  alcoholFrequency?: 'none' | 'occasional' | 'moderate' | 'frequent'
  smokingStatus?: 'none' | 'former' | 'current'
  stressLevel?: number
  medications?: string
}

export interface UserGoalsProfile {
  exerciseGoals?: {
    fitnessLevel?: 'beginner' | 'intermediate' | 'advanced'
    targetActivities?: string[]
    frequency?: number
  }
}

export interface CompleteUserProfile {
  physical?: UserPhysicalProfile
  activity?: UserActivityProfile
  sleep?: UserSleepProfile
  lifestyle?: UserLifestyleProfile
  goals?: UserGoalsProfile
  lastUpdated?: number
  setupComplete?: boolean
  stagesCompleted?: string[]
}

export interface ProfileSetupTrigger {
  stage: 'physical' | 'sleep' | 'exercise' | 'lifestyle' | 'goals'
  triggered: boolean
  triggeredAt?: number
  completed: boolean
}

const activityMultipliers: Record<string, number> = {
  'sedentary': 1.2,
  'lightly-active': 1.375,
  'moderately-active': 1.55,
  'very-active': 1.725,
  'extremely-active': 1.9
}

function convertToKg(weight: number, unit: 'kg' | 'lbs'): number {
  return unit === 'lbs' ? weight * 0.453592 : weight
}

function convertToCm(height: number, unit: 'cm' | 'in'): number {
  return unit === 'in' ? height * 2.54 : height
}

function calculateBMR(profile: UserPhysicalProfile): number | null {
  if (!profile.weight || !profile.height || !profile.age || !profile.sex) {
    return null
  }

  const weightKg = convertToKg(profile.weight, profile.weightUnit || 'lbs')
  const heightCm = convertToCm(profile.height, profile.heightUnit || 'in')

  if (profile.sex === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * profile.age + 5
  } else if (profile.sex === 'female') {
    return 10 * weightKg + 6.25 * heightCm - 5 * profile.age - 161
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * profile.age - 78
  }
}

export function calculateBMI(profile: UserPhysicalProfile): number | null {
  if (!profile.weight || !profile.height) return null
  
  const weightKg = convertToKg(profile.weight, profile.weightUnit || 'lbs')
  const heightM = convertToCm(profile.height, profile.heightUnit || 'in') / 100
  
  return weightKg / (heightM * heightM)
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

export function calculateTDEE(
  physical: UserPhysicalProfile,
  activity: UserActivityProfile
): number | null {
  const bmr = calculateBMR(physical)
  if (!bmr) return null

  const multiplier = activityMultipliers[activity.activityLevel || 'sedentary']
  let tdee = bmr * multiplier

  if (activity.fitnessGoal === 'lose-weight') {
    tdee *= 0.85
  } else if (activity.fitnessGoal === 'gain-muscle') {
    tdee *= 1.1
  }

  return tdee
}

export interface PersonalizedDailyValues {
  calories: number
  protein: number
  fiber: number
  vitaminC: number
  vitaminD: number
  vitaminA: number
  vitaminE: number
  vitaminK: number
  vitaminB12: number
  vitaminB6: number
  folate: number
  thiamin: number
  riboflavin: number
  niacin: number
  pantothenicAcid: number
  iron: number
  zinc: number
  calcium: number
  magnesium: number
  potassium: number
  selenium: number
  copper: number
  manganese: number
  sodium: number
}

export function calculatePersonalizedDVs(profile: CompleteUserProfile): PersonalizedDailyValues {
  const defaultDVs: PersonalizedDailyValues = {
    calories: 2000,
    protein: 50,
    fiber: 28,
    vitaminC: 90,
    vitaminD: 20,
    vitaminA: 900,
    vitaminE: 15,
    vitaminK: 120,
    vitaminB12: 2.4,
    vitaminB6: 1.7,
    folate: 400,
    thiamin: 1.2,
    riboflavin: 1.3,
    niacin: 16,
    pantothenicAcid: 5,
    iron: 18,
    zinc: 11,
    calcium: 1000,
    magnesium: 400,
    potassium: 3500,
    selenium: 55,
    copper: 0.9,
    manganese: 2.3,
    sodium: 2300
  }

  if (!profile.physical || !profile.activity) {
    return defaultDVs
  }

  const tdee = calculateTDEE(profile.physical, profile.activity)
  if (tdee) {
    defaultDVs.calories = Math.round(tdee)
  }

  if (profile.physical.weight && profile.physical.weightUnit) {
    const weightKg = convertToKg(profile.physical.weight, profile.physical.weightUnit)
    
    if (profile.activity.activityLevel === 'very-active' || profile.activity.activityLevel === 'extremely-active') {
      defaultDVs.protein = Math.round(weightKg * 1.6)
    } else if (profile.activity.activityLevel === 'moderately-active') {
      defaultDVs.protein = Math.round(weightKg * 1.2)
    } else {
      defaultDVs.protein = Math.round(weightKg * 0.8)
    }

    if (profile.physical.age && profile.physical.age >= 65) {
      defaultDVs.protein = Math.max(defaultDVs.protein, Math.round(weightKg * 1.0))
    }
  }

  defaultDVs.fiber = Math.round((defaultDVs.calories / 1000) * 14)

  if (profile.physical.sex === 'female') {
    defaultDVs.iron = 18
    if (profile.physical.age && profile.physical.age > 50) {
      defaultDVs.iron = 8
    }
  } else if (profile.physical.sex === 'male') {
    defaultDVs.iron = 8
  }

  if (profile.activity.activityLevel === 'very-active' || profile.activity.activityLevel === 'extremely-active') {
    defaultDVs.magnesium = 450
    defaultDVs.potassium = 4000
    defaultDVs.vitaminB6 = 2.0
    defaultDVs.thiamin = 1.5
    defaultDVs.riboflavin = 1.6
    defaultDVs.niacin = 20
  }

  if (profile.lifestyle?.stressLevel && profile.lifestyle.stressLevel > 6) {
    defaultDVs.vitaminC = 120
    defaultDVs.magnesium += 50
    defaultDVs.vitaminB6 += 0.3
    defaultDVs.pantothenicAcid = 7
  }

  return defaultDVs
}

export function shouldTriggerProfileSetup(
  profile: CompleteUserProfile,
  appState: {
    mode: 'nutriwell' | 'sleepsync' | 'lifeflow'
    loginCount: number
    daysActive: number
    pageClicks: number
  }
): ProfileSetupTrigger | null {
  const stages = profile.stagesCompleted || []

  if (!stages.includes('physical') && !stages.includes('sleep') && !stages.includes('exercise')) {
    return null
  }

  if (!stages.includes('sleep') && appState.mode === 'sleepsync') {
    return {
      stage: 'sleep',
      triggered: true,
      triggeredAt: Date.now(),
      completed: false
    }
  }

  if (!stages.includes('exercise') && appState.pageClicks >= 7) {
    return {
      stage: 'exercise',
      triggered: true,
      triggeredAt: Date.now(),
      completed: false
    }
  }

  if (!stages.includes('lifestyle') && (appState.loginCount >= 5 || appState.daysActive >= 7)) {
    return {
      stage: 'lifestyle',
      triggered: true,
      triggeredAt: Date.now(),
      completed: false
    }
  }

  if (!stages.includes('goals') && appState.pageClicks >= 7 && !stages.includes('exercise')) {
    return {
      stage: 'goals',
      triggered: true,
      triggeredAt: Date.now(),
      completed: false
    }
  }

  return null
}

export function shouldShowReEvaluationReminder(profile: CompleteUserProfile): boolean {
  if (!profile.lastUpdated) return false
  
  const daysSinceUpdate = (Date.now() - profile.lastUpdated) / (1000 * 60 * 60 * 24)
  return daysSinceUpdate >= 7
}
