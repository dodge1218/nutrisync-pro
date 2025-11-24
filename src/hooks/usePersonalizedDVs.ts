import { useKV } from '@github/spark/hooks'
import { calculatePersonalizedDVs, type PersonalizedDailyValues, type CompleteUserProfile } from '../lib/personalizedDVs'
import { DAILY_VALUES } from '../lib/dailyValues'

export interface DailyValuesHookResult {
  dvs: PersonalizedDailyValues
  isPersonalized: boolean
  enabled: boolean
  toggle: () => void
}

function defaultDVsFromStandard(): PersonalizedDailyValues {
  return {
    calories: DAILY_VALUES.calories,
    protein: DAILY_VALUES.macronutrients.protein.dv,
    fiber: DAILY_VALUES.macronutrients.fiber.dv,
    vitaminC: DAILY_VALUES.vitamins.vitaminC.dv,
    vitaminD: DAILY_VALUES.vitamins.vitaminD.dv,
    vitaminA: DAILY_VALUES.vitamins.vitaminA.dv,
    vitaminE: DAILY_VALUES.vitamins.vitaminE.dv,
    vitaminK: DAILY_VALUES.vitamins.vitaminK.dv,
    vitaminB12: DAILY_VALUES.vitamins.vitaminB12.dv,
    vitaminB6: DAILY_VALUES.vitamins.vitaminB6.dv,
    folate: DAILY_VALUES.vitamins.vitaminB9.dv,
    thiamin: DAILY_VALUES.vitamins.vitaminB1.dv,
    riboflavin: DAILY_VALUES.vitamins.vitaminB2.dv,
    niacin: DAILY_VALUES.vitamins.vitaminB3.dv,
    pantothenicAcid: 5,
    iron: DAILY_VALUES.minerals.iron.dv,
    zinc: DAILY_VALUES.minerals.zinc.dv,
    calcium: DAILY_VALUES.minerals.calcium.dv,
    magnesium: DAILY_VALUES.minerals.magnesium.dv,
    potassium: DAILY_VALUES.electrolytes.potassium.dv,
    selenium: DAILY_VALUES.minerals.selenium.dv,
    copper: DAILY_VALUES.minerals.copper.dv / 1000,
    manganese: DAILY_VALUES.minerals.manganese.dv,
    sodium: DAILY_VALUES.electrolytes.sodium.dv
  }
}

export function usePersonalizedDVs(): DailyValuesHookResult {
  const [enabled, setEnabled] = useKV<boolean>('use-personalized-dvs', false)
  const [userProfile] = useKV<CompleteUserProfile | null>('complete-user-profile', null)

  const personalizedDVs = userProfile && enabled ? calculatePersonalizedDVs(userProfile) : defaultDVsFromStandard()

  return {
    dvs: personalizedDVs,
    isPersonalized: !!(enabled && userProfile?.physical),
    enabled: enabled || false,
    toggle: () => setEnabled(prev => !prev)
  }
}
