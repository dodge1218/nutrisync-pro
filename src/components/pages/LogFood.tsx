import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Plus, Trash, Check, Storefront } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { FOODS_DATABASE, type Food } from '../../data/foods'
import type { FoodLog } from '../../lib/nutritionEngine'
import type { Page } from '../../App'

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

  const searchResults = searchQuery.length > 0
    ? FOODS_DATABASE.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.tags.some(tag => tag.includes(searchQuery.toLowerCase())) ||
        (food.brand && food.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 10)
    : []

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

    const newLog: FoodLog = {
      id: `${Date.now()}-${Math.random()}`,
      foodId: selectedFood.id,
      food: selectedFood,
      quantity: finalQuantity,
      timestamp: new Date().toISOString(),
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

    const newLog: FoodLog = {
      id: `${Date.now()}-${Math.random()}`,
      foodId: food.id,
      food,
      quantity: 1,
      timestamp: new Date().toISOString(),
    }

    setFoodLogs((current) => [...current, newLog])
    toast.success(`Added ${food.name}`)
  }

  const handleDeleteLog = (logId: string) => {
    setFoodLogs((current) => current.filter(log => log.id !== logId))
    toast.success('Meal removed')
  }

  const today = new Date().toISOString().split('T')[0]
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Log Your Meals</CardTitle>
          <CardDescription>
            Search for foods and track what you eat today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{food.name}</div>
                        {food.brand && (
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <Storefront className="h-3 w-3" weight="fill" />
                            {food.brand}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{food.servingSize} · {food.calories} cal</div>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {food.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Plus className="text-primary" />
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
        <CardHeader>
          <CardTitle>Today's Meals ({todaysLogs.length})</CardTitle>
          <CardDescription>
            Foods logged today
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todaysLogs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No meals logged yet today. Start by adding your first meal above.
            </p>
          ) : (
            <div className="space-y-2">
              {todaysLogs.map(log => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{log.food.name}</div>
                      {log.food.brand && (
                        <Badge variant="secondary" className="text-xs">
                          {log.food.brand}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {log.quantity} × {log.food.servingSize} · {Math.round(log.food.calories * log.quantity)} cal
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteLog(log.id)}
                  >
                    <Trash className="text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {todaysLogs.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button onClick={() => onNavigate('dashboard')}>
                View Analysis →
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
