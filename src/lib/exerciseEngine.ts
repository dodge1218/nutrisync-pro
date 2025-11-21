export interface ExerciseProfile {
  weight: number
  weightUnit: 'kg' | 'lbs'
  height: number
  heightUnit: 'cm' | 'inches'
  age: number
  sex: 'male' | 'female' | 'other'
  fitnessLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extremely-active'
  goals: string[]
}

export interface ExerciseActivity {
  id: string
  name: string
  type: 'cardio' | 'strength' | 'sports' | 'flexibility' | 'other'
  category: string
  metValue: number
  intensity: 'low' | 'moderate' | 'high'
  customIntensityDescription?: string
}

export interface ExerciseLog {
  id: string
  activityId: string
  activityName: string
  date: string
  duration: number
  caloriesBurned: number
  intensity: 'low' | 'moderate' | 'high'
  notes?: string
  timestamp: number
}

export function calculateBMI(weight: number, weightUnit: 'kg' | 'lbs', height: number, heightUnit: 'cm' | 'inches'): number {
  let weightKg = weightUnit === 'kg' ? weight : weight * 0.453592
  let heightM = heightUnit === 'cm' ? height / 100 : (height * 2.54) / 100
  
  return weightKg / (heightM * heightM)
}

export function classifyBMI(bmi: number): { classification: string; description: string; color: string } {
  if (bmi < 18.5) {
    return {
      classification: 'Underweight',
      description: 'Below healthy weight range',
      color: 'text-yellow-600'
    }
  } else if (bmi < 25) {
    return {
      classification: 'Normal',
      description: 'Healthy weight range',
      color: 'text-primary'
    }
  } else if (bmi < 30) {
    return {
      classification: 'Overweight',
      description: 'Above healthy weight range',
      color: 'text-orange-600'
    }
  } else {
    return {
      classification: 'Obese',
      description: 'Significantly above healthy weight range',
      color: 'text-destructive'
    }
  }
}

export function calculateCaloriesBurned(
  metValue: number,
  weight: number,
  weightUnit: 'kg' | 'lbs',
  durationMinutes: number
): number {
  const weightKg = weightUnit === 'kg' ? weight : weight * 0.453592
  const durationHours = durationMinutes / 60
  
  return Math.round(metValue * weightKg * durationHours)
}

