import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { ScrollArea } from '../ui/scroll-area'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { Dialog, DialogContent } from '../ui/dialog'
import { TrendUp, TrendDown, Minus, Lightbulb, Target, ChartBar, Calendar, Flame } from '@phosphor-icons/react'
import type { FoodLog } from '../../lib/nutritionEngine'
import { calculateNutrientTotals, detectNutrientGaps, performWellnessAudit } from '../../lib/nutritionEngine'
import { getNutrientDV, formatNutrientAmount, NUTRIENT_DISPLAY_NAMES, type NutrientKey } from '../../lib/dailyValues'
import GapFiller from '../GapFiller'
import NutrientTimeline from '../NutrientTimeline'
import HistoryLineGraph from '../HistoryLineGraph'
import ProfileReminder from '../ProfileReminder'
import ProfileSetup from '../ProfileSetup'
import AnimatedGut from '../AnimatedGut'
import PostWorkoutNutrition from '../PostWorkoutNutrition'
import { 
  updateHistoryData, 
  filterLogsForDate, 
  getTodayKey,
  type HistoryData 
} from '../../lib/historyTracking'
import type { ExerciseLog } from '../../lib/exerciseEngine'
import type { UserNutritionProfile } from '../../lib/personalizedNutrition'

interface FoodBudgetProps {
  foodLogs: FoodLog[]
}

const NUTRIENT_CATEGORIES = {
  macros: ['protein', 'carbs', 'fat', 'fiber'] as NutrientKey[],
  vitamins: ['vitaminA', 'vitaminC', 'vitaminD', 'vitaminE', 'vitaminK', 'vitaminB1', 'vitaminB2', 'vitaminB3', 'vitaminB6', 'vitaminB9', 'vitaminB12'] as NutrientKey[],
  minerals: ['calcium', 'iron', 'magnesium', 'zinc', 'selenium', 'copper', 'manganese', 'potassium'] as NutrientKey[],
}

