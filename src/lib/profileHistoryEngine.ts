export interface ProfileSnapshot {
  id: string
  timestamp: number
  date: string
  weight?: number
  height?: number
  age?: number
  activityLevel?: string
  bmi?: number
  tdee?: number
  goals?: string[]
  stressLevel?: number
  sleepQuality?: number
}

export interface NutrientAdequacySnapshot {
  date: string
  timestamp: number
  nutrientScores: {
    protein: number
    fiber: number
    vitaminC: number
    vitaminD: number
    iron: number
    calcium: number
    magnesium: number
    zinc: number
    overallAdequacy: number
  }
  gutHealthScore: number
  calorieIntake: number
  mealsLogged: number
}

export interface ProfileTrend {
  metric: 'weight' | 'bmi' | 'nutrient-adequacy' | 'gut-health' | 'stress' | 'sleep'
  direction: 'improving' | 'stable' | 'declining'
  change: number
  changePercent: number
  confidence: 'high' | 'medium' | 'low'
  message: string
}

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return weightKg / (heightM * heightM)
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal weight'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

export function calculateProfileTrends(snapshots: ProfileSnapshot[]): ProfileTrend[] {
  if (snapshots.length < 2) return []

  const sorted = [...snapshots].sort((a, b) => a.timestamp - b.timestamp)
  const latest = sorted[sorted.length - 1]
  const earliest = sorted[0]
  const trends: ProfileTrend[] = []

  if (latest.weight && earliest.weight) {
    const change = latest.weight - earliest.weight
    const changePercent = (change / earliest.weight) * 100
    const direction = Math.abs(changePercent) < 2 ? 'stable' : change < 0 ? 'improving' : 'declining'
    
    trends.push({
      metric: 'weight',
      direction,
      change,
      changePercent,
      confidence: snapshots.length >= 5 ? 'high' : snapshots.length >= 3 ? 'medium' : 'low',
      message: `Weight ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(1)} kg (${Math.abs(changePercent).toFixed(1)}%)`
    })
  }

  if (latest.bmi && earliest.bmi) {
    const change = latest.bmi - earliest.bmi
    const changePercent = (change / earliest.bmi) * 100
    const direction = Math.abs(changePercent) < 2 ? 'stable' : change < 0 ? 'improving' : 'declining'
    
    trends.push({
      metric: 'bmi',
      direction,
      change,
      changePercent,
      confidence: snapshots.length >= 5 ? 'high' : snapshots.length >= 3 ? 'medium' : 'low',
      message: `BMI ${change > 0 ? 'increased' : 'decreased'} from ${earliest.bmi.toFixed(1)} to ${latest.bmi.toFixed(1)}`
    })
  }

  if (latest.stressLevel !== undefined && earliest.stressLevel !== undefined) {
    const change = latest.stressLevel - earliest.stressLevel
    const changePercent = (change / (earliest.stressLevel || 1)) * 100
    const direction = Math.abs(changePercent) < 10 ? 'stable' : change < 0 ? 'improving' : 'declining'
    
    trends.push({
      metric: 'stress',
      direction,
      change,
      changePercent,
      confidence: snapshots.length >= 5 ? 'high' : snapshots.length >= 3 ? 'medium' : 'low',
      message: `Stress levels ${change < 0 ? 'decreased' : 'increased'} by ${Math.abs(changePercent).toFixed(0)}%`
    })
  }

  return trends
}

export function calculateNutrientAdequacyTrends(snapshots: NutrientAdequacySnapshot[]): ProfileTrend[] {
  if (snapshots.length < 2) return []

  const sorted = [...snapshots].sort((a, b) => a.timestamp - b.timestamp)
  const latest = sorted[sorted.length - 1]
  const earliest = sorted[0]
  const trends: ProfileTrend[] = []

  const overallChange = latest.nutrientScores.overallAdequacy - earliest.nutrientScores.overallAdequacy
  const overallChangePercent = (overallChange / (earliest.nutrientScores.overallAdequacy || 1)) * 100
  const direction = Math.abs(overallChangePercent) < 5 ? 'stable' : overallChange > 0 ? 'improving' : 'declining'
  
  trends.push({
    metric: 'nutrient-adequacy',
    direction,
    change: overallChange,
    changePercent: overallChangePercent,
    confidence: snapshots.length >= 7 ? 'high' : snapshots.length >= 4 ? 'medium' : 'low',
    message: `Overall nutrient adequacy ${overallChange > 0 ? 'improved' : 'declined'} by ${Math.abs(overallChangePercent).toFixed(1)}%`
  })

  const gutHealthChange = latest.gutHealthScore - earliest.gutHealthScore
  const gutHealthChangePercent = (gutHealthChange / (earliest.gutHealthScore || 1)) * 100
  const gutDirection = Math.abs(gutHealthChangePercent) < 5 ? 'stable' : gutHealthChange > 0 ? 'improving' : 'declining'
  
  trends.push({
    metric: 'gut-health',
    direction: gutDirection,
    change: gutHealthChange,
    changePercent: gutHealthChangePercent,
    confidence: snapshots.length >= 7 ? 'high' : snapshots.length >= 4 ? 'medium' : 'low',
    message: `Gut health score ${gutHealthChange > 0 ? 'improved' : 'declined'} by ${Math.abs(gutHealthChange).toFixed(1)} points`
  })

  return trends
}

export function getProfileInsights(
  profileTrends: ProfileTrend[],
  nutrientTrends: ProfileTrend[]
): string[] {
  const insights: string[] = []

  const weightTrend = profileTrends.find(t => t.metric === 'weight')
  const nutrientTrend = nutrientTrends.find(t => t.metric === 'nutrient-adequacy')
  const gutTrend = nutrientTrends.find(t => t.metric === 'gut-health')
  const stressTrend = profileTrends.find(t => t.metric === 'stress')

  if (weightTrend?.direction === 'improving' && nutrientTrend?.direction === 'improving') {
    insights.push('Great progress! Your weight and nutrient intake are both improving.')
  }

  if (gutTrend?.direction === 'improving' && gutTrend.confidence === 'high') {
    insights.push('Your gut health is consistently improving - keep up the fermented foods and fiber!')
  }

  if (nutrientTrend?.direction === 'declining' && stressTrend?.direction === 'declining') {
    insights.push('Declining nutrient intake may be linked to increased stress. Consider meal prepping.')
  }

  if (weightTrend?.direction === 'stable' && nutrientTrend?.direction === 'improving') {
    insights.push('You\'re maintaining a healthy weight while improving nutrition quality - excellent balance!')
  }

  if (gutTrend?.direction === 'declining') {
    insights.push('Gut health scores declining. Try adding more fermented foods and plant diversity.')
  }

  return insights
}
