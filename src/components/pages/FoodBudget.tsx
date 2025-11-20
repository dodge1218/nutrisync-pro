import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { ScrollArea } from '../ui/scroll-area'
import { TrendUp, TrendDown, Minus, Lightbulb, Target, ChartBar } from '@phosphor-icons/react'
import type { FoodLog } from '../../lib/nutritionEngine'
import { calculateNutrientTotals, detectNutrientGaps, performWellnessAudit } from '../../lib/nutritionEngine'
import { getNutrientDV, formatNutrientAmount, NUTRIENT_DISPLAY_NAMES, type NutrientKey } from '../../lib/dailyValues'
import GapFiller from '../GapFiller'
import NutrientTimeline from '../NutrientTimeline'

interface FoodBudgetProps {
  foodLogs: FoodLog[]
}

interface BudgetPeriod {
  label: string
  days: number
}

const BUDGET_PERIODS: BudgetPeriod[] = [
  { label: 'Today', days: 1 },
  { label: '7 Days', days: 7 },
  { label: '30 Days', days: 30 },
]

const NUTRIENT_CATEGORIES = {
  macros: ['protein', 'carbs', 'fat', 'fiber'] as NutrientKey[],
  vitamins: ['vitaminA', 'vitaminC', 'vitaminD', 'vitaminE', 'vitaminK', 'vitaminB1', 'vitaminB2', 'vitaminB3', 'vitaminB6', 'vitaminB9', 'vitaminB12'] as NutrientKey[],
  minerals: ['calcium', 'iron', 'magnesium', 'zinc', 'selenium', 'copper', 'manganese', 'potassium'] as NutrientKey[],
}

export default function FoodBudget({ foodLogs }: FoodBudgetProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7)

  const filterLogsByPeriod = (days: number) => {
    const now = new Date()
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    return foodLogs.filter(log => new Date(log.timestamp) >= cutoff)
  }

  const periodLogs = filterLogsByPeriod(selectedPeriod)
  const totals = calculateNutrientTotals(periodLogs)
  const gaps = detectNutrientGaps(totals)
  const wellness = performWellnessAudit(periodLogs, totals)

  const averagedTotals = Object.fromEntries(
    Object.entries(totals).map(([key, value]) => [key, value / selectedPeriod])
  )

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

    const dailyAverage = averagedTotals[nutrient]
    const target = getNutrientDV(nutrient)
    const percentOfDV = gap.percentOfDV
    const { status, color, trend } = getBudgetStatus(percentOfDV)

    const progressColor = 
      percentOfDV >= 100 ? 'bg-primary' :
      percentOfDV >= 80 ? 'bg-yellow-500' :
      percentOfDV >= 50 ? 'bg-orange-500' :
      'bg-destructive'

    return (
      <div key={nutrient} className="p-4 border rounded-lg space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{NUTRIENT_DISPLAY_NAMES[nutrient]}</h4>
              {getTrendIcon(trend)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Daily avg: {formatNutrientAmount(dailyAverage, nutrient)} / {formatNutrientAmount(target, nutrient)}
            </p>
          </div>
          <Badge variant={percentOfDV >= 80 ? 'default' : 'destructive'} className="ml-2">
            {Math.round(percentOfDV)}%
          </Badge>
        </div>

        <div className="space-y-1">
          <Progress value={Math.min(percentOfDV, 100)} className="h-2" />
          <div className="flex items-center justify-between text-xs">
            <span className={color}>{status}</span>
            <span className="text-muted-foreground">
              {percentOfDV >= 100 ? '+' : ''}{formatNutrientAmount(dailyAverage - target, nutrient)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  const criticalGaps = gaps.filter(g => g.severity === 'critical' && g.nutrient !== 'sodium')
  const moderateGaps = gaps.filter(g => g.severity === 'moderate' && g.nutrient !== 'sodium')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Food Budget Tracker</h2>
          <p className="text-muted-foreground mt-1">
            Track your nutrient intake over time like a financial budget
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {BUDGET_PERIODS.map(period => (
          <Button
            key={period.days}
            variant={selectedPeriod === period.days ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod(period.days)}
          >
            {period.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">GBDI Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold">{Math.round(wellness.gbdi)}</div>
              <Progress value={wellness.gbdi} className="flex-1" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Gut-Brain-Digestive Index
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Critical Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-destructive" />
              <div className="text-3xl font-bold">{criticalGaps.length}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Nutrients below 50% DV
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Plant Diversity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <ChartBar className="w-8 h-8 text-primary" />
              <div className="text-3xl font-bold">{wellness.plantDiversityCount}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Different plant foods
            </p>
          </CardContent>
        </Card>
      </div>

      {criticalGaps.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Lightbulb className="w-5 h-5" />
              Critical Deficiencies Detected
            </CardTitle>
            <CardDescription>
              These nutrients are below 50% of daily value and require immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalGaps.map(gap => {
                const deficit = getNutrientDV(gap.nutrient) - (averagedTotals[gap.nutrient] || 0)
                return (
                  <div key={gap.nutrient} className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <div>
                      <div className="font-semibold">{NUTRIENT_DISPLAY_NAMES[gap.nutrient]}</div>
                      <div className="text-sm text-muted-foreground">
                        Need {formatNutrientAmount(deficit, gap.nutrient)} more daily
                      </div>
                    </div>
                    <Badge variant="destructive">{Math.round(gap.percentOfDV)}%</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="macros">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="macros">Macros</TabsTrigger>
          <TabsTrigger value="vitamins">Vitamins</TabsTrigger>
          <TabsTrigger value="minerals">Minerals</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="macros" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {NUTRIENT_CATEGORIES.macros.map(nutrient => renderNutrientBudget(nutrient))}
          </div>
        </TabsContent>

        <TabsContent value="vitamins" className="space-y-4 mt-4">
          <ScrollArea className="h-[600px] pr-4">
            <div className="grid gap-4 md:grid-cols-2">
              {NUTRIENT_CATEGORIES.vitamins.map(nutrient => renderNutrientBudget(nutrient))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="minerals" className="space-y-4 mt-4">
          <ScrollArea className="h-[600px] pr-4">
            <div className="grid gap-4 md:grid-cols-2">
              {NUTRIENT_CATEGORIES.minerals.map(nutrient => renderNutrientBudget(nutrient))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4 mt-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Critical Nutrient Trends</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tracking your most important nutrients over {selectedPeriod} days
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {criticalGaps.slice(0, 6).map(gap => (
                  <NutrientTimeline 
                    key={gap.nutrient}
                    foodLogs={foodLogs}
                    nutrient={gap.nutrient}
                    days={selectedPeriod}
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
                      days={selectedPeriod}
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
        <Card>
          <CardHeader>
            <CardTitle>Areas for Improvement</CardTitle>
            <CardDescription>
              Nutrients between 50-80% of daily value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {moderateGaps.map(gap => (
                <div key={gap.nutrient} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">{NUTRIENT_DISPLAY_NAMES[gap.nutrient]}</span>
                  <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                    {Math.round(gap.percentOfDV)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <GapFiller gaps={gaps} />
    </div>
  )
}
