import { useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendUp, TrendDown, Minus, Sparkle, Info } from '@phosphor-icons/react'
import type { FoodLog } from '../lib/nutritionEngine'
import type { StressLog } from './StressTracker'
import { analyzeDailyIntake } from '../lib/nutritionEngine'

interface HealthCorrelationsProps {
  foodLogs: FoodLog[]
  daysToShow?: number
}

interface DayData {
  date: string
  displayDate: string
  gbdi: number
  stressLevel: number
  sleepQuality: number
  energyLevel: number
  fiber: number
  magnesium: number
}

interface Correlation {
  metric1: string
  metric2: string
  strength: 'strong' | 'moderate' | 'weak'
  direction: 'positive' | 'negative'
  insight: string
}

export default function HealthCorrelations({ foodLogs, daysToShow = 7 }: HealthCorrelationsProps) {
  const [stressLogs] = useKV<StressLog[]>('stress-logs', [])

  const chartData = useMemo(() => {
    const data: DayData[] = []
    const today = new Date()
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      
      const dayLogs = foodLogs.filter(log => log.timestamp.startsWith(dateStr))
      const stressLog = stressLogs?.find(log => log.timestamp.startsWith(dateStr))
      
      let gbdi = 0
      let fiber = 0
      let magnesium = 0
      
      if (dayLogs.length > 0) {
        const analysis = analyzeDailyIntake(dayLogs, { staples: true })
        gbdi = analysis.wellnessAudit.gbdi
        fiber = analysis.totals.fiber || 0
        
        const magnesiumGap = analysis.gaps.find(g => g.nutrient === 'magnesium')
        magnesium = magnesiumGap?.percentOfDV || 0
      }
      
      data.push({
        date: dateStr,
        displayDate,
        gbdi,
        stressLevel: stressLog?.stressLevel || 0,
        sleepQuality: stressLog?.sleepQuality || 0,
        energyLevel: stressLog?.energyLevel || 0,
        fiber,
        magnesium
      })
    }
    
    return data
  }, [foodLogs, stressLogs, daysToShow])

  const correlations = useMemo(() => {
    const results: Correlation[] = []
    const validData = chartData.filter(d => d.gbdi > 0 && d.stressLevel > 0)
    
    if (validData.length < 3) return results

    const avgGbdi = validData.reduce((sum, d) => sum + d.gbdi, 0) / validData.length
    const avgStress = validData.reduce((sum, d) => sum + d.stressLevel, 0) / validData.length
    const avgSleep = validData.reduce((sum, d) => sum + d.sleepQuality, 0) / validData.length
    const avgEnergy = validData.reduce((sum, d) => sum + d.energyLevel, 0) / validData.length
    const avgMagnesium = validData.reduce((sum, d) => sum + d.magnesium, 0) / validData.length

    const highStressDays = validData.filter(d => d.stressLevel > 7)
    const lowSleepDays = validData.filter(d => d.sleepQuality < 5)
    const lowEnergyDays = validData.filter(d => d.energyLevel < 5)
    const lowGbdiDays = validData.filter(d => d.gbdi < 65)
    const lowMagnesiumDays = validData.filter(d => d.magnesium < 75)

    if (highStressDays.length > 0 && lowGbdiDays.length > 0) {
      const overlap = highStressDays.filter(d1 => 
        lowGbdiDays.some(d2 => d2.date === d1.date)
      ).length
      
      if (overlap >= highStressDays.length * 0.6) {
        results.push({
          metric1: 'High Stress',
          metric2: 'Low Gut Health',
          strength: 'strong',
          direction: 'negative',
          insight: 'High stress days often correlate with lower GBDI scores. Focus on stress-reducing foods and gut support.'
        })
      }
    }

    if (lowSleepDays.length > 0 && lowEnergyDays.length > 0) {
      const overlap = lowSleepDays.filter(d1 => 
        lowEnergyDays.some(d2 => d2.date === d1.date)
      ).length
      
      if (overlap >= lowSleepDays.length * 0.7) {
        results.push({
          metric1: 'Poor Sleep',
          metric2: 'Low Energy',
          strength: 'strong',
          direction: 'negative',
          insight: 'Poor sleep quality strongly impacts energy levels. Prioritize earlier meal timing and sleep-supportive nutrients.'
        })
      }
    }

    if (highStressDays.length > 0 && lowMagnesiumDays.length > 0) {
      const overlap = highStressDays.filter(d1 => 
        lowMagnesiumDays.some(d2 => d2.date === d1.date)
      ).length
      
      if (overlap >= highStressDays.length * 0.6) {
        results.push({
          metric1: 'High Stress',
          metric2: 'Low Magnesium',
          strength: 'moderate',
          direction: 'negative',
          insight: 'Stress often depletes magnesium. Add pumpkin seeds, dark leafy greens, or dark chocolate to support stress resilience.'
        })
      }
    }

    const gbdiTrend = validData[validData.length - 1].gbdi - validData[0].gbdi
    const stressTrend = validData[validData.length - 1].stressLevel - validData[0].stressLevel
    
    if (gbdiTrend > 5 && stressTrend < -1) {
      results.push({
        metric1: 'Improving Gut Health',
        metric2: 'Decreasing Stress',
        strength: 'moderate',
        direction: 'positive',
        insight: 'Your gut health is improving as stress decreases. The gut-brain axis is working in your favor!'
      })
    } else if (gbdiTrend < -5 && stressTrend > 1) {
      results.push({
        metric1: 'Declining Gut Health',
        metric2: 'Increasing Stress',
        strength: 'moderate',
        direction: 'negative',
        insight: 'Rising stress may be impacting gut health. Consider stress-management practices and gut-supportive foods.'
      })
    }

    if (avgGbdi > 75 && avgEnergy > 7) {
      results.push({
        metric1: 'High Gut Health',
        metric2: 'High Energy',
        strength: 'strong',
        direction: 'positive',
        insight: 'Excellent gut health correlates with sustained energy. Keep up your current eating patterns!'
      })
    }

    return results
  }, [chartData])

  const hasData = chartData.some(d => d.gbdi > 0 || d.stressLevel > 0)

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkle className="w-5 h-5 text-primary" weight="fill" />
            Health Correlations
          </CardTitle>
          <CardDescription>
            Discover connections between gut health, stress, sleep, and nutrients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Not enough data yet</AlertTitle>
            <AlertDescription>
              Log meals and track stress for a few days to see patterns and correlations between your metrics.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'moderate': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'weak': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDirectionIcon = (direction: string) => {
    if (direction === 'positive') {
      return <TrendUp className="w-4 h-4 text-green-600" weight="bold" />
    } else {
      return <TrendDown className="w-4 h-4 text-orange-600" weight="bold" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkle className="w-5 h-5 text-primary" weight="fill" />
          Health Correlations & Patterns
        </CardTitle>
        <CardDescription>
          Discover connections between gut health, stress, sleep, and energy over the last {daysToShow} days
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="displayDate" 
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
              />
              <Line 
                type="monotone" 
                dataKey="gbdi" 
                stroke="oklch(0.42 0.19 160)" 
                strokeWidth={2}
                name="Gut Health (GBDI)"
                dot={{ fill: 'oklch(0.42 0.19 160)', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="stressLevel" 
                stroke="oklch(0.60 0.22 25)" 
                strokeWidth={2}
                name="Stress Level (×10)"
                dot={{ fill: 'oklch(0.60 0.22 25)', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="sleepQuality" 
                stroke="oklch(0.70 0.15 150)" 
                strokeWidth={2}
                name="Sleep Quality (×10)"
                dot={{ fill: 'oklch(0.70 0.15 150)', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="energyLevel" 
                stroke="oklch(0.828 0.189 84.429)" 
                strokeWidth={2}
                name="Energy Level (×10)"
                dot={{ fill: 'oklch(0.828 0.189 84.429)', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {correlations.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Detected Patterns</h4>
            {correlations.map((corr, idx) => (
              <Alert key={idx} className="border-l-4" style={{ borderLeftColor: corr.direction === 'positive' ? 'oklch(0.42 0.19 160)' : 'oklch(0.60 0.22 25)' }}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getDirectionIcon(corr.direction)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <AlertTitle className="text-sm font-semibold flex items-center gap-2">
                      {corr.metric1} ↔ {corr.metric2}
                      <Badge variant="outline" className={getStrengthColor(corr.strength)}>
                        {corr.strength} correlation
                      </Badge>
                    </AlertTitle>
                    <AlertDescription className="text-sm">
                      {corr.insight}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        ) : (
          <Alert>
            <Minus className="h-4 w-4" />
            <AlertTitle>No strong patterns detected yet</AlertTitle>
            <AlertDescription>
              Continue logging consistently for a few more days to uncover meaningful correlations.
            </AlertDescription>
          </Alert>
        )}

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            <Info className="inline w-3 h-3 mr-1" />
            Stress, sleep, and energy are scaled by 10 to fit on the same chart as GBDI (0-100 scale)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