export const EXERCISE_ACTIVITIES: ExerciseActivity[] = [
  {
    id: 'walk-casual',
    name: 'Walking (Casual, 2-3 mph)',
    type: 'cardio',
    category: 'Walking',
    metValue: 3.0,
    intensity: 'low'
  },
  {
    id: 'walk-brisk',
    name: 'Walking (Brisk, 3.5 mph)',
    type: 'cardio',
    category: 'Walking',
    metValue: 4.3,
    intensity: 'moderate'
  },
  {
    id: 'walk-power',
    name: 'Walking (Power, 4.5 mph)',
    type: 'cardio',
    category: 'Walking',
    metValue: 5.0,
    intensity: 'high'
  },
  {
    id: 'run-jog',
    name: 'Running (Jogging, 5 mph)',
    type: 'cardio',
    category: 'Running',
    metValue: 8.3,
    intensity: 'moderate'
  },
  {
    id: 'run-moderate',
    name: 'Running (Moderate, 6 mph)',
    type: 'cardio',
    category: 'Running',
    metValue: 9.8,
    intensity: 'moderate'
  },
  {
    id: 'run-fast',
    name: 'Running (Fast, 8 mph)',
    type: 'cardio',
    category: 'Running',
    metValue: 11.8,
    intensity: 'high'
  },
  {
    id: 'cycle-leisure',
    name: 'Cycling (Leisure, 10-12 mph)',
    type: 'cardio',
    category: 'Cycling',
    metValue: 6.8,
    intensity: 'moderate'
  },
  {
    id: 'cycle-moderate',
    name: 'Cycling (Moderate, 12-14 mph)',
    type: 'cardio',
    category: 'Cycling',
    metValue: 8.0,
    intensity: 'moderate'
  },
  {
    id: 'cycle-vigorous',
    name: 'Cycling (Vigorous, 14-16 mph)',
    type: 'cardio',
    category: 'Cycling',
    metValue: 10.0,
    intensity: 'high'
  },
  {
    id: 'swim-light',
    name: 'Swimming (Light effort)',
    type: 'cardio',
    category: 'Swimming',
    metValue: 5.8,
    intensity: 'moderate'
  },
  {
    id: 'swim-moderate',
    name: 'Swimming (Moderate effort)',
    type: 'cardio',
    category: 'Swimming',
    metValue: 7.0,
    intensity: 'moderate'
  },
  {
    id: 'swim-vigorous',
    name: 'Swimming (Vigorous effort)',
    type: 'cardio',
    category: 'Swimming',
    metValue: 9.8,
    intensity: 'high'
  },
  {
    id: 'lift-light',
    name: 'Weight Lifting (Light intensity)',
    type: 'strength',
    category: 'Gym',
    metValue: 3.0,
    intensity: 'low'
  },
  {
    id: 'lift-moderate',
    name: 'Weight Lifting (Moderate intensity)',
    type: 'strength',
    category: 'Gym',
    metValue: 5.0,
    intensity: 'moderate'
  },
  {
    id: 'lift-vigorous',
    name: 'Weight Lifting (Vigorous intensity)',
    type: 'strength',
    category: 'Gym',
    metValue: 6.0,
    intensity: 'high'
  },
  {
    id: 'bodyweight',
    name: 'Bodyweight Exercises (Push-ups, squats, etc.)',
    type: 'strength',
    category: 'Bodyweight',
    metValue: 3.8,
    intensity: 'moderate'
  },
  {
    id: 'boxing-general',
    name: 'Boxing (General training)',
    type: 'sports',
    category: 'Boxing',
    metValue: 7.8,
    intensity: 'high'
  },
  {
    id: 'boxing-sparring',
    name: 'Boxing (Sparring)',
    type: 'sports',
    category: 'Boxing',
    metValue: 9.0,
    intensity: 'high'
  },
  {
    id: 'football-casual',
    name: 'Football (Casual)',
    type: 'sports',
    category: 'Football',
    metValue: 6.0,
    intensity: 'moderate'
  },
  {
    id: 'football-competitive',
    name: 'Football (Competitive)',
    type: 'sports',
    category: 'Football',
    metValue: 8.0,
    intensity: 'high'
  },
  {
    id: 'basketball-casual',
    name: 'Basketball (Casual)',
    type: 'sports',
    category: 'Basketball',
    metValue: 6.5,
    intensity: 'moderate'
  },
  {
    id: 'basketball-game',
    name: 'Basketball (Game)',
    type: 'sports',
    category: 'Basketball',
    metValue: 8.0,
    intensity: 'high'
  },
  {
    id: 'soccer-casual',
    name: 'Soccer (Casual)',
    type: 'sports',
    category: 'Soccer',
    metValue: 7.0,
    intensity: 'moderate'
  },
  {
    id: 'soccer-competitive',
    name: 'Soccer (Competitive)',
    type: 'sports',
    category: 'Soccer',
    metValue: 10.0,
    intensity: 'high'
  },
  {
    id: 'tennis-singles',
    name: 'Tennis (Singles)',
    type: 'sports',
    category: 'Tennis',
    metValue: 8.0,
    intensity: 'high'
  },
  {
    id: 'tennis-doubles',
    name: 'Tennis (Doubles)',
    type: 'sports',
    category: 'Tennis',
    metValue: 6.0,
    intensity: 'moderate'
  },
  {
    id: 'yoga-gentle',
    name: 'Yoga (Gentle/Hatha)',
    type: 'flexibility',
    category: 'Yoga',
    metValue: 2.5,
    intensity: 'low'
  },
  {
    id: 'yoga-moderate',
    name: 'Yoga (Moderate/Vinyasa)',
    type: 'flexibility',
    category: 'Yoga',
    metValue: 3.0,
    intensity: 'moderate'
  },
  {
    id: 'yoga-power',
    name: 'Yoga (Power/Ashtanga)',
    type: 'flexibility',
    category: 'Yoga',
    metValue: 4.0,
    intensity: 'high'
  },
  {
    id: 'pilates',
    name: 'Pilates',
    type: 'flexibility',
    category: 'Pilates',
    metValue: 3.0,
    intensity: 'moderate'
  },
  {
    id: 'rowing',
    name: 'Rowing Machine (Moderate)',
    type: 'cardio',
    category: 'Rowing',
    metValue: 7.0,
    intensity: 'moderate'
  },
  {
    id: 'elliptical',
    name: 'Elliptical Trainer',
    type: 'cardio',
    category: 'Elliptical',
    metValue: 5.0,
    intensity: 'moderate'
  },
  {
    id: 'stair-climber',
    name: 'Stair Climber',
    type: 'cardio',
    category: 'Stairs',
    metValue: 9.0,
    intensity: 'high'
  },
  {
    id: 'hiit',
    name: 'HIIT (High Intensity Interval Training)',
    type: 'cardio',
    category: 'HIIT',
    metValue: 8.0,
    intensity: 'high'
  },
  {
    id: 'hiking',
    name: 'Hiking (Cross-country)',
    type: 'cardio',
    category: 'Hiking',
    metValue: 6.0,
    intensity: 'moderate'
  },
  {
    id: 'rock-climbing',
    name: 'Rock Climbing',
    type: 'sports',
    category: 'Climbing',
    metValue: 8.0,
    intensity: 'high'
  },
  {
    id: 'dance-moderate',
    name: 'Dancing (Moderate)',
    type: 'cardio',
    category: 'Dance',
    metValue: 4.5,
    intensity: 'moderate'
  },
  {
    id: 'dance-vigorous',
    name: 'Dancing (Vigorous/Zumba)',
    type: 'cardio',
    category: 'Dance',
    metValue: 6.5,
    intensity: 'high'
  },
  {
    id: 'martial-arts',
    name: 'Martial Arts (General)',
    type: 'sports',
    category: 'Martial Arts',
    metValue: 10.0,
    intensity: 'high'
  },
]

