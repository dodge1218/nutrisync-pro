import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog'
import { Plus, Trash, Check, Storefront, ForkKnife, Pencil, Calendar, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { FOODS_DATABASE, type Food } from '../../data/foods'
import { MEAL_TEMPLATES, type MealTemplate } from '../../data/mealTemplates'
import type { FoodLog } from '../../lib/nutritionEngine'
import type { CompleteUserProfile } from '../../lib/personalizedDVs'
import type { Page } from '../../types'

interface LogFoodProps {
  foodLogs: FoodLog[]
  setFoodLogs: (logs: FoodLog[] | ((prev: FoodLog[]) => FoodLog[])) => void
  onNavigate: (page: Page) => void
}

export default function LogFood({ foodLogs, setFoodLogs, onNavigate }: LogFoodProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFood, setSelectedFood] = useState<Food | null>(null)
  const [quantity, setQuantity] = useState('1')
  const [selectedPortion, setSelectedPortion] = useState<number>(1)
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch')
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0])
  const [mealTime, setMealTime] = useState(() => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  })
  
  // Edit State
  const [editingLog, setEditingLog] = useState<FoodLog | null>(null)
  const [editQuantity, setEditQuantity] = useState('1')
  const [editMealType, setEditMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch')
  const [editDate, setEditDate] = useState('')
  const [editTime, setEditTime] = useState('')

  const [customTemplates] = useKV<MealTemplate[]>('custom-meal-templates', [])
  const [userProfile] = useKV<CompleteUserProfile>('complete-user-profile', {})

  const searchResults = searchQuery.length > 0
    ? FOODS_DATABASE.filter(food => {
        // Basic search matching
        const matchesSearch = 
          food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          food.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          food.tags.some(tag => tag.includes(searchQuery.toLowerCase())) ||
          (food.brand && food.brand.toLowerCase().includes(searchQuery.toLowerCase()))
        
        if (!matchesSearch) return false

        // Dietary filtering
        const userDiet = userProfile?.lifestyle?.dietaryPattern || 'omnivore'
        
        if (userDiet === 'vegan') {
          // Exclude dairy and animal proteins (meat, eggs, fish)
          if (food.category === 'dairy') return false
          if (food.tags.includes('animal-protein')) return false
          if (food.tags.includes('honey')) return false
        }
        
        if (userDiet === 'vegetarian') {
          // Exclude animal proteins EXCEPT eggs and dairy
          // Note: Dairy usually doesn't have 'animal-protein' tag in this DB, but check category
          if (food.tags.includes('animal-protein') && food.id !== 'eggs' && !food.name.toLowerCase().includes('egg')) {
             return false
          }
        }

        return true
      }).slice(0, 10)
    : []

  const getTimestamp = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr)
    if (timeStr && timeStr.includes(':')) {
      const [hours, minutes] = timeStr.split(':').map(Number)
      date.setHours(hours, minutes, 0, 0)
    }
    return date.toISOString()
  }

  const handleAddLog = () => {
    if (!selectedFood) {
      toast.error('Please select a food first')
      return
    }

    const quantityNum = parseFloat(quantity)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error('Please enter a valid quantity')
      return
    }

    const finalQuantity = selectedPortion * quantityNum
    const timestamp = getTimestamp(selectedDate, mealTime)

    const newLog: FoodLog = {
      id: `${Date.now()}-${Math.random()}`,
      foodId: selectedFood.id,
      food: selectedFood,
      quantity: finalQuantity,
      timestamp,
      mealType,
    }

    setFoodLogs((current) => [...current, newLog])
    toast.success(`Added ${selectedFood.name}`)
    setSelectedFood(null)
    setSearchQuery('')
    setQuantity('1')
    setSelectedPortion(1)
  }

  const handleQuickAdd = (foodId: string) => {
    const food = FOODS_DATABASE.find(f => f.id === foodId)
    if (!food) return

    const timestamp = getTimestamp(selectedDate, mealTime)

    const newLog: FoodLog = {
      id: `${Date.now()}-${Math.random()}`,
      foodId: food.id,
      food,
      quantity: 1,
      timestamp,
      mealType,
    }

    setFoodLogs((current) => [...current, newLog])
    toast.success(`Added ${food.name}`)
  }

  const handleDeleteLog = (logId: string) => {
    setFoodLogs((current) => current.filter(log => log.id !== logId))
    toast.success('Meal removed')
  }

  const handleEditClick = (log: FoodLog) => {
    setEditingLog(log)
    setEditQuantity(log.quantity.toString())
    setEditMealType(log.mealType || 'snack')
    
    const date = new Date(log.timestamp)
    setEditDate(date.toISOString().split('T')[0])
    setEditTime(`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`)
  }

  const handleSaveEdit = () => {
    if (!editingLog) return

    const quantityNum = parseFloat(editQuantity)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error('Please enter a valid quantity')
      return
    }

    const timestamp = getTimestamp(editDate, editTime)

    setFoodLogs(current => current.map(log => {
      if (log.id === editingLog.id) {
        return {
          ...log,
          quantity: quantityNum,
          mealType: editMealType,
          timestamp
        }
      }
      return log
    }))

    setEditingLog(null)
    toast.success('Meal updated')
  }

  const handleAutoFillHistory = () => {
    const newLogs: FoodLog[] = []
    const today = new Date()
    
    // Generate 30 days of history
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      // 3-4 meals per day
      const meals = [
        { type: 'breakfast', time: '08:00', foods: ['eggs', 'oats', 'blueberries'] },
        { type: 'lunch', time: '12:30', foods: ['chicken-breast', 'spinach', 'quinoa'] },
        { type: 'dinner', time: '19:00', foods: ['salmon', 'sweet-potato', 'broccoli'] },
        { type: 'snack', time: '15:30', foods: ['greek-yogurt', 'almonds'] }
      ] as const

      meals.forEach(meal => {
        // Randomly skip snacks sometimes
        if (meal.type === 'snack' && Math.random() > 0.7) return

        // Pick 1-2 foods for this meal
        const numFoods = Math.floor(Math.random() * 2) + 1
        const shuffledFoods = [...meal.foods].sort(() => 0.5 - Math.random())
        
        shuffledFoods.slice(0, numFoods).forEach(foodId => {
          const food = FOODS_DATABASE.find(f => f.id === foodId)
          if (food) {
            // Add some randomness to time
            const [h, m] = meal.time.split(':').map(Number)
            const randomTime = new Date(date)
            randomTime.setHours(h, m + Math.floor(Math.random() * 30), 0, 0)

            newLogs.push({
              id: `${dateStr}-${meal.type}-${food.id}-${Math.random()}`,
              foodId: food.id,
              food,
              quantity: 1, // Simplified quantity
              timestamp: randomTime.toISOString(),
              mealType: meal.type as any
            })
          }
        })
      })
    }

    setFoodLogs(current => [...current, ...newLogs])
    toast.success('Added 30 days of sample food history!')
  }

  const handleLogMealTemplate = (template: MealTemplate) => {
    const timestamp = getTimestamp(selectedDate, mealTime)

    const newLogs: FoodLog[] = template.ingredients.map(ingredient => {
      const food = FOODS_DATABASE.find(f => f.id === ingredient.foodId)
      if (!food) return null

      return {
        id: `${Date.now()}-${Math.random()}`,
        foodId: food.id,
        food,
        quantity: ingredient.quantity,
        timestamp,
        mealType,
      }
    }).filter(Boolean) as FoodLog[]

    setFoodLogs((current) => [...current, ...newLogs])
    toast.success(`Logged ${template.name}`)
  }

  const today = selectedDate // Use selected date for filtering "Today's Meals" display
  const todaysLogs = foodLogs.filter(log => log.timestamp.startsWith(today))

  const quickAddFoods = [
    { id: 'eggs', label: 'Eggs' },
    { id: 'greek-yogurt', label: 'Greek Yogurt' },
    { id: 'oats', label: 'Oatmeal' },
    { id: 'chicken-breast', label: 'Chicken' },
    { id: 'salmon', label: 'Salmon' },
    { id: 'spinach', label: 'Spinach' },
    { id: 'sweet-potato', label: 'Sweet Potato' },
    { id: 'blueberries', label: 'Blueberries' },
  ]

  const allTemplates = [...MEAL_TEMPLATES, ...(customTemplates || [])]
  
  const filteredTemplates = allTemplates.filter(template => {
    const userDiet = userProfile?.lifestyle?.dietaryPattern || 'omnivore'
    if (userDiet === 'omnivore') return true
    if (userDiet === 'vegetarian') return template.dietaryTypes.includes('vegetarian') || template.dietaryTypes.includes('vegan')
    if (userDiet === 'vegan') return template.dietaryTypes.includes('vegan')
    return true
  })

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground">Log Your Meals</CardTitle>
          <CardDescription className="text-sm">
            Search for foods and track what you eat today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="log-date">Date</Label>
              <div className="relative">
                <Input
                  id="log-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10"
                />
                <Calendar className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meal-time">Time</Label>
              <Input
                id="meal-time"
                type="time"
                value={mealTime}
                onChange={(e) => setMealTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meal-type">Meal Type</Label>
              <RadioGroup value={mealType} onValueChange={(val) => setMealType(val as any)} className="flex gap-2 pt-2">
                {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
                  <div key={type} className="flex items-center space-x-1">
                    <RadioGroupItem value={type} id={type} />
                    <Label htmlFor={type} className="font-normal cursor-pointer capitalize text-xs">{type}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quick Add (Common Foods)</Label>
            <div className="flex flex-wrap gap-2">
              {quickAddFoods.map(food => (
                <Button
                  key={food.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd(food.id)}
                  className="gap-2"
                >
                  <Plus />
                  {food.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Quick Log Complete Meals</Label>
            <div className="flex flex-wrap gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" size="sm" className="gap-2">
                    <ForkKnife />
                    Log Full Meal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Log Complete Meal</DialogTitle>
                    <DialogDescription>
                      Choose a preset or custom meal to log all ingredients at once
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3 mt-4">
                    {filteredTemplates.map((template) => (
                      <Card key={template.id} className="hover:border-primary transition-colors cursor-pointer">
                        <CardHeader onClick={() => handleLogMealTemplate(template)}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-lg">{template.name}</CardTitle>
                                <Badge variant="outline" className="text-xs capitalize">
                                  {template.mealType}
                                </Badge>
                              </div>
                              <CardDescription className="mt-1">{template.description}</CardDescription>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {template.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="mt-3 space-y-1">
                                {template.ingredients.map((ing) => {
                                  const food = FOODS_DATABASE.find(f => f.id === ing.foodId)
                                  if (!food) return null
                                  return (
                                    <div key={ing.foodId} className="text-sm text-muted-foreground">
                                      • {ing.quantity}× {food.name}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                            <Plus className="text-primary" />
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('meal-planner')}
                className="gap-2"
              >
                Manage Meals →
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search">Search Foods & Brands</Label>
            <Input
              id="search"
              placeholder="Type to search (e.g., 'Fage yogurt', 'salmon', 'Lifeway kefir')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <Label>Search Results</Label>
              <div className="grid gap-2">
                {searchResults.map(food => (
                  <button
                    key={food.id}
                    onClick={() => {
                      setSelectedFood(food)
                      setSearchQuery('')
                      setSelectedPortion(1)
                    }}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors text-left shadow-sm group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium group-hover:text-accent-foreground">{food.name}</div>
                        {food.brand && (
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <Storefront className="h-3 w-3" weight="fill" />
                            {food.brand}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground group-hover:text-accent-foreground/80">{food.servingSize} · {food.calories} cal</div>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {food.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-secondary/20 text-secondary-foreground">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Plus className="text-primary group-hover:text-accent-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedFood && (
            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Add {selectedFood.name}</CardTitle>
                  {selectedFood.brand && (
                    <Badge variant="outline" className="gap-1">
                      <Storefront className="h-3 w-3" weight="fill" />
                      {selectedFood.brand}
                    </Badge>
                  )}
                </div>
                <CardDescription>{selectedFood.servingSize} · {selectedFood.calories} cal per serving</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedFood.portionOptions && selectedFood.portionOptions.length > 0 && (
                  <div className="space-y-2">
                    <Label>Select Portion Size</Label>
                    <RadioGroup value={selectedPortion.toString()} onValueChange={(val) => setSelectedPortion(parseFloat(val))}>
                      {selectedFood.portionOptions.map((option, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.multiplier.toString()} id={`portion-${idx}`} />
                          <Label htmlFor={`portion-${idx}`} className="font-normal cursor-pointer">
                            {option.label}
                            <span className="text-muted-foreground ml-2">
                              ({Math.round(selectedFood.calories * option.multiplier)} cal)
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="quantity">How many servings?</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0.1"
                    step="0.5"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Total: {Math.round(selectedFood.calories * selectedPortion * parseFloat(quantity || '1'))} calories
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddLog} className="flex-1 gap-2">
                    <Check />
                    Add to Log
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setSelectedFood(null)
                    setSelectedPortion(1)
                  }}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">
                Logged Meals ({todaysLogs.length})
              </CardTitle>
              <CardDescription className="text-sm">
                For {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleAutoFillHistory} className="gap-2 text-xs">
              <Sparkle className="w-3 h-3 text-indigo-500" />
              Auto-fill 30 Days
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {todaysLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-border/50 rounded-xl bg-muted/10">
              <div className="p-3 bg-muted rounded-full mb-3">
                <ForkKnife className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                No meals logged for this date.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Start by adding your first meal above.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {todaysLogs.map(log => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg bg-card hover:bg-accent/5 transition-colors shadow-sm"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-sm text-foreground">{log.food.name}</div>
                      {log.food.brand && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                          {log.food.brand}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 capitalize text-muted-foreground">
                        {log.mealType}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-medium flex items-center gap-2">
                      <span>{log.quantity} × {log.food.servingSize}</span>
                      <span>·</span>
                      <span className="text-primary">{Math.round(log.food.calories * log.quantity)} cal</span>
                      <span>·</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={() => handleEditClick(log)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteLog(log.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {todaysLogs.length > 0 && (
            <div className="mt-3 flex justify-end">
              <Button onClick={() => onNavigate('food-budget')} size="sm">
                View Analysis →
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingLog} onOpenChange={(open) => !open && setEditingLog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Log Entry</DialogTitle>
            <DialogDescription>
              Update details for {editingLog?.food.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantity (Servings)</Label>
              <Input
                id="edit-quantity"
                type="number"
                min="0.1"
                step="0.5"
                value={editQuantity}
                onChange={(e) => setEditQuantity(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {editingLog && Math.round(editingLog.food.calories * parseFloat(editQuantity || '0'))} calories
              </p>
            </div>
            <div className="space-y-2">
              <Label>Meal Type</Label>
              <RadioGroup value={editMealType} onValueChange={(val) => setEditMealType(val as any)} className="flex gap-4">
                {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={`edit-${type}`} />
                    <Label htmlFor={`edit-${type}`} className="capitalize cursor-pointer">{type}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingLog(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
