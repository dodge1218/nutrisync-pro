import type { FoodLog } from './nutritionEngine'
import type { MealTemplate } from '../data/mealTemplates'

export interface MealPattern {
  templateId: string
  dayOfWeek: number
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  frequency: number
  lastUsed: string
  averageCookTime: number
}

export interface CookTimeEstimate {
  templateId: string
  estimatedMinutes: number
  confidence: 'low' | 'medium' | 'high'
  basedOnOccurrences: number
}

export function analyzeMealPatterns(
  logs: FoodLog[],
  templates: MealTemplate[],
  daysBack: number = 30
): MealPattern[] {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysBack)

  const recentLogs = logs.filter(log => new Date(log.timestamp) >= cutoffDate)

  const patterns: Map<string, MealPattern> = new Map()

  recentLogs.forEach(log => {
    const date = new Date(log.timestamp)
    const dayOfWeek = date.getDay()
    
    const matchingTemplate = templates.find(t => 
      t.ingredients.every(ing => 
        recentLogs.some(l => l.foodId === ing.foodId && 
          Math.abs(new Date(l.timestamp).getTime() - date.getTime()) < 60 * 60 * 1000
        )
      )
    )

    if (matchingTemplate && log.mealType) {
      const key = `${matchingTemplate.id}-${dayOfWeek}-${log.mealType}`
      const existing = patterns.get(key)

      if (existing) {
        existing.frequency++
        existing.lastUsed = log.timestamp
      } else {
        patterns.set(key, {
          templateId: matchingTemplate.id,
          dayOfWeek,
          mealType: log.mealType,
          frequency: 1,
          lastUsed: log.timestamp,
          averageCookTime: matchingTemplate.cookTimeMinutes || 30
        })
      }
    }
  })

  return Array.from(patterns.values()).sort((a, b) => b.frequency - a.frequency)
}

export function estimateCookTime(
  template: MealTemplate,
  userCookHistory?: { templateId: string; actualMinutes: number; timestamp: string }[]
): CookTimeEstimate {
  if (userCookHistory && userCookHistory.length > 0) {
    const relevantHistory = userCookHistory.filter(h => h.templateId === template.id)
    
    if (relevantHistory.length >= 3) {
      const avgTime = relevantHistory.reduce((sum, h) => sum + h.actualMinutes, 0) / relevantHistory.length
      return {
        templateId: template.id,
        estimatedMinutes: Math.round(avgTime),
        confidence: 'high',
        basedOnOccurrences: relevantHistory.length
      }
    } else if (relevantHistory.length > 0) {
      const avgTime = relevantHistory.reduce((sum, h) => sum + h.actualMinutes, 0) / relevantHistory.length
      return {
        templateId: template.id,
        estimatedMinutes: Math.round(avgTime),
        confidence: 'medium',
        basedOnOccurrences: relevantHistory.length
      }
    }
  }

  if (template.cookTimeMinutes) {
    return {
      templateId: template.id,
      estimatedMinutes: template.cookTimeMinutes,
      confidence: 'low',
      basedOnOccurrences: 0
    }
  }

  const defaultTime = estimateDefaultCookTime(template)
  return {
    templateId: template.id,
    estimatedMinutes: defaultTime,
    confidence: 'low',
    basedOnOccurrences: 0
  }
}

function estimateDefaultCookTime(template: MealTemplate): number {
  if (template.mealType === 'snack') return 5
  if (template.tags.includes('quick')) return 15
  if (template.tags.includes('slow-cook') || template.tags.includes('baked')) return 60

  const hasRawProtein = template.ingredients.some(ing => 
    ['chicken', 'beef', 'pork', 'fish', 'salmon'].some(protein => 
      ing.foodId.includes(protein)
    )
  )
  
  const hasGrains = template.ingredients.some(ing => 
    ['rice', 'quinoa', 'pasta', 'oats'].some(grain => 
      ing.foodId.includes(grain)
    )
  )

  const hasVeggies = template.ingredients.some(ing => 
    ['broccoli', 'spinach', 'kale', 'pepper', 'onion'].some(veggie => 
      ing.foodId.includes(veggie)
    )
  )

  let time = 10

  if (hasRawProtein) time += 20
  if (hasGrains) time += 15
  if (hasVeggies) time += 10

  return Math.min(time, 60)
}

export function predictFutureMeals(
  patterns: MealPattern[],
  templates: MealTemplate[],
  targetDate: Date
): { template: MealTemplate; mealType: string; confidence: number }[] {
  const dayOfWeek = targetDate.getDay()
  
  const relevantPatterns = patterns.filter(p => p.dayOfWeek === dayOfWeek)
  
  const mealTypes: ('breakfast' | 'lunch' | 'dinner' | 'snack')[] = ['breakfast', 'lunch', 'dinner']
  const predictions: { template: MealTemplate; mealType: string; confidence: number }[] = []

  mealTypes.forEach(mealType => {
    const mealPatterns = relevantPatterns.filter(p => p.mealType === mealType)
    
    if (mealPatterns.length > 0) {
      const mostFrequent = mealPatterns.reduce((prev, current) => 
        current.frequency > prev.frequency ? current : prev
      )

      const template = templates.find(t => t.id === mostFrequent.templateId)
      if (template) {
        const totalOccurrences = patterns.filter(p => p.templateId === template.id).length
        const confidence = Math.min((mostFrequent.frequency / totalOccurrences) * 100, 100)
        
        predictions.push({
          template,
          mealType,
          confidence: Math.round(confidence)
        })
      }
    }
  })

  return predictions.sort((a, b) => b.confidence - a.confidence)
}

export function generateCookingSchedule(
  mealTime: string,
  cookTimeMinutes: number
): { cookStartTime: string; cookEndTime: string } {
  const [hours, minutes] = mealTime.split(':').map(Number)
  const mealMinutes = hours * 60 + minutes

  const cookStartMinutes = mealMinutes - cookTimeMinutes
  const cookStartHours = Math.floor(cookStartMinutes / 60)
  const cookStartMins = cookStartMinutes % 60

  return {
    cookStartTime: `${String(cookStartHours).padStart(2, '0')}:${String(cookStartMins).padStart(2, '0')}`,
    cookEndTime: mealTime
  }
}
