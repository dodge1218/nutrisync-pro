import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog'
import { Plus, Trash, CalendarDots, ForkKnife, Coffee, FlowerLotus, Copy, CheckCircle, PencilSimple } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { MEAL_TEMPLATES, type MealTemplate, type MealIngredient } from '../../data/mealTemplates'
import { FOODS_DATABASE } from '../../data/foods'
import type { FoodLog } from '../../lib/nutritionEngine'
import type { Page } from '../../App'

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
    const newPlannedMeal: PlannedMeal = {
      id: `${Date.now()}-${Math.random()}`,
      templateId,
      dayOfWeek: day,
      mealType,
    }

    setPlannedMeals((current) => [...(current || []), newPlannedMeal])
    toast.success('Meal added to plan')
  }

  const removeMealFromPlan = (mealId: string) => {
    setPlannedMeals((current) => (current || []).filter(m => m.id !== mealId))
    toast.success('Meal removed from plan')
  }

  const logPlannedMeal = (plannedMeal: PlannedMeal) => {
    const template = allTemplates.find(t => t.id === plannedMeal.templateId)
    if (!template) return

    const newLogs: FoodLog[] = template.ingredients.map(ingredient => {
      const food = FOODS_DATABASE.find(f => f.id === ingredient.foodId)
      if (!food) return null

      return {
        id: `${Date.now()}-${Math.random()}`,
        foodId: food.id,
        food,
        quantity: ingredient.quantity,
        timestamp: new Date().toISOString(),
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
                <Label htmlFor="template-description">Description (optional)</Label>
                <Input
                  id="template-description"
                  placeholder="e.g., Eggs with toast and fruit"
                  value={newTemplateDescription}
                  onChange={(e) => setNewTemplateDescription(e.target.value)}
                />
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
                            step="0.1"
                            min="0.1"
                            value={ingredient.quantity}
                            onChange={(e) => updateIngredientQuantity(ingredient.foodId, parseFloat(e.target.value) || 1)}
                            className="w-20 h-8"
                          />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">× {food.servingSize}</span>
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
                                                    • {ing.quantity}× {food.name} ({food.servingSize})
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
                                                      • {ing.quantity}× {food.name} ({food.servingSize})
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
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No meals planned
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {mealsOfType.map((plannedMeal) => {
                              const template = allTemplates.find(t => t.id === plannedMeal.templateId)
                              if (!template) return null

                              return (
                                <div key={plannedMeal.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
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
