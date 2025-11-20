export const DAILY_VALUES = {
  calories: 2000,
  
  macronutrients: {
    protein: { amount: 50, unit: 'g', dv: 50 },
    carbs: { amount: 275, unit: 'g', dv: 275 },
    fat: { amount: 78, unit: 'g', dv: 78 },
    fiber: { amount: 28, unit: 'g', dv: 28 },
  },
  
  vitamins: {
    vitaminA: { amount: 900, unit: 'mcg RAE', dv: 900 },
    vitaminC: { amount: 90, unit: 'mg', dv: 90 },
    vitaminD: { amount: 20, unit: 'mcg', dv: 20 },
    vitaminE: { amount: 15, unit: 'mg', dv: 15 },
    vitaminK: { amount: 120, unit: 'mcg', dv: 120 },
    vitaminB1: { amount: 1.2, unit: 'mg', dv: 1.2 },
    vitaminB2: { amount: 1.3, unit: 'mg', dv: 1.3 },
    vitaminB3: { amount: 16, unit: 'mg NE', dv: 16 },
    vitaminB6: { amount: 1.7, unit: 'mg', dv: 1.7 },
    vitaminB9: { amount: 400, unit: 'mcg DFE', dv: 400 },
    vitaminB12: { amount: 2.4, unit: 'mcg', dv: 2.4 },
  },
  
  minerals: {
    calcium: { amount: 1000, unit: 'mg', dv: 1000 },
    iron: { amount: 18, unit: 'mg', dv: 18 },
    magnesium: { amount: 420, unit: 'mg', dv: 420 },
    zinc: { amount: 11, unit: 'mg', dv: 11 },
    selenium: { amount: 55, unit: 'mcg', dv: 55 },
    copper: { amount: 900, unit: 'mcg', dv: 900 },
    manganese: { amount: 2.3, unit: 'mg', dv: 2.3 },
  },
  
  electrolytes: {
    sodium: { amount: 2300, unit: 'mg', dv: 2300, max: true },
    potassium: { amount: 3500, unit: 'mg', dv: 3500 },
  },
} as const

export type NutrientKey = keyof typeof DAILY_VALUES.macronutrients | 
  keyof typeof DAILY_VALUES.vitamins | 
  keyof typeof DAILY_VALUES.minerals | 
  keyof typeof DAILY_VALUES.electrolytes

export const NUTRIENT_DISPLAY_NAMES: Record<NutrientKey, string> = {
  protein: 'Protein',
  carbs: 'Carbohydrates',
  fat: 'Total Fat',
  fiber: 'Fiber',
  vitaminA: 'Vitamin A',
  vitaminC: 'Vitamin C',
  vitaminD: 'Vitamin D',
  vitaminE: 'Vitamin E',
  vitaminK: 'Vitamin K',
  vitaminB1: 'Thiamin (B1)',
  vitaminB2: 'Riboflavin (B2)',
  vitaminB3: 'Niacin (B3)',
  vitaminB6: 'Vitamin B6',
  vitaminB9: 'Folate (B9)',
  vitaminB12: 'Vitamin B12',
  calcium: 'Calcium',
  iron: 'Iron',
  magnesium: 'Magnesium',
  zinc: 'Zinc',
  selenium: 'Selenium',
  copper: 'Copper',
  manganese: 'Manganese',
  sodium: 'Sodium',
  potassium: 'Potassium',
}

export function getNutrientDV(nutrient: NutrientKey): number {
  if (nutrient in DAILY_VALUES.macronutrients) {
    return DAILY_VALUES.macronutrients[nutrient as keyof typeof DAILY_VALUES.macronutrients].dv
  }
  if (nutrient in DAILY_VALUES.vitamins) {
    return DAILY_VALUES.vitamins[nutrient as keyof typeof DAILY_VALUES.vitamins].dv
  }
  if (nutrient in DAILY_VALUES.minerals) {
    return DAILY_VALUES.minerals[nutrient as keyof typeof DAILY_VALUES.minerals].dv
  }
  if (nutrient in DAILY_VALUES.electrolytes) {
    return DAILY_VALUES.electrolytes[nutrient as keyof typeof DAILY_VALUES.electrolytes].dv
  }
  return 0
}

export function getNutrientUnit(nutrient: NutrientKey): string {
  if (nutrient in DAILY_VALUES.macronutrients) {
    return DAILY_VALUES.macronutrients[nutrient as keyof typeof DAILY_VALUES.macronutrients].unit
  }
  if (nutrient in DAILY_VALUES.vitamins) {
    return DAILY_VALUES.vitamins[nutrient as keyof typeof DAILY_VALUES.vitamins].unit
  }
  if (nutrient in DAILY_VALUES.minerals) {
    return DAILY_VALUES.minerals[nutrient as keyof typeof DAILY_VALUES.minerals].unit
  }
  if (nutrient in DAILY_VALUES.electrolytes) {
    return DAILY_VALUES.electrolytes[nutrient as keyof typeof DAILY_VALUES.electrolytes].unit
  }
  return ''
}

export function formatNutrientAmount(amount: number, nutrient: NutrientKey): string {
  const unit = getNutrientUnit(nutrient)
  const rounded = Math.round(amount * 10) / 10
  return `${rounded}${unit}`
}
