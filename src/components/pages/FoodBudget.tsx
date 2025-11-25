import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
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
    if (percentOfDV < 80) return { status: 'low', color: 'text-orange-600', trend: 'deficit' }
    if (percentOfDV < 100) return { status: 'approaching', color: 'text-yellow-600', trend: 'approaching' }
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
      <div key={nutrient} className="p-5 border-2 rounded-xl space-y-3 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-card to-muted/20">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-base">{NUTRIENT_DISPLAY_NAMES[nutrient]}</h4>
              <span className={color}>{getTrendIcon(trend)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">
              Today: {formatNutrientAmount(dailyValue, nutrient)} / {formatNutrientAmount(target, nutrient)}
            </p>
          </div>
          <Badge variant={percentOfDV >= 80 ? 'default' : 'destructive'} className="ml-2 px-3 py-1 text-sm font-semibold">
            {Math.round(percentOfDV)}%
          </Badge>
        </div>

        <div className="space-y-2">
          <Progress value={Math.min(percentOfDV, 100)} className="h-3" />
          <div className="flex items-center justify-between text-sm">
            <span className={`${color} font-medium capitalize`}>{status}</span>
            <span className="text-muted-foreground font-medium">
              {percentOfDV >= 100 ? '+' : ''}{formatNutrientAmount(dailyValue - target, nutrient)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  const criticalGaps = gaps.filter(g => g.severity === 'critical' && g.nutrient !== 'sodium')
  const moderateGaps = gaps.filter(g => g.severity === 'moderate' && g.nutrient !== 'sodium')

  const todayExerciseLogs = (exerciseLogs || []).filter(log => log.date === today)
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
    <div className="space-y-8">
      <ProfileReminder onUpdateClick={() => setShowProfileDialog(true)} />
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-foreground">Dashboard</h2>
          <p className="text-base text-muted-foreground mt-2 flex items-center gap-2">
            <Calendar className="w-5 h-5" weight="fill" />
            {dateString}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-primary/5">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Calories</CardTitle>
              {todayCaloriesBurned > 0 && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="net-calories" className="text-xs cursor-pointer">Net</Label>
                  <Switch 
                    id="net-calories"
                    checked={showNetCalories}
                    onCheckedChange={setShowNetCalories}
                  />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold text-primary">
                  {showNetCalories && todayCaloriesBurned > 0 
                    ? Math.round(netCalories).toLocaleString() 
                    : Math.round(totals.calories).toLocaleString()
                  }
                </div>
                <span className="text-base text-muted-foreground font-medium">kcal</span>
              </div>
              {todayCaloriesBurned > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Flame className="w-4 h-4 text-orange-600" weight="fill" />
                  <span>
                    {showNetCalories 
                      ? `${Math.round(totals.calories)} - ${todayCaloriesBurned} burned`
                      : `${todayCaloriesBurned} burned from exercise`
                    }
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-secondary/5">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">GBDI Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-secondary">{Math.round(wellness.gbdi)}</div>
              <Progress value={wellness.gbdi} className="flex-1 h-3" />
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Gut-Brain-Digestive Index
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-destructive/5">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Critical Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-xl">
                <Target className="w-8 h-8 text-destructive" weight="fill" />
              </div>
              <div className="text-4xl font-bold text-destructive">{criticalGaps.length}</div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Nutrients below 50% DV
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-accent/5">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Plant Diversity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-xl">
                <ChartBar className="w-8 h-8 text-accent" weight="fill" />
              </div>
              <div className="text-4xl font-bold text-accent">{wellness.plantDiversityCount}</div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Different plant foods today
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
        <Card className="border-2 border-destructive/30 bg-gradient-to-br from-card to-destructive/10 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-destructive text-xl">
              <div className="p-2 bg-destructive/15 rounded-xl">
                <Lightbulb className="w-6 h-6" weight="fill" />
              </div>
              Critical Deficiencies Detected
            </CardTitle>
            <CardDescription className="text-base">
              These nutrients are below 50% of daily value and require immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalGaps.map(gap => {
                const deficit = getNutrientDV(gap.nutrient) - (totals[gap.nutrient] || 0)
                return (
                  <div key={gap.nutrient} className="flex items-center justify-between p-4 bg-background rounded-xl border border-destructive/20 shadow-sm">
                    <div>
                      <div className="font-semibold text-base">{NUTRIENT_DISPLAY_NAMES[gap.nutrient]}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        Need {formatNutrientAmount(deficit, gap.nutrient)} more today
                      </div>
                    </div>
                    <Badge variant="destructive" className="px-3 py-1.5 text-sm font-bold">{Math.round(gap.percentOfDV)}%</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <PostWorkoutNutrition foodLogs={todayLogs} />

      <Tabs defaultValue="macros">
        <TabsList className="grid grid-cols-4 w-full max-w-3xl h-14 p-1.5">
          <TabsTrigger value="macros" className="text-base font-semibold">Macros</TabsTrigger>
          <TabsTrigger value="vitamins" className="text-base font-semibold">Vitamins</TabsTrigger>
          <TabsTrigger value="minerals" className="text-base font-semibold">Minerals</TabsTrigger>
          <TabsTrigger value="trends" className="text-base font-semibold">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="macros" className="space-y-4 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {NUTRIENT_CATEGORIES.macros.map(nutrient => renderNutrientBudget(nutrient))}
          </div>
        </TabsContent>

        <TabsContent value="vitamins" className="space-y-4 mt-6">
          <ScrollArea className="h-[600px] pr-4">
            <div className="grid gap-6 md:grid-cols-2">
              {NUTRIENT_CATEGORIES.vitamins.map(nutrient => renderNutrientBudget(nutrient))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="minerals" className="space-y-4 mt-6">
          <ScrollArea className="h-[600px] pr-4">
            <div className="grid gap-6 md:grid-cols-2">
              {NUTRIENT_CATEGORIES.minerals.map(nutrient => renderNutrientBudget(nutrient))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4 mt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Critical Nutrient Trends</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tracking your most important nutrients over the last 7 days
              </p>
              <div className="grid gap-4 md:grid-cols-2">
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
                <h3 className="text-lg font-semibold mb-3">Moderate Deficiency Trends</h3>
                <div className="grid gap-4 md:grid-cols-2">
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
                <CardContent className="py-12 text-center">
                  <div className="text-muted-foreground">
                    <p className="text-lg font-semibold mb-2">Excellent Work!</p>
                    <p>All your nutrients are at optimal levels. Keep it up!</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {moderateGaps.length > 0 && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Areas for Improvement</CardTitle>
            <CardDescription className="text-base">
              Nutrients between 50-80% of daily value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {moderateGaps.map(gap => (
                <div key={gap.nutrient} className="flex items-center justify-between p-4 bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <span className="font-semibold text-base">{NUTRIENT_DISPLAY_NAMES[gap.nutrient]}</span>
                  <Badge variant="outline" className="bg-orange-500/15 text-orange-700 border-orange-500/30 px-3 py-1 text-sm font-bold">
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
