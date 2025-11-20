import { useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { 
  ChartLine, 
  TrendUp, 
  TrendDown, 
  Warning,
  Lightning,
  Sparkle
} from '@phosphor-icons/react'
import type { StressLog } from './StressTracker'
import type { FoodLog, NutrientTotals } from '../lib/nutritionEngine'
import { analyzeDailyIntake } from '../lib/nutritionEngine'
import { getNutrientDV } from '../lib/dailyValues'

interface StressHistoryProps {
  foodLogs: FoodLog[]
  daysToShow?: number
}

interface DayData {
  date: string
  stressLog?: StressLog
  nutrients?: NutrientTotals
  adrenalScore?: number
}

export default function StressHistory({ foodLogs, daysToShow = 7 }: StressHistoryProps) {
  const [stressLogs] = useKV<StressLog[]>('stress-logs', [])

  const historyData = useMemo(() => {
    const data: DayData[] = []
    const today = new Date()

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const dayStressLog = stressLogs?.find(log => log.timestamp.startsWith(dateStr))
      const dayFoodLogs = foodLogs.filter(log => log.timestamp.startsWith(dateStr))
      
      let nutrients: NutrientTotals | undefined
      if (dayFoodLogs.length > 0) {
        const analysis = analyzeDailyIntake(dayFoodLogs)
        nutrients = analysis.totals
      }

      data.push({
        date: dateStr,
        stressLog: dayStressLog,
        nutrients,
        adrenalScore: dayStressLog ? calculateSimpleAdrenalScore(dayStressLog) : undefined
      })
    }

    return data
  }, [stressLogs, foodLogs, daysToShow])

  const patterns = useMemo(() => {
    const insights: string[] = []
    const logsWithStress = historyData.filter(d => d.stressLog)

    if (logsWithStress.length === 0) {
      return []
    }

    const consecutiveHighStress = historyData.reduce((count, day, idx) => {
      if (day.stressLog && day.stressLog.stressLevel >= 7) {
        return count + 1
      }
      return idx > 0 && historyData[idx - 1].stressLog?.stressLevel ? count : 0
    }, 0)

    if (consecutiveHighStress >= 3) {
      insights.push(`⚠️ High stress detected for ${consecutiveHighStress} consecutive days. Consider stress management techniques and supportive nutrition.`)
    }

    const avgStress = logsWithStress.reduce((sum, d) => sum + (d.stressLog?.stressLevel || 0), 0) / logsWithStress.length
    const avgSleep = logsWithStress.reduce((sum, d) => sum + (d.stressLog?.sleepQuality || 0), 0) / logsWithStress.length
    const avgEnergy = logsWithStress.reduce((sum, d) => sum + (d.stressLog?.energyLevel || 0), 0) / logsWithStress.length

    if (avgStress > 6 && avgSleep < 6) {
      insights.push('📊 Pattern detected: High stress correlates with poor sleep. Prioritize sleep hygiene and evening magnesium.')
    }

    if (avgEnergy < 5 && avgStress > 6) {
      insights.push('📊 Pattern detected: High stress + low energy. Focus on protein-rich breakfast and B-vitamin foods.')
    }

    const lowMagnesiumDays = historyData.filter(d => {
      if (!d.nutrients) return false
      const mgPercent = (d.nutrients.magnesium / getNutrientDV('magnesium')) * 100
      return mgPercent < 70 && d.stressLog && d.stressLog.stressLevel >= 6
    }).length

    if (lowMagnesiumDays >= 2) {
      insights.push('📊 Correlation found: High stress days often have low magnesium intake. Add pumpkin seeds, dark chocolate, or spinach daily.')
    }

    const highCaffeineLowEnergyDays = historyData.filter(d => {
      if (!d.nutrients || !d.stressLog) return false
      return d.stressLog.energyLevel < 5
    }).length

    if (highCaffeineLowEnergyDays >= 2 && avgEnergy < 6) {
      insights.push('📊 Low energy persists despite diet. Consider sleep quality, hydration, and cortisol regulation foods.')
    }

    if (insights.length === 0 && logsWithStress.length >= 3) {
      insights.push('✅ No major stress patterns detected. Your stress levels appear well-managed.')
    }

    return insights
  }, [historyData])

  const getStressColor = (level: number) => {
    if (level <= 3) return 'text-green-600'
    if (level <= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSleepColor = (quality: number) => {
    if (quality >= 7) return 'text-green-600'
    if (quality >= 5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getEnergyColor = (level: number) => {
    if (level >= 7) return 'text-green-600'
    if (level >= 5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const hasAnyStressData = historyData.some(d => d.stressLog)

  if (!hasAnyStressData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartLine className="w-5 h-5 text-primary" />
            Stress Pattern History
          </CardTitle>
          <CardDescription>
            Track stress trends over time to identify patterns and correlations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Start logging your daily stress, sleep, and energy levels to see patterns and insights.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {patterns.length > 0 && (
        <Alert className="border-primary/30 bg-primary/5">
          <Sparkle className="h-4 w-4 text-primary" weight="fill" />
          <AlertTitle>Stress Pattern Insights</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-2">
              {patterns.map((pattern, idx) => (
                <li key={idx} className="text-sm">{pattern}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartLine className="w-5 h-5 text-primary" />
            {daysToShow}-Day Stress Tracking
          </CardTitle>
          <CardDescription>
            Your stress, sleep, and energy levels over the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {historyData.map((day) => (
              <div key={day.date} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{formatDate(day.date)}</div>
                  {day.stressLog ? (
                    <Badge variant="outline">Logged</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">No data</Badge>
                  )}
                </div>

                {day.stressLog ? (
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Stress Level</p>
                      <div className="flex items-center gap-2">
                        <p className={`text-2xl font-bold ${getStressColor(day.stressLog.stressLevel)}`}>
                          {day.stressLog.stressLevel}
                        </p>
                        <p className="text-xs text-muted-foreground">/10</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Sleep Quality</p>
                      <div className="flex items-center gap-2">
                        <p className={`text-2xl font-bold ${getSleepColor(day.stressLog.sleepQuality)}`}>
                          {day.stressLog.sleepQuality}
                        </p>
                        <p className="text-xs text-muted-foreground">/10</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Energy Level</p>
                      <div className="flex items-center gap-2">
                        <p className={`text-2xl font-bold ${getEnergyColor(day.stressLog.energyLevel)}`}>
                          {day.stressLog.energyLevel}
                        </p>
                        <p className="text-xs text-muted-foreground">/10</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No stress data logged for this day</p>
                )}

                {day.stressLog && (day.stressLog.physicalSymptoms.length > 0 || day.stressLog.mentalSymptoms.length > 0) && (
                  <div className="mt-3 pt-3 border-t space-y-2">
                    {day.stressLog.physicalSymptoms.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Physical Symptoms:</p>
                        <div className="flex gap-1 flex-wrap">
                          {day.stressLog.physicalSymptoms.map(symptom => (
                            <Badge key={symptom} variant="outline" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {day.stressLog.mentalSymptoms.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Mental Symptoms:</p>
                        <div className="flex gap-1 flex-wrap">
                          {day.stressLog.mentalSymptoms.map(symptom => (
                            <Badge key={symptom} variant="outline" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {day.stressLog?.notes && (
                  <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                    <p className="text-xs text-muted-foreground mb-1">Notes:</p>
                    <p>{day.stressLog.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function calculateSimpleAdrenalScore(stressLog: StressLog): number {
  let score = 0
  score += stressLog.stressLevel * 10
  score += (10 - stressLog.sleepQuality) * 4
  score += (10 - stressLog.energyLevel) * 3
  score += stressLog.physicalSymptoms.length * 3
  score += stressLog.mentalSymptoms.length * 3
  return Math.min(100, score)
}