export function getExerciseById(id: string): ExerciseActivity | undefined {
  return EXERCISE_ACTIVITIES.find(ex => ex.id === id)
}

export function getExercisesByCategory(category: string): ExerciseActivity[] {
  return EXERCISE_ACTIVITIES.filter(ex => ex.category === category)
}

export function getExercisesByType(type: ExerciseActivity['type']): ExerciseActivity[] {
  return EXERCISE_ACTIVITIES.filter(ex => ex.type === type)
}

export function getTotalWeeklyCaloriesBurned(logs: ExerciseLog[]): number {
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
  return logs
    .filter(log => log.timestamp >= oneWeekAgo)
    .reduce((sum, log) => sum + log.caloriesBurned, 0)
}

export function getTotalWeeklyExerciseMinutes(logs: ExerciseLog[]): number {
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
  return logs
    .filter(log => log.timestamp >= oneWeekAgo)
    .reduce((sum, log) => sum + log.duration, 0)
}

export function getActivityLevelMultiplier(fitnessLevel: ExerciseProfile['fitnessLevel']): number {
  const multipliers = {
    'sedentary': 1.2,
    'lightly-active': 1.375,
    'moderately-active': 1.55,
    'very-active': 1.725,
    'extremely-active': 1.9
  }
  return multipliers[fitnessLevel]
}

export function calculateBasalMetabolicRate(profile: ExerciseProfile): number {
  const weightKg = profile.weightUnit === 'kg' ? profile.weight : profile.weight * 0.453592
  const heightCm = profile.heightUnit === 'cm' ? profile.height : profile.height * 2.54
  
  if (profile.sex === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * profile.age + 5
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * profile.age - 161
  }
}

export function calculateTotalDailyEnergyExpenditure(profile: ExerciseProfile): number {
  const bmr = calculateBasalMetabolicRate(profile)
  const activityMultiplier = getActivityLevelMultiplier(profile.fitnessLevel)
  return Math.round(bmr * activityMultiplier)
}
