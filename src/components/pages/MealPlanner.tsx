import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog'
import { Plus, Trash, CalendarDots, ForkKnife, Coffee, FlowerLotus, Copy, CheckCircle, PencilSimple, Pill, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { MEAL_TEMPLATES, type MealTemplate, type MealIngredient } from '../../data/mealTemplates'
import { FOODS_DATABASE } from '../../data/foods'
import { WELLNESS_SUPPLEMENTS, type WellnessSupplement } from '../../data/wellnessSupplements'
import type { FoodLog } from '../../lib/nutritionEngine'
import type { Page } from '../../types'

interface MealPlannerProps {
  foodLogs: FoodLog[]
  setFoodLogs: (logs: FoodLog[] | ((prev: FoodLog[]) => FoodLog[])) => void
  onNavigate: (page: Page) => void
}

interface PlannedMeal {
  id: string
  templateId: string
  dayOfWeek: number
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  timestamp?: string
  supplements?: string[]
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const

export default function MealPlanner({ foodLogs, setFoodLogs, onNavigate }: MealPlannerProps) {
  const [plannedMeals, setPlannedMeals] = useKV<PlannedMeal[]>('planned-meals', [])
  const [customTemplates, setCustomTemplates] = useKV<MealTemplate[]>('custom-meal-templates', [])
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 7)
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState('')
  const [newTemplateDescription, setNewTemplateDescription] = useState('')
  const [newTemplateMealType, setNewTemplateMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch')
  const [selectedIngredients, setSelectedIngredients] = useState<MealIngredient[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const allTemplates = [...MEAL_TEMPLATES, ...(customTemplates || [])]
  const dayIndex = selectedDay === 7 ? 0 : selectedDay

  const getMealsForDay = (day: number) => {
    return (plannedMeals || []).filter(pm => pm.dayOfWeek === day)
  }

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return <Coffee className="w-4 h-4" />
      case 'lunch':
        return <ForkKnife className="w-4 h-4" />
      case 'dinner':
        return <FlowerLotus className="w-4 h-4" />
      case 'snack':
        return <Coffee className="w-4 h-4" />
      default:
        return <ForkKnife className="w-4 h-4" />
    }
  }

  const addMealToPlan = (templateId: string, day: number, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    const defaultTimes = {
      breakfast: '07:00',
      lunch: '12:00',
      dinner: '18:00',
      snack: '15:00'
    }

    const now = new Date()
    const targetDay = new Date(now)
    const currentDay = now.getDay() || 7
    const daysToAdd = (day - currentDay + 7) % 7
    targetDay.setDate(now.getDate() + daysToAdd)

    const [hours, minutes] = defaultTimes[mealType].split(':').map(Number)
    targetDay.setHours(hours, minutes, 0, 0)

    const newPlannedMeal: PlannedMeal = {
      id: `${Date.now()}-${Math.random()}`,
      templateId,
      dayOfWeek: day,
      mealType,
      timestamp: targetDay.toISOString(),
      supplements: []
    }

    setPlannedMeals((current) => [...(current || []), newPlannedMeal])
    toast.success('Meal added to plan')
  }

  const addSupplementToMeal = (mealId: string, supplementId: string) => {
    setPlannedMeals((current) => 
      (current || []).map(meal => 
        meal.id === mealId 
          ? { ...meal, supplements: [...(meal.supplements || []), supplementId] }
          : meal
      )
    )
    toast.success('Supplement added')
  }

  const removeSupplementFromMeal = (mealId: string, supplementId: string) => {
    setPlannedMeals((current) => 
      (current || []).map(meal => 
        meal.id === mealId 
          ? { ...meal, supplements: (meal.supplements || []).filter(s => s !== supplementId) }
          : meal
      )
    )
  }

  const getAISuggestions = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', count: number = 3) => {
    const suitable = WELLNESS_SUPPLEMENTS.filter(s => s.bestFor.includes(mealType))
    const shuffled = [...suitable].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  const removeMealFromPlan = (mealId: string) => {
    setPlannedMeals((current) => (current || []).filter(m => m.id !== mealId))
    toast.success('Meal removed from plan')
  }

  const logPlannedMeal = (plannedMeal: PlannedMeal) => {
    const template = allTemplates.find(t => t.id === plannedMeal.templateId)
    if (!template) return

    const timestamp = plannedMeal.timestamp || new Date().toISOString()

    const newLogs: FoodLog[] = template.ingredients.map(ingredient => {
      const food = FOODS_DATABASE.find(f => f.id === ingredient.foodId)
      if (!food) return null

      return {
        id: `${Date.now()}-${Math.random()}`,
        foodId: food.id,
        food,
        quantity: ingredient.quantity,
        timestamp,
        mealType: plannedMeal.mealType,
      }
    }).filter(Boolean) as FoodLog[]

    setFoodLogs((current) => [...current, ...newLogs])
    toast.success(`Logged ${template.name}`)
  }

  const createCustomTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error('Please enter a template name')
      return
    }

    if (selectedIngredients.length === 0) {
      toast.error('Please add at least one ingredient')
      return
    }

    const newTemplate: MealTemplate = {
      id: `custom-${Date.now()}`,
      name: newTemplateName,
      description: newTemplateDescription || 'Custom meal',
      mealType: newTemplateMealType,
      ingredients: selectedIngredients,
      tags: ['custom'],
      isCustom: true,
    }

    setCustomTemplates((current) => [...(current || []), newTemplate])
    toast.success('Custom meal template created')
    
    setIsCreatingTemplate(false)
    setNewTemplateName('')
    setNewTemplateDescription('')
    setSelectedIngredients([])
    setSearchQuery('')
  }

  const addIngredientToTemplate = (foodId: string) => {
    const existingIndex = selectedIngredients.findIndex(i => i.foodId === foodId)
    
    if (existingIndex >= 0) {
      toast.error('Ingredient already added')
      return
    }

    setSelectedIngredients([...selectedIngredients, { foodId, quantity: 1 }])
    setSearchQuery('')
  }

  const updateIngredientQuantity = (foodId: string, quantity: number) => {
    setSelectedIngredients(
      selectedIngredients.map(i => 
        i.foodId === foodId ? { ...i, quantity } : i
      )
    )
  }

  const removeIngredient = (foodId: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i.foodId !== foodId))
  }

  const deleteCustomTemplate = (templateId: string) => {
    setCustomTemplates((current) => (current || []).filter(t => t.id !== templateId))
    setPlannedMeals((current) => (current || []).filter(m => m.templateId !== templateId))
    toast.success('Custom template deleted')
  }

  const generateMealFromDescription = async () => {
    if (!newTemplateDescription.trim()) {
      toast.error('Please enter a meal description')
      return
    }

    setIsGenerating(true)
    try {
      const foodsList = FOODS_DATABASE.map(f => `- ${f.id}: ${f.name} (${f.servingSize})`).join('\n')
      const promptText = `You are a nutrition expert. Given the meal description below, suggest 3-8 appropriate ingredients from the available food database.

Meal Description: "${newTemplateDescription}"
Meal Type: ${newTemplateMealType}

IMPORTANT UNIT CONVERSION RULES:
- All quantities MUST be in WEIGHT ounces (oz), not fluid ounces
- If user mentions grams: 100g = 3.5oz, 200g = 7oz
- If user mentions "20oz water" or drinks, this is FLUID oz (20 fl oz = 2.5 servings of 8 fl oz)
- For liquids (water, juice, coffee): use fluid oz conversions (8 fl oz = 1 serving)
- For solids (chicken, vegetables, grains): use weight oz conversions (1oz = 28g)
- Examples:
  * "100g chicken" → quantity: 4 (rounded from 3.5oz)
  * "20oz water" → quantity: 3 (20 fl oz ÷ 8 fl oz per serving = 2.5, round to 3)
  * "6oz chicken breast" → quantity: 6 (already in weight oz)

Available Foods (use only IDs from this list):
${foodsList}

Return ONLY a valid JSON object with a single property "ingredients" containing an array of objects with:
- foodId: exact ID from the list above
- quantity: integer amount in ounces (1-16, no decimals) - use weight oz for solids, convert fl oz properly for liquids

Example format:
{
  "ingredients": [
    {"foodId": "chicken-breast", "quantity": 6},
    {"foodId": "broccoli", "quantity": 4}
  ]
}`

      const response = await window.spark.llm(promptText, 'gpt-4o', true)
      const parsed = JSON.parse(response)
      
      if (parsed.ingredients && Array.isArray(parsed.ingredients)) {
        const validIngredients = parsed.ingredients.filter((ing: any) => {
          const food = FOODS_DATABASE.find(f => f.id === ing.foodId)
          return food && typeof ing.quantity === 'number' && ing.quantity > 0
        })

        if (validIngredients.length > 0) {
          setSelectedIngredients(validIngredients.map((ing: any) => ({
            foodId: ing.foodId,
            quantity: Math.round(Math.max(1, ing.quantity))
          })))
          toast.success(`Generated ${validIngredients.length} ingredients`)
        } else {
          toast.error('No valid ingredients generated. Try manual search.')
        }
      }
    } catch (error) {
      console.error('AI generation error:', error)
      toast.error('Failed to generate meal. Try manual search.')
    } finally {
      setIsGenerating(false)
    }
  }

  const searchResults = searchQuery.length > 0
    ? FOODS_DATABASE.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Meal Planner</h2>
          <p className="text-muted-foreground mt-1">
            Plan your week and log common meals easily
          </p>
        </div>
        <Dialog open={isCreatingTemplate} onOpenChange={setIsCreatingTemplate}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Meal Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Custom Meal Template</DialogTitle>
              <DialogDescription>
                Create a reusable template for meals you eat regularly
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  placeholder="e.g., My Usual Breakfast"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-description">Description</Label>
                <div className="flex gap-2">
                  <Input
                    id="template-description"
                    placeholder="e.g., Grilled chicken with vegetables and rice"
                    value={newTemplateDescription}
                    onChange={(e) => setNewTemplateDescription(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTemplateDescription.trim()) {
                        generateMealFromDescription()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={generateMealFromDescription}
                    disabled={isGenerating || !newTemplateDescription.trim()}
                  >
                    {isGenerating ? 'Generating...' : 'AI Fill'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Describe your meal and click "AI Fill" to auto-populate ingredients
                </p>
              </div>

              <div className="space-y-2">
                <Label>Meal Type</Label>
                <Tabs value={newTemplateMealType} onValueChange={(v) => setNewTemplateMealType(v as any)}>
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
                    <TabsTrigger value="lunch">Lunch</TabsTrigger>
                    <TabsTrigger value="dinner">Dinner</TabsTrigger>
                    <TabsTrigger value="snack">Snack</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-2">
                <Label>Ingredients</Label>
                {selectedIngredients.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {selectedIngredients.map((ingredient) => {
                      const food = FOODS_DATABASE.find(f => f.id === ingredient.foodId)
                      if (!food) return null

                      return (
                        <div key={ingredient.foodId} className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg">
                          <span className="flex-1 text-sm">{food.name}</span>
                          <Input
                            type="number"
                            step="1"
                            min="1"
                            value={ingredient.quantity}
                            onChange={(e) => updateIngredientQuantity(ingredient.foodId, parseInt(e.target.value) || 1)}
                            className="w-20 h-8"
                          />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">oz</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeIngredient(ingredient.foodId)}
                          >
                            <Trash className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}

                <Input
                  placeholder="Search foods to add..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {searchResults.length > 0 && (
                  <div className="border rounded-lg max-h-48 overflow-y-auto">
                    {searchResults.map((food) => (
                      <button
                        key={food.id}
                        onClick={() => addIngredientToTemplate(food.id)}
                        className="w-full text-left px-3 py-2 hover:bg-accent transition-colors border-b last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{food.name}</div>
                            <div className="text-xs text-muted-foreground">{food.servingSize}</div>
                          </div>
                          {food.brand && (
                            <Badge variant="outline" className="text-xs">
                              {food.brand}
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatingTemplate(false)}>
                Cancel
              </Button>
              <Button onClick={createCustomTemplate}>
                Create Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedDay.toString()} onValueChange={(v) => setSelectedDay(parseInt(v))}>
        <TabsList className="grid grid-cols-7 w-full">
          {DAYS_OF_WEEK.map((day, idx) => (
            <TabsTrigger key={day} value={(idx + 1).toString()}>
              {day.slice(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>

        {DAYS_OF_WEEK.map((day, idx) => {
          const dayNum = idx + 1
          const mealsForDay = getMealsForDay(dayNum)

          return (
            <TabsContent key={day} value={dayNum.toString()} className="space-y-4">
              <div className="grid gap-4">
                {MEAL_TYPES.map((mealType) => {
                  const mealsOfType = mealsForDay.filter(m => m.mealType === mealType)
                  
                  return (
                    <Card key={mealType}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getMealIcon(mealType)}
                            <CardTitle className="capitalize">{mealType}</CardTitle>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Meal
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Add {mealType} for {day}</DialogTitle>
                                <DialogDescription>
                                  Choose from preset templates or your custom meals
                                </DialogDescription>
                              </DialogHeader>

                              <Tabs defaultValue="preset" className="mt-4">
                                <TabsList className="grid grid-cols-2 w-full">
                                  <TabsTrigger value="preset">Preset Templates</TabsTrigger>
                                  <TabsTrigger value="custom">My Custom Meals</TabsTrigger>
                                </TabsList>

                                <TabsContent value="preset" className="space-y-3 mt-4">
                                  {MEAL_TEMPLATES.filter(t => t.mealType === mealType).map((template) => (
                                    <Card key={template.id} className="hover:border-primary transition-colors">
                                      <CardHeader>
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <CardTitle className="text-lg">{template.name}</CardTitle>
                                            <CardDescription className="mt-1">{template.description}</CardDescription>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                              {template.tags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                  {tag}
                                                </Badge>
                                              ))}
                                              {template.prepTime && (
                                                <Badge variant="outline" className="text-xs">
                                                  {template.prepTime}
                                                </Badge>
                                              )}
                                            </div>
                                            <div className="mt-3 space-y-1">
                                              {template.ingredients.map((ing) => {
                                                const food = FOODS_DATABASE.find(f => f.id === ing.foodId)
                                                if (!food) return null
                                                return (
                                                  <div key={ing.foodId} className="text-sm text-muted-foreground">
                                                    • {ing.quantity}oz {food.name}
                                                  </div>
                                                )
                                              })}
                                            </div>
                                          </div>
                                          <Button
                                            size="sm"
                                            onClick={() => addMealToPlan(template.id, dayNum, mealType)}
                                          >
                                            <Plus className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      </CardHeader>
                                    </Card>
                                  ))}
                                </TabsContent>

                                <TabsContent value="custom" className="space-y-3 mt-4">
                                  {(customTemplates || []).filter(t => t.mealType === mealType).length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                      <PencilSimple className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                      <p>No custom {mealType} templates yet</p>
                                      <p className="text-sm mt-1">Create one to get started</p>
                                    </div>
                                  ) : (
                                    (customTemplates || []).filter(t => t.mealType === mealType).map((template) => (
                                      <Card key={template.id} className="hover:border-primary transition-colors">
                                        <CardHeader>
                                          <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                              <CardTitle className="text-lg">{template.name}</CardTitle>
                                              <CardDescription className="mt-1">{template.description}</CardDescription>
                                              <div className="flex flex-wrap gap-1 mt-2">
                                                <Badge variant="secondary" className="text-xs">custom</Badge>
                                              </div>
                                              <div className="mt-3 space-y-1">
                                                {template.ingredients.map((ing) => {
                                                  const food = FOODS_DATABASE.find(f => f.id === ing.foodId)
                                                  if (!food) return null
                                                  return (
                                                    <div key={ing.foodId} className="text-sm text-muted-foreground">
                                                      • {ing.quantity}oz {food.name}
                                                    </div>
                                                  )
                                                })}
                                              </div>
                                            </div>
                                            <div className="flex gap-2">
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => deleteCustomTemplate(template.id)}
                                              >
                                                <Trash className="w-4 h-4" />
                                              </Button>
                                              <Button
                                                size="sm"
                                                onClick={() => addMealToPlan(template.id, dayNum, mealType)}
                                              >
                                                <Plus className="w-4 h-4" />
                                              </Button>
                                            </div>
                                          </div>
                                        </CardHeader>
                                      </Card>
                                    ))
                                  )}
                                </TabsContent>
                              </Tabs>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {mealsOfType.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-sm text-muted-foreground mb-4">
                              No meals planned
                            </p>
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-muted-foreground mb-2">Try these wellness habits:</p>
                              {getAISuggestions(mealType, 2).map(suggestion => (
                                <div key={suggestion.id} className="flex items-start gap-2 p-3 bg-accent/10 rounded-lg text-left">
                                  <Sparkle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" weight="fill" />
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{suggestion.name}</div>
                                    <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {mealsOfType.map((plannedMeal) => {
                              const template = allTemplates.find(t => t.id === plannedMeal.templateId)
                              if (!template) return null

                              return (
                                <div key={plannedMeal.id} className="space-y-3">
                                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div className="flex-1">
                                      <div className="font-medium">{template.name}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {template.ingredients.length} ingredients
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => logPlannedMeal(plannedMeal)}
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Log Now
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removeMealFromPlan(plannedMeal.id)}
                                      >
                                        <Trash className="w-4 h-4 text-destructive" />
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="pl-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Pill className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-xs font-medium text-muted-foreground">Wellness Additions</span>
                                      </div>
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                                            <Plus className="w-3 h-3 mr-1" />
                                            Add
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>Add Wellness Supplement</DialogTitle>
                                            <DialogDescription>
                                              Choose a supplement, activity, or wellness practice
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                            {WELLNESS_SUPPLEMENTS.filter(s => s.bestFor.includes(mealType)).map(supplement => (
                                              <button
                                                key={supplement.id}
                                                onClick={() => {
                                                  addSupplementToMeal(plannedMeal.id, supplement.id)
                                                }}
                                                className="w-full text-left p-3 border rounded-lg hover:bg-accent transition-colors"
                                                disabled={(plannedMeal.supplements || []).includes(supplement.id)}
                                              >
                                                <div className="flex items-start justify-between gap-2">
                                                  <div className="flex-1">
                                                    <div className="font-medium text-sm">{supplement.name}</div>
                                                    <div className="text-xs text-muted-foreground mt-1">{supplement.description}</div>
                                                  </div>
                                                  <Badge variant="outline" className="text-xs">
                                                    {supplement.category}
                                                  </Badge>
                                                </div>
                                              </button>
                                            ))}
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                    </div>

                                    {plannedMeal.supplements && plannedMeal.supplements.length > 0 ? (
                                      <div className="space-y-1">
                                        {plannedMeal.supplements.map(suppId => {
                                          const supplement = WELLNESS_SUPPLEMENTS.find(s => s.id === suppId)
                                          if (!supplement) return null
                                          return (
                                            <div key={suppId} className="flex items-center justify-between p-2 bg-accent/10 rounded text-xs">
                                              <span className="flex-1">{supplement.name}</span>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0"
                                                onClick={() => removeSupplementFromMeal(plannedMeal.id, suppId)}
                                              >
                                                <Trash className="w-3 h-3 text-destructive" />
                                              </Button>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    ) : (
                                      <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground mb-1">AI Suggestions:</p>
                                        {getAISuggestions(mealType, 2).map(suggestion => (
                                          <button
                                            key={suggestion.id}
                                            onClick={() => addSupplementToMeal(plannedMeal.id, suggestion.id)}
                                            className="w-full flex items-start gap-2 p-2 bg-primary/5 rounded text-left hover:bg-primary/10 transition-colors"
                                          >
                                            <Sparkle className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" weight="fill" />
                                            <div className="flex-1">
                                              <div className="text-xs font-medium">{suggestion.name}</div>
                                              <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                                            </div>
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
