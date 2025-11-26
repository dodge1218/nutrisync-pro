import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Slider } from './ui/slider'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Sparkle, MagicWand, CurrencyDollar, ArrowsClockwise, Check } from '@phosphor-icons/react'
import { FOODS_DATABASE, type Food } from '../data/foods'
import type { FoodLog } from '../lib/nutritionEngine'
import type { MealTemplate } from '../data/mealTemplates'
import { toast } from 'sonner'

interface SmartMealAutofillProps {
  foodLogs: FoodLog[]
  customTemplates?: MealTemplate[]
  onAddMeals: (meals: { mealType: string; foods: { food: Food; quantity: number }[] }[]) => void
}

interface GeneratedMeal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  name?: string
  foods: { food: Food; quantity: number }[]
  price: number
}

export function SmartMealAutofill({ foodLogs, customTemplates = [], onAddMeals }: SmartMealAutofillProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [useNewFoods, setUseNewFoods] = useState(false)
  const [complexity, setComplexity] = useState([50]) // 0 = simple, 100 = complex
  const [generatedMeals, setGeneratedMeals] = useState<GeneratedMeal[]>([])
  const [totalPrice, setTotalPrice] = useState(0)

  const estimatePrice = (food: Food): number => {
    // Rough estimation logic based on category
    const basePrice = 0.50
    if (food.category === 'protein') return 1.50
    if (food.category === 'vegetables') return 0.75
    if (food.category === 'fruits') return 0.80
    if (food.category === 'grains') return 0.30
    if (food.category === 'dairy') return 0.60
    if (food.category === 'nuts-seeds') return 0.90
    return basePrice
  }

  const getFrequentFoods = (mealType: string): Food[] => {
    const relevantLogs = foodLogs.filter(log => log.mealType === mealType)
    const foodCounts = new Map<string, number>()
    
    relevantLogs.forEach(log => {
      foodCounts.set(log.foodId, (foodCounts.get(log.foodId) || 0) + 1)
    })

    return Array.from(foodCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => FOODS_DATABASE.find(f => f.id === id))
      .filter(Boolean) as Food[]
  }

  const getRandomFoods = (category: string, count: number): Food[] => {
    const foods = FOODS_DATABASE.filter(f => f.category === category)
    const shuffled = [...foods].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  const generateMeals = () => {
    const meals: GeneratedMeal[] = []
    const types = ['breakfast', 'lunch', 'dinner', 'snack'] as const
    const isComplex = complexity[0] > 50
    
    let dayTotal = 0

    types.forEach(type => {
      let selectedFoods: { food: Food; quantity: number }[] = []
      let mealName: string | undefined
      
      // Try to use custom templates first if not exploring new foods
      const typeTemplates = customTemplates.filter(t => t.mealType === type)
      
      if (!useNewFoods && typeTemplates.length > 0 && Math.random() > 0.3) {
        // 70% chance to use a template if available and not exploring
        const template = typeTemplates[Math.floor(Math.random() * typeTemplates.length)]
        mealName = template.name
        selectedFoods = template.ingredients.map(ing => {
          const food = FOODS_DATABASE.find(f => f.id === ing.foodId)
          return food ? { food, quantity: ing.quantity } : null
        }).filter(Boolean) as { food: Food; quantity: number }[]
      } else if (!useNewFoods) {
        // Familiar foods logic
        const frequent = getFrequentFoods(type)
        if (frequent.length > 0) {
          // Pick top 1-2 for simple, top 3-4 for complex
          const count = isComplex ? 4 : 2
          const picked = frequent.slice(0, count)
          
          // If not enough familiar foods, fill with random relevant ones
          if (picked.length < count) {
             const needed = count - picked.length
             // Simple fallback logic
             if (type === 'breakfast') picked.push(...getRandomFoods('dairy', needed))
             else picked.push(...getRandomFoods('protein', needed))
          }
          
          selectedFoods = picked.map(f => ({ food: f, quantity: 1 }))
        } else {
          // Fallback if no history
          selectedFoods = generateRandomMeal(type, isComplex)
        }
      } else {
        // New foods logic
        selectedFoods = generateRandomMeal(type, isComplex)
      }

      const mealPrice = selectedFoods.reduce((sum, item) => sum + estimatePrice(item.food), 0)
      dayTotal += mealPrice

      meals.push({
        type,
        name: mealName,
        foods: selectedFoods,
        price: mealPrice
      })
    })

    setGeneratedMeals(meals)
    setTotalPrice(dayTotal)
  }

  const generateRandomMeal = (type: string, isComplex: boolean): { food: Food; quantity: number }[] => {
    const foods: { food: Food; quantity: number }[] = []
    
    if (type === 'breakfast') {
      foods.push({ food: getRandomFoods('dairy', 1)[0] || getRandomFoods('protein', 1)[0], quantity: 1 })
      if (isComplex) {
        foods.push({ food: getRandomFoods('fruits', 1)[0], quantity: 1 })
        foods.push({ food: getRandomFoods('grains', 1)[0], quantity: 1 })
      }
    } else if (type === 'snack') {
      foods.push({ food: getRandomFoods('fruits', 1)[0] || getRandomFoods('nuts-seeds', 1)[0], quantity: 1 })
    } else {
      // Lunch/Dinner
      foods.push({ food: getRandomFoods('protein', 1)[0], quantity: 1 })
      foods.push({ food: getRandomFoods('vegetables', 1)[0], quantity: 1 })
      if (isComplex) {
        foods.push({ food: getRandomFoods('grains', 1)[0], quantity: 1 })
        foods.push({ food: getRandomFoods('healthy-fat', 1)[0] || getRandomFoods('vegetables', 1)[0], quantity: 1 })
      }
    }
    
    return foods.filter(f => f.food)
  }

  const handleApply = () => {
    onAddMeals(generatedMeals.map(m => ({ mealType: m.type, foods: m.foods })))
    setIsOpen(false)
    toast.success('Meals autofilled for today!')
  }

  // Generate initial suggestion when opened
  useEffect(() => {
    if (isOpen) {
      generateMeals()
    }
  }, [isOpen, useNewFoods, complexity]) // Re-generate when settings change

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-primary/50 text-primary hover:bg-primary/5">
          <MagicWand className="w-4 h-4" />
          Autofill Day
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkle className="w-5 h-5 text-primary" weight="fill" />
            Smart Meal Autofill
          </DialogTitle>
          <DialogDescription>
            Automatically generate a full day of meals based on your preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-0.5">
              <Label className="text-base">Explore New Foods</Label>
              <p className="text-xs text-muted-foreground">
                {useNewFoods ? "Suggesting new and varied foods" : "Sticking to your familiar favorites"}
              </p>
            </div>
            <Switch checked={useNewFoods} onCheckedChange={setUseNewFoods} />
          </div>

          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="text-base">Recipe Complexity</Label>
              <span className="text-xs font-medium text-muted-foreground uppercase">
                {complexity[0] < 33 ? 'Simple' : complexity[0] > 66 ? 'Complex' : 'Balanced'}
              </span>
            </div>
            <Slider
              value={complexity}
              onValueChange={setComplexity}
              max={100}
              step={10}
              className="py-2"
            />
            <p className="text-xs text-muted-foreground">
              {complexity[0] < 50 
                ? "Focus on single ingredients and simple pairings." 
                : "Includes more ingredients, sides, and garnishes."}
            </p>
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CurrencyDollar className="w-4 h-4 text-green-600" />
              Est. Daily Cost: <span className="text-green-600">${totalPrice.toFixed(2)}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={generateMeals} className="gap-2">
              <ArrowsClockwise className="w-4 h-4" />
              Regenerate
            </Button>
          </div>

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {generatedMeals.map((meal) => (
                <div key={meal.type} className="border rounded-lg p-3 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">{meal.type}</Badge>
                      {meal.name && (
                        <span className="text-xs font-medium text-primary">{meal.name}</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">~${meal.price.toFixed(2)}</span>
                  </div>
                  <div className="space-y-1">
                    {meal.foods.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary" />
                          {item.food.name}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {item.food.servingSize}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleApply} className="gap-2">
            <Check className="w-4 h-4" />
            Log All Meals
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
