import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Plus, Target } from '@phosphor-icons/react'
import type { NutrientGap } from '../lib/nutritionEngine'
import { FOODS_DATABASE, type Food } from '../data/foods'
import { NUTRIENT_DISPLAY_NAMES, getNutrientDV, type NutrientKey } from '../lib/dailyValues'

interface GapFillerProps {
  gaps: NutrientGap[]
  onAddFood?: (foodId: string) => void
}

interface FoodSuggestion {
  food: Food
  nutrientsProvided: Array<{
    nutrient: NutrientKey
    amount: number
    percentOfGap: number
  }>
  gapsFilled: number
  totalGapPercentage: number
}

export default function GapFiller({ gaps, onAddFood }: GapFillerProps) {
  const criticalGaps = gaps.filter(g => g.severity === 'critical' && g.nutrient !== 'sodium')
  const moderateGaps = gaps.filter(g => g.severity === 'moderate' && g.nutrient !== 'sodium')
  const allGaps = [...criticalGaps, ...moderateGaps]

  if (allGaps.length === 0) {
    return null
  }

  const analyzeFoodForGaps = (food: Food): FoodSuggestion => {
    const nutrientsProvided: Array<{
      nutrient: NutrientKey
      amount: number
      percentOfGap: number
    }> = []

    allGaps.forEach(gap => {
      const nutrient = gap.nutrient
      const foodValue = food[nutrient as keyof Food]
      
      if (typeof foodValue === 'number' && foodValue > 0) {
        const gapAmount = gap.target - gap.current
        const percentOfGap = (foodValue / gapAmount) * 100
        
        if (percentOfGap >= 10) {
          nutrientsProvided.push({
            nutrient,
            amount: foodValue,
            percentOfGap: Math.min(percentOfGap, 100)
          })
        }
      }
    })

    const gapsFilled = nutrientsProvided.length
    const totalGapPercentage = nutrientsProvided.reduce((sum, n) => sum + n.percentOfGap, 0)

    return {
      food,
      nutrientsProvided: nutrientsProvided.sort((a, b) => b.percentOfGap - a.percentOfGap),
      gapsFilled,
      totalGapPercentage
    }
  }

  const foodSuggestions = FOODS_DATABASE
    .map(analyzeFoodForGaps)
    .filter(s => s.gapsFilled >= 2)
    .sort((a, b) => {
      if (b.gapsFilled !== a.gapsFilled) {
        return b.gapsFilled - a.gapsFilled
      }
      return b.totalGapPercentage - a.totalGapPercentage
    })
    .slice(0, 8)

  const topCriticalFoods = FOODS_DATABASE
    .map(analyzeFoodForGaps)
    .filter(s => s.nutrientsProvided.some(n => 
      criticalGaps.some(g => g.nutrient === n.nutrient)
    ))
    .sort((a, b) => b.totalGapPercentage - a.totalGapPercentage)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {criticalGaps.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Target className="w-5 h-5" />
              Critical Gap Solutions
            </CardTitle>
            <CardDescription>
              These foods provide the most benefit for your critical nutrient deficiencies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topCriticalFoods.map(suggestion => (
              <div key={suggestion.food.id} className="p-4 bg-background rounded-lg border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{suggestion.food.name}</div>
                    <div className="text-sm text-muted-foreground">{suggestion.food.servingSize}</div>
                    {suggestion.food.category && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {suggestion.food.category}
                      </Badge>
                    )}
                  </div>
                  {onAddFood && (
                    <Button size="sm" onClick={() => onAddFood(suggestion.food.id)}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {suggestion.nutrientsProvided.slice(0, 4).map(nutrient => {
                    const gap = allGaps.find(g => g.nutrient === nutrient.nutrient)
                    const isCritical = criticalGaps.some(g => g.nutrient === nutrient.nutrient)
                    
                    return (
                      <div key={nutrient.nutrient} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className={isCritical ? 'font-semibold text-destructive' : 'text-muted-foreground'}>
                            {NUTRIENT_DISPLAY_NAMES[nutrient.nutrient]}
                          </span>
                          <span className="text-xs">
                            {Math.round(nutrient.percentOfGap)}% of gap
                          </span>
                        </div>
                        <Progress value={nutrient.percentOfGap} className="h-1" />
                      </div>
                    )
                  })}
                  {suggestion.nutrientsProvided.length > 4 && (
                    <div className="text-xs text-muted-foreground pt-1">
                      + {suggestion.nutrientsProvided.length - 4} more nutrients
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Multi-Nutrient Gap Fillers</CardTitle>
          <CardDescription>
            Foods that address multiple nutrient deficiencies at once
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {foodSuggestions.map(suggestion => (
            <div key={suggestion.food.id} className="p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{suggestion.food.name}</div>
                    <Badge variant="secondary" className="text-xs">
                      {suggestion.gapsFilled} gaps
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{suggestion.food.servingSize}</div>
                </div>
                {onAddFood && (
                  <Button size="sm" variant="outline" onClick={() => onAddFood(suggestion.food.id)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {suggestion.nutrientsProvided.slice(0, 6).map(nutrient => (
                  <Badge key={nutrient.nutrient} variant="outline" className="text-xs">
                    {NUTRIENT_DISPLAY_NAMES[nutrient.nutrient]} {Math.round(nutrient.percentOfGap)}%
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
