import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Plus, Target, CaretRight, ForkKnife } from '@phosphor-icons/react'
import type { NutrientGap } from '../lib/nutritionEngine'
import { FOODS_DATABASE, type Food } from '../data/foods'
import { NUTRIENT_DISPLAY_NAMES, getNutrientDV, type NutrientKey } from '../lib/dailyValues'

interface GapFillerProps {
  gaps: NutrientGap[]
  onAddFood?: (foodId: string) => void
}

interface FoodSuggestion {
  type: 'single'
  food: Food
  nutrientsProvided: Array<{
    nutrient: NutrientKey
    amount: number
    percentOfGap: number
  }>
  gapsFilled: number
  totalGapPercentage: number
}

interface GroupedSuggestion {
  type: 'group'
  category: string
  items: FoodSuggestion[]
  bestItem: FoodSuggestion
  totalGapPercentage: number
}

const MEAT_CATEGORIES = ['Beef', 'Chicken', 'Pork', 'Lamb', 'Turkey', 'Fish', 'Seafood']

const getMeatCategory = (name: string): string | null => {
  const lower = name.toLowerCase()
  if (lower.includes('beef') || lower.includes('steak')) return 'Beef'
  if (lower.includes('chicken')) return 'Chicken'
  if (lower.includes('pork') || lower.includes('ham') || lower.includes('bacon')) return 'Pork'
  if (lower.includes('lamb')) return 'Lamb'
  if (lower.includes('turkey')) return 'Turkey'
  if (lower.includes('salmon') || lower.includes('tuna') || lower.includes('cod') || lower.includes('fish') || lower.includes('sardine')) return 'Fish'
  if (lower.includes('shrimp') || lower.includes('crab') || lower.includes('lobster') || lower.includes('mussel') || lower.includes('oyster')) return 'Seafood'
  return null
}

export default function GapFiller({ gaps, onAddFood }: GapFillerProps) {
  const criticalGaps = gaps.filter(g => g.severity === 'critical' && g.nutrient !== 'sodium')
  const moderateGaps = gaps.filter(g => g.severity === 'moderate' && g.nutrient !== 'sodium')
  const allGaps = [...criticalGaps, ...moderateGaps]

  if (allGaps.length === 0) {
    return null
  }

  // Filter out processed foods
  const cleanFoods = FOODS_DATABASE.filter(f => 
    !f.tags?.includes('processed') && 
    !f.tags?.includes('fast-food') && 
    !f.tags?.includes('ultra-processed')
  )

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
      type: 'single',
      food,
      nutrientsProvided: nutrientsProvided.sort((a, b) => b.percentOfGap - a.percentOfGap),
      gapsFilled,
      totalGapPercentage
    }
  }

  const allSuggestions = cleanFoods.map(analyzeFoodForGaps)

  const foodSuggestions = allSuggestions
    .filter(s => s.gapsFilled >= 2)
    .sort((a, b) => {
      if (b.gapsFilled !== a.gapsFilled) {
        return b.gapsFilled - a.gapsFilled
      }
      return b.totalGapPercentage - a.totalGapPercentage
    })
    .slice(0, 8)

  // Group critical suggestions
  const criticalSuggestionsRaw = allSuggestions
    .filter(s => s.nutrientsProvided.some(n => 
      criticalGaps.some(g => g.nutrient === n.nutrient)
    ))
    .sort((a, b) => b.totalGapPercentage - a.totalGapPercentage)

  const groupedCriticalSuggestions: (FoodSuggestion | GroupedSuggestion)[] = []
  const meatGroups: Record<string, FoodSuggestion[]> = {}
  const processedIds = new Set<string>()

  // First pass: Identify meat groups
  criticalSuggestionsRaw.forEach(suggestion => {
    const category = getMeatCategory(suggestion.food.name)
    if (category) {
      if (!meatGroups[category]) meatGroups[category] = []
      meatGroups[category].push(suggestion)
    }
  })

  // Second pass: Build final list
  criticalSuggestionsRaw.forEach(suggestion => {
    if (processedIds.has(suggestion.food.id)) return

    const category = getMeatCategory(suggestion.food.name)
    if (category) {
      // Only add the group once
      if (!processedIds.has(`GROUP-${category}`)) {
        const items = meatGroups[category]
        groupedCriticalSuggestions.push({
          type: 'group',
          category,
          items,
          bestItem: items[0], // Already sorted
          totalGapPercentage: items[0].totalGapPercentage
        })
        // Mark all items in this group as processed so they don't appear individually
        items.forEach(item => processedIds.add(item.food.id))
        processedIds.add(`GROUP-${category}`)
      }
    } else {
      groupedCriticalSuggestions.push(suggestion)
      processedIds.add(suggestion.food.id)
    }
  })

  const topCriticalFoods = groupedCriticalSuggestions
    .sort((a, b) => b.totalGapPercentage - a.totalGapPercentage)
    .slice(0, 5)

  const renderSuggestion = (suggestion: FoodSuggestion | GroupedSuggestion) => {
    if (suggestion.type === 'group') {
      return (
        <Dialog key={`group-${suggestion.category}`}>
          <DialogTrigger asChild>
            <div className="p-4 bg-background rounded-lg border hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-lg">{suggestion.category} Options</div>
                    <Badge variant="secondary" className="text-xs">
                      {suggestion.items.length} cuts
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tap to see recommended cuts & portions
                  </div>
                </div>
                <CaretRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              </div>
              <div className="space-y-2">
                {suggestion.bestItem.nutrientsProvided.slice(0, 3).map(nutrient => {
                  const isCritical = criticalGaps.some(g => g.nutrient === nutrient.nutrient)
                  return (
                    <div key={nutrient.nutrient} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className={isCritical ? 'font-semibold text-destructive' : 'text-muted-foreground'}>
                          {NUTRIENT_DISPLAY_NAMES[nutrient.nutrient]}
                        </span>
                        <span className="text-xs">
                          Up to {Math.round(nutrient.percentOfGap)}% of gap
                        </span>
                      </div>
                      <Progress value={nutrient.percentOfGap} className="h-1" />
                    </div>
                  )
                })}
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ForkKnife className="w-5 h-5" />
                {suggestion.category} Recommendations
              </DialogTitle>
              <DialogDescription>
                Choose a cut to address your nutrient gaps
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {suggestion.items.slice(0, 6).map(item => (
                <div key={item.food.id} className="p-3 rounded-lg border bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{item.food.name}</div>
                      <div className="text-sm text-muted-foreground">{item.food.servingSize}</div>
                    </div>
                    {onAddFood && (
                      <Button size="sm" onClick={() => onAddFood(item.food.id)}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {item.nutrientsProvided.slice(0, 4).map(n => (
                      <div key={n.nutrient} className="text-xs flex justify-between">
                        <span className="text-muted-foreground">{NUTRIENT_DISPLAY_NAMES[n.nutrient]}</span>
                        <span className="font-medium">{Math.round(n.percentOfGap)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )
    }

    return (
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
    )
  }

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
            {topCriticalFoods.map(renderSuggestion)}
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
