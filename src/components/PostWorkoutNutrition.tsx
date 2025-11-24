import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { 
  Barbell,
  Clock,
  Fire,
  Lightbulb,
  Drop,
  CheckCircle
} from '@phosphor-icons/react'
import type { FoodLog } from '@/lib/nutritionEngine'
import type { ExerciseLog } from '@/lib/exerciseEngine'
import {
  getPostWorkoutMealSuggestions,
  analyzeProteinDistribution
} from '@/lib/postWorkoutEngine'
import { getDateKey } from '@/lib/historyTracking'

export default function PostWorkoutNutrition({ foodLogs }: { foodLogs: FoodLog[] }) {
  const [exerciseLogs] = useKV<ExerciseLog[]>('exercise-logs', [])

  const logs = exerciseLogs || []
  const todayKey = getDateKey(new Date())
  const todayExercises = logs.filter(log => log.date === todayKey)
  const todayFoodLogs = foodLogs.filter(log => {
    const logDate = new Date(log.timestamp)
    return getDateKey(logDate) === todayKey
  })

  const postWorkoutRec = getPostWorkoutMealSuggestions(todayExercises, todayFoodLogs)
  const proteinDist = analyzeProteinDistribution(todayFoodLogs)

  if (!postWorkoutRec && !proteinDist.recommendation) {
    return null
  }

  return (
    <div className="space-y-4">
      {postWorkoutRec && (
        <Card className="border-accent/40 bg-accent/5">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Barbell className="w-5 h-5 text-accent" />
                  Post-Workout Nutrition
                </CardTitle>
                <CardDescription>
                  Optimized recovery for your recent workout
                </CardDescription>
              </div>
              <Badge className="bg-accent text-accent-foreground">
                {postWorkoutRec.mealType === 'meal' ? 'Full Meal' : 'Snack'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-background rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Clock className="w-4 h-4" />
                  Timing
                </div>
                <p className="font-semibold text-sm">{postWorkoutRec.timing}</p>
              </div>
              <div className="p-3 bg-background rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Fire className="w-4 h-4" />
                  Calories
                </div>
                <p className="font-semibold text-sm">{postWorkoutRec.calories} cal</p>
              </div>
              <div className="p-3 bg-background rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <Barbell className="w-4 h-4" />
                  Protein
                </div>
                <p className="font-semibold text-sm">{postWorkoutRec.protein}g</p>
              </div>
              <div className="p-3 bg-background rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                  <CheckCircle className="w-4 h-4" />
                  Carbs
                </div>
                <p className="font-semibold text-sm">{postWorkoutRec.carbs}g</p>
              </div>
            </div>

            <div className="p-4 bg-background rounded-lg">
              <div className="flex items-start gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm mb-1">Why this matters</p>
                  <p className="text-sm text-muted-foreground">{postWorkoutRec.rationale}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Suggested Meals & Snacks
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {postWorkoutRec.suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-background rounded-lg border border-border hover:border-accent/40 transition-colors"
                  >
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Drop className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-blue-900 mb-1">Hydration</p>
                  <p className="text-sm text-blue-800">{postWorkoutRec.hydration}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {proteinDist.recommendation && (
        <Card className="border-primary/40 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Barbell className="w-5 h-5 text-primary" />
              Protein Distribution Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="text-center p-2 bg-background rounded">
                <p className="text-xs text-muted-foreground">Breakfast</p>
                <p className="font-semibold">{proteinDist.breakfast.toFixed(0)}g</p>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <p className="text-xs text-muted-foreground">Lunch</p>
                <p className="font-semibold">{proteinDist.lunch.toFixed(0)}g</p>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <p className="text-xs text-muted-foreground">Dinner</p>
                <p className="font-semibold">{proteinDist.dinner.toFixed(0)}g</p>
              </div>
              <div className="text-center p-2 bg-background rounded">
                <p className="text-xs text-muted-foreground">Snacks</p>
                <p className="font-semibold">{proteinDist.snacks.toFixed(0)}g</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-background rounded-lg">
              <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{proteinDist.recommendation}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
