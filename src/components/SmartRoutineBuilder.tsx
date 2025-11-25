import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Checkbox } from './ui/checkbox'
import { 
  Sparkle, 
  MagicWand, 
  CheckCircle, 
  Plus, 
  ArrowRight,
  CookingPot,
  ShoppingCart,
  ListMagnifyingGlass,
  Broom
} from '@phosphor-icons/react'
import type { RecurringActivity } from './pages/LifeFlow'

interface SmartRoutineBuilderProps {
  onAddActivities: (activities: RecurringActivity[]) => void
  onClose: () => void
}

export default function SmartRoutineBuilder({ onAddActivities, onClose }: SmartRoutineBuilderProps) {
  const [description, setDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestions, setSuggestions] = useState<Partial<RecurringActivity>[]>([])
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])

  const analyzeRoutine = () => {
    setIsAnalyzing(true)
    
    // Simulate AI processing delay
    setTimeout(() => {
      const text = description.toLowerCase()
      const newSuggestions: Partial<RecurringActivity>[] = []

      // Heuristic Rule Engine
      
      // Cooking / Dinner Routine
      if (text.includes('dinner') || text.includes('cook') || text.includes('meal')) {
        newSuggestions.push({
          name: 'Recipe Planning & Nutrient Check',
          category: 'custom',
          startTime: '17:00',
          duration: 15,
          days: ['sun'], // Weekly planning
        })
        newSuggestions.push({
          name: 'Grocery Run',
          category: 'custom',
          startTime: '10:00',
          duration: 60,
          days: ['sun'], // Weekly shopping
        })
        newSuggestions.push({
          name: 'Dinner Prep',
          category: 'cooking',
          startTime: '17:30',
          duration: 30,
          days: ['mon', 'tue', 'wed', 'thu', 'fri'],
        })
        newSuggestions.push({
          name: 'Cook Dinner',
          category: 'cooking',
          startTime: '18:00',
          duration: 45,
          days: ['mon', 'tue', 'wed', 'thu', 'fri'],
        })
        newSuggestions.push({
          name: 'Kitchen Cleanup',
          category: 'hygiene',
          startTime: '19:00',
          duration: 20,
          days: ['mon', 'tue', 'wed', 'thu', 'fri'],
        })
      }

      // Morning Routine
      if (text.includes('morning') || text.includes('wake') || text.includes('start')) {
        newSuggestions.push({
          name: 'Hydrate & Stretch',
          category: 'exercise',
          startTime: '07:00',
          duration: 15,
          days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        })
        newSuggestions.push({
          name: 'Healthy Breakfast',
          category: 'meal',
          startTime: '07:30',
          duration: 30,
          days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        })
        newSuggestions.push({
          name: 'Daily Goal Review',
          category: 'work',
          startTime: '08:00',
          duration: 10,
          days: ['mon', 'tue', 'wed', 'thu', 'fri'],
        })
      }

      // Workout Routine
      if (text.includes('gym') || text.includes('workout') || text.includes('exercise')) {
        newSuggestions.push({
          name: 'Pre-Workout Snack',
          category: 'meal',
          startTime: '17:00',
          duration: 15,
          days: ['mon', 'wed', 'fri'],
        })
        newSuggestions.push({
          name: 'Gym Session',
          category: 'exercise',
          startTime: '17:30',
          duration: 60,
          days: ['mon', 'wed', 'fri'],
        })
        newSuggestions.push({
          name: 'Post-Workout Recovery Meal',
          category: 'meal',
          startTime: '18:45',
          duration: 30,
          days: ['mon', 'wed', 'fri'],
        })
      }

      // Default fallback if no keywords match
      if (newSuggestions.length === 0) {
        newSuggestions.push({
          name: 'Focus Block',
          category: 'work',
          startTime: '09:00',
          duration: 90,
          days: ['mon', 'tue', 'wed', 'thu', 'fri'],
        })
        newSuggestions.push({
          name: 'Break & Walk',
          category: 'exercise',
          startTime: '10:30',
          duration: 15,
          days: ['mon', 'tue', 'wed', 'thu', 'fri'],
        })
      }

      setSuggestions(newSuggestions)
      setSelectedIndices(newSuggestions.map((_, i) => i)) // Select all by default
      setIsAnalyzing(false)
    }, 1500)
  }

  const handleSave = () => {
    const activitiesToAdd = selectedIndices.map(i => {
      const s = suggestions[i]
      return {
        id: Date.now().toString() + i,
        name: s.name || 'New Activity',
        category: s.category || 'custom',
        startTime: s.startTime || '09:00',
        duration: s.duration || 60,
        days: s.days || ['mon', 'tue', 'wed', 'thu', 'fri']
      } as RecurringActivity
    })
    onAddActivities(activitiesToAdd)
    onClose()
  }

  return (
    <Card className="border-sky-500/30 shadow-lg w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-sky-500/10 via-purple-500/5 to-background border-b border-border/50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <MagicWand className="w-6 h-6 text-sky-500" weight="duotone" />
          Smart Routine Builder
        </CardTitle>
        <CardDescription>
          Describe a complex goal or routine, and we'll break it down into actionable steps for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {!suggestions.length && !isAnalyzing && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="routine-desc">What do you want to accomplish?</Label>
              <Textarea
                id="routine-desc"
                placeholder="e.g., I want to start cooking healthy dinners at home, including shopping and cleanup."
                className="min-h-[120px] text-base resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Try: "Morning gym routine", "Cooking dinner from scratch", "Weekly meal prep Sunday"
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button 
                onClick={analyzeRoutine} 
                disabled={!description.trim()}
                className="bg-sky-500 hover:bg-sky-600 text-white"
              >
                <Sparkle className="w-4 h-4 mr-2" weight="fill" />
                Analyze & Build Routine
              </Button>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="py-12 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-sky-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-sky-500 border-t-transparent animate-spin"></div>
              <MagicWand className="absolute inset-0 m-auto w-6 h-6 text-sky-500 animate-pulse" weight="duotone" />
            </div>
            <p className="text-muted-foreground animate-pulse">Analyzing your request and generating steps...</p>
          </div>
        )}

        {suggestions.length > 0 && !isAnalyzing && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Suggested Routine</h3>
              <Badge variant="secondary" className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                {suggestions.length} Steps Generated
              </Badge>
            </div>

            <div className="space-y-3">
              {suggestions.map((suggestion, idx) => (
                <div 
                  key={idx}
                  className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedIndices.includes(idx) 
                      ? 'border-sky-500/50 bg-sky-500/5' 
                      : 'border-border hover:border-sky-500/30'
                  }`}
                  onClick={() => {
                    setSelectedIndices(prev => 
                      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
                    )
                  }}
                >
                  <Checkbox 
                    checked={selectedIndices.includes(idx)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-foreground">{suggestion.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />
                        {suggestion.startTime} ({suggestion.duration} min)
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {(suggestion.days || []).length} days/week
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="ghost" onClick={() => setSuggestions([])}>Back</Button>
              <Button 
                onClick={handleSave}
                disabled={selectedIndices.length === 0}
                className="bg-sky-500 hover:bg-sky-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" weight="bold" />
                Add {selectedIndices.length} Activities
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