export default function FoodBudget({ foodLogs }: FoodBudgetProps) {
  const [historyData, setHistoryData] = useKV<HistoryData | null>('nutrition-history', null)
  const [exerciseLogs] = useKV<ExerciseLog[]>('exercise-logs', [])
  const [profile] = useKV<UserNutritionProfile | null>('user-nutrition-profile', null)
  const [showNetCalories, setShowNetCalories] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [lastFoodType, setLastFoodType] = useState<'good' | 'neutral' | 'bad' | undefined>(undefined)

  useEffect(() => {
    const updatedHistory = updateHistoryData(historyData || null, foodLogs)
    setHistoryData(updatedHistory)
  }, [foodLogs, setHistoryData])

  useEffect(() => {
    if (foodLogs.length === 0) return
    
    const lastLog = foodLogs[foodLogs.length - 1]
    const lastLogTime = new Date(lastLog.timestamp).getTime()
    const now = Date.now()
    
    if (now - lastLogTime < 5000) {
      const totalsForLog = calculateNutrientTotals([lastLog])
      const wellnessForLog = performWellnessAudit([lastLog], totalsForLog)
      
      if (wellnessForLog.ultraProcessedBurden > 0.5 || wellnessForLog.gutStressorPresent) {
        setLastFoodType('bad')
      } else if (wellnessForLog.fermentedFoodCount > 0 || totalsForLog.fiber > 5) {
        setLastFoodType('good')
      } else {
        setLastFoodType('neutral')
      }
      
      setTimeout(() => setLastFoodType(undefined), 3000)
    }
  }, [foodLogs])

  const today = getTodayKey()
  const todayLogs = filterLogsForDate(foodLogs, today)
  const totals = calculateNutrientTotals(todayLogs)
  const gaps = detectNutrientGaps(totals)
  const wellness = performWellnessAudit(todayLogs, totals)

  const getBudgetStatus = (percentOfDV: number) => {
    if (percentOfDV < 50) return { status: 'critical', color: 'text-destructive', trend: 'deficit' }
    if (percentOfDV < 80) return { status: 'low', color: 'text-orange-600 dark:text-orange-400', trend: 'deficit' }
    if (percentOfDV < 100) return { status: 'approaching', color: 'text-yellow-600 dark:text-yellow-400', trend: 'approaching' }
    if (percentOfDV < 150) return { status: 'optimal', color: 'text-primary', trend: 'met' }
    return { status: 'excess', color: 'text-muted-foreground', trend: 'surplus' }
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'deficit') return <TrendDown className="w-4 h-4" />
    if (trend === 'surplus') return <TrendUp className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const renderNutrientBudget = (nutrient: NutrientKey) => {
    const gap = gaps.find(g => g.nutrient === nutrient)
    if (!gap) return null

    const dailyValue = totals[nutrient]
    const target = getNutrientDV(nutrient)
    const percentOfDV = gap.percentOfDV
    const { status, color, trend } = getBudgetStatus(percentOfDV)

    return (
      <div key={nutrient} className="p-4 rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm text-foreground">{NUTRIENT_DISPLAY_NAMES[nutrient]}</h4>
          </div>
          <span className={cn("text-xs font-bold", color)}>
            {Math.round(percentOfDV)}%
          </span>
        </div>

        <Progress value={Math.min(percentOfDV, 100)} className="h-2" />
        
        <div className="flex justify-between mt-2 text-xs text-muted-foreground font-medium">
          <span>{formatNutrientAmount(dailyValue, nutrient)}</span>
          <span>{formatNutrientAmount(target, nutrient)}</span>
        </div>
      </div>
    )
  }

  const criticalGaps = gaps.filter(g => g.severity === 'critical' && g.nutrient !== 'sodium')
  const moderateGaps = gaps.filter(g => g.severity === 'moderate' && g.nutrient !== 'sodium')

  const todayExerciseLogs = (exerciseLogs || []).filter(log => {
    const logDate = new Date(log.timestamp).toISOString().split('T')[0]
    return logDate === today
  })
  const todayCaloriesBurned = todayExerciseLogs.reduce((sum, log) => sum + log.caloriesBurned, 0)
  const netCalories = totals.calories - todayCaloriesBurned

  const todayDate = new Date()
  const dateString = todayDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-1">Dashboard</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-2 font-medium">
            <Calendar className="w-4 h-4" weight="duotone" />
            {dateString}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Calories</CardTitle>
              {todayCaloriesBurned > 0 && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="net-calories" className="text-xs cursor-pointer">Net</Label>
                  <Switch 
                    id="net-calories"
                    checked={showNetCalories}
                    onCheckedChange={setShowNetCalories}
                    className="scale-75"
                  />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {showNetCalories && todayCaloriesBurned > 0 
                ? Math.round(netCalories).toLocaleString() 
                : Math.round(totals.calories).toLocaleString()
              }
              <span className="text-sm font-normal text-muted-foreground ml-1">kcal</span>
            </div>
            {todayCaloriesBurned > 0 && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500" weight="fill" />
                {todayCaloriesBurned} burned
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gut Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{Math.round(wellness.gbdi)}</div>
              <Progress value={wellness.gbdi} className="flex-1 h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              GBDI Score
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-destructive" weight="fill" />
              <div className="text-2xl font-bold text-destructive">{criticalGaps.length}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Nutrients below 50% DV
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Plant Diversity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ChartBar className="w-4 h-4 text-primary" weight="fill" />
              <div className="text-2xl font-bold text-primary">{wellness.plantDiversityCount}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique plants today
            </p>
          </CardContent>
        </Card>
      </div>

      <AnimatedGut 
        gutHealthScore={wellness.gbdi}
        recentFoodType={lastFoodType}
        showDetails={true}
      />

      {historyData && historyData.dailySnapshots.length > 0 && (
        <HistoryLineGraph snapshots={historyData.dailySnapshots} />
      )}

      {criticalGaps.length > 0 && (
        <Card className="border-2 border-destructive/30 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-destructive text-lg">
              <div className="p-1.5 bg-destructive/10 rounded-lg">
                <Lightbulb className="w-5 h-5" weight="fill" />
              </div>
              Critical Deficiencies
            </CardTitle>
            <CardDescription className="text-sm">
              Below 50% of daily value - need immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalGaps.map(gap => {
                const deficit = getNutrientDV(gap.nutrient) - (totals[gap.nutrient] || 0)
                return (
                  <div key={gap.nutrient} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                    <div>
                      <div className="font-semibold text-sm text-foreground">{NUTRIENT_DISPLAY_NAMES[gap.nutrient]}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Need {formatNutrientAmount(deficit, gap.nutrient)} more
                      </div>
                    </div>
                    <Badge variant="destructive" className="px-2 py-0.5 text-xs font-bold">{Math.round(gap.percentOfDV)}%</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <PostWorkoutNutrition foodLogs={todayLogs} />

      <Tabs defaultValue="macros">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl h-11 p-1">
          <TabsTrigger value="macros" className="text-sm font-semibold">Macros</TabsTrigger>
          <TabsTrigger value="vitamins" className="text-sm font-semibold">Vitamins</TabsTrigger>
          <TabsTrigger value="minerals" className="text-sm font-semibold">Minerals</TabsTrigger>
          <TabsTrigger value="trends" className="text-sm font-semibold">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="macros" className="space-y-3 mt-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {NUTRIENT_CATEGORIES.macros.map(nutrient => renderNutrientBudget(nutrient))}
          </div>
        </TabsContent>

        <TabsContent value="vitamins" className="space-y-3 mt-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 max-h-[500px] overflow-y-auto pr-2">
            {NUTRIENT_CATEGORIES.vitamins.map(nutrient => renderNutrientBudget(nutrient))}
          </div>
        </TabsContent>

        <TabsContent value="minerals" className="space-y-3 mt-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 max-h-[500px] overflow-y-auto pr-2">
            {NUTRIENT_CATEGORIES.minerals.map(nutrient => renderNutrientBudget(nutrient))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4 mt-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold mb-2 text-foreground">Critical Nutrient Trends</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Tracking your most important nutrients over the last 7 days
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {criticalGaps.slice(0, 6).map(gap => (
                  <NutrientTimeline 
                    key={gap.nutrient}
                    foodLogs={foodLogs}
                    nutrient={gap.nutrient}
                    days={7}
                  />
                ))}
              </div>
            </div>

            {moderateGaps.length > 0 && (
              <div>
                <h3 className="text-base font-semibold mb-2 text-foreground">Moderate Deficiency Trends</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {moderateGaps.slice(0, 4).map(gap => (
                    <NutrientTimeline 
                      key={gap.nutrient}
                      foodLogs={foodLogs}
                      nutrient={gap.nutrient}
                      days={7}
                    />
                  ))}
                </div>
              </div>
            )}

            {criticalGaps.length === 0 && moderateGaps.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center">
                  <div className="text-muted-foreground">
                    <p className="text-base font-semibold mb-1 text-foreground">Excellent Work!</p>
                    <p className="text-sm">All your nutrients are at optimal levels. Keep it up!</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {moderateGaps.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground">Areas for Improvement</CardTitle>
            <CardDescription className="text-sm">
              Nutrients between 50-80% of daily value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {moderateGaps.map(gap => (
                <div key={gap.nutrient} className="flex items-center justify-between p-2.5 bg-muted/50 rounded-lg">
                  <span className="font-semibold text-sm text-foreground">{NUTRIENT_DISPLAY_NAMES[gap.nutrient]}</span>
                  <Badge variant="outline" className="bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30 px-2 py-0.5 text-xs font-bold">
                    {Math.round(gap.percentOfDV)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <GapFiller gaps={gaps} />
      
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ProfileSetup 
            initialProfile={profile || undefined}
            isUpdate={!!profile}
            onComplete={() => setShowProfileDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
