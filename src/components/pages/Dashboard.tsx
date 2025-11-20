import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Leaf, Fire, DropHalf, Sparkle } from '@phosphor-icons/react'
import { analyzeDailyIntake, type FoodLog } from '../../lib/nutritionEngine'
import { NUTRIENT_DISPLAY_NAMES, type NutrientKey } from '../../lib/dailyValues'
import GBDIDisplay from '../GBDIDisplay'
import StreakTracker from '../StreakTracker'
import AchievementsPanel from '../AchievementsPanel'
import GBDIHistory from '../GBDIHistory'
import { useKV } from '@github/spark/hooks'

interface DashboardProps {
  foodLogs: FoodLog[]
}

export default function Dashboard({ foodLogs }: DashboardProps) {
  const today = new Date().toISOString().split('T')[0]
  const todaysLogs = foodLogs.filter(log => log.timestamp.startsWith(today))
  const [previousGbdi] = useKV<number>('previous-gbdi', 0)

  const analysis = useMemo(() => {
    if (todaysLogs.length === 0) return null
    return analyzeDailyIntake(todaysLogs, { staples: true })
  }, [todaysLogs])

  if (todaysLogs.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to NutriWell</CardTitle>
            <CardDescription>
              Start by logging your first meal to see personalized nutrition insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Track your meals, discover nutrient gaps, and get actionable recommendations
              to optimize your diet for energy, gut health, and overall wellness.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analysis) return null

  const getStatusColor = (percent: number) => {
    if (percent >= 100) return 'bg-green-500'
    if (percent >= 80) return 'bg-green-400'
    if (percent >= 50) return 'bg-yellow-400'
    return 'bg-red-400'
  }

  const getStatusBadge = (percent: number) => {
    if (percent >= 100) return <Badge variant="default" className="bg-green-600">Complete</Badge>
    if (percent >= 80) return <Badge variant="secondary" className="bg-green-100 text-green-800">Good</Badge>
    if (percent >= 50) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Low</Badge>
    return <Badge variant="destructive">Critical</Badge>
  }

  const keyNutrients: NutrientKey[] = [
    'protein', 'fiber', 'vitaminC', 'vitaminD', 'iron', 'magnesium', 'potassium', 'calcium'
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <GBDIDisplay 
          gbdi={analysis.wellnessAudit.gbdi}
          previousGbdi={previousGbdi}
          fermentedFoodCount={analysis.wellnessAudit.fermentedFoodCount}
          plantDiversityCount={analysis.wellnessAudit.plantDiversityCount}
          ultraProcessedBurden={analysis.wellnessAudit.ultraProcessedBurden}
          gutStressorPresent={analysis.wellnessAudit.gutStressorPresent}
        />
        <StreakTracker foodLogs={foodLogs} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories</CardTitle>
            <Fire className="h-4 w-4 text-muted-foreground" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(analysis.totals.calories)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((analysis.totals.calories / 2000) * 100)}% of 2000 kcal target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gut Support Score</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(analysis.gutSupportScore)}/100</div>
            <p className="text-xs text-muted-foreground">
              {analysis.wellnessAudit.fermentedFoodCount} fermented foods today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adrenal Load</CardTitle>
            <DropHalf className="h-4 w-4 text-muted-foreground" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(analysis.wellnessAudit.adrenalLoad)}/100</div>
            <p className="text-xs text-muted-foreground">
              {analysis.wellnessAudit.adrenalLoad > 60 ? 'High stress load' : 'Manageable'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mineral Trio</CardTitle>
            <Sparkle className="h-4 w-4 text-muted-foreground" weight="fill" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(analysis.wellnessAudit.mineralTrioSufficiency)}%</div>
            <p className="text-xs text-muted-foreground">
              Ca, Mg, K balance
            </p>
          </CardContent>
        </Card>
      </div>

      {analysis.topFixes.length > 0 && (
        <Alert className="border-primary/20 bg-primary/5">
          <Sparkle className="h-4 w-4 text-primary" weight="fill" />
          <AlertTitle>Top 3 Fixes for Today</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              {analysis.topFixes.map((fix, index) => (
                <li key={index} className="text-sm">{fix}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <AchievementsPanel 
        foodLogs={foodLogs}
        gbdi={analysis.wellnessAudit.gbdi}
        fermentedFoodCount={analysis.wellnessAudit.fermentedFoodCount}
        plantDiversityCount={analysis.wellnessAudit.plantDiversityCount}
      />

      <GBDIHistory 
        currentGbdi={analysis.wellnessAudit.gbdi}
        currentDate={today}
      />

      <Card>
        <CardHeader>
          <CardTitle>Key Nutrients</CardTitle>
          <CardDescription>
            % of Daily Value achieved for essential nutrients
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {keyNutrients.map(nutrient => {
            const gap = analysis.gaps.find(g => g.nutrient === nutrient)
            if (!gap) return null

            return (
              <div key={nutrient} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{NUTRIENT_DISPLAY_NAMES[nutrient]}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {Math.round(gap.percentOfDV)}%
                    </span>
                    {getStatusBadge(gap.percentOfDV)}
                  </div>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div 
                    className={`h-full transition-all ${getStatusColor(gap.percentOfDV)}`}
                    style={{ width: `${Math.min(gap.percentOfDV, 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Wellness Audit</CardTitle>
            <CardDescription>Today's wellness metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Fermented Foods</span>
              <span className="text-sm font-medium">{analysis.wellnessAudit.fermentedFoodCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Plant Diversity</span>
              <span className="text-sm font-medium">{analysis.wellnessAudit.plantDiversityCount} varieties</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Warm Food Ratio</span>
              <span className="text-sm font-medium">{Math.round(analysis.wellnessAudit.warmFoodRatio)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Mineral Trio Sufficiency</span>
              <span className="text-sm font-medium">{Math.round(analysis.wellnessAudit.mineralTrioSufficiency)}%</span>
            </div>
            {analysis.wellnessAudit.gutStressorPresent && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription className="text-xs">
                  Gut stressors detected in today's meals
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {analysis.stapleCompliance && (
          <Card>
            <CardHeader>
              <CardTitle>Staple Compliance</CardTitle>
              <CardDescription>Weekly staple food targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Liver (2-3x/week)</span>
                <Badge variant={analysis.stapleCompliance.liver.met ? 'default' : 'secondary'}>
                  {analysis.stapleCompliance.liver.actual}x this period
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cultured Dairy (2x/week)</span>
                <Badge variant={analysis.stapleCompliance.culturedDairy.met ? 'default' : 'secondary'}>
                  {analysis.stapleCompliance.culturedDairy.actual}x this period
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pumpkin Seeds (daily)</span>
                <Badge variant={analysis.stapleCompliance.pumpkinSeeds.met ? 'default' : 'secondary'}>
                  {analysis.stapleCompliance.pumpkinSeeds.actual}x today
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Macros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{Math.round(analysis.totals.protein)}g</div>
              <div className="text-xs text-muted-foreground">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{Math.round(analysis.totals.carbs)}g</div>
              <div className="text-xs text-muted-foreground">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{Math.round(analysis.totals.fat)}g</div>
              <div className="text-xs text-muted-foreground">Fat</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
