import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import {
  Lightning,
  TrendUp,
  Sparkle,
  Moon,
  Leaf,
  CalendarBlank,
  CheckCircle
} from '@phosphor-icons/react'

interface CrossModeSynergiesProps {
  foodLogs: any[]
  stressLogs?: any[]
  schedules?: any[]
}

export default function CrossModeSynergies({
  foodLogs,
  stressLogs,
  schedules
}: CrossModeSynergiesProps) {
  const insights = generateInsights(foodLogs, stressLogs, schedules)

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkle className="w-5 h-5 text-primary" />
            <CardTitle>Cross-Mode Synergies</CardTitle>
          </div>
          <CardDescription>
            Insights connecting your nutrition, sleep, and scheduling habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Keep logging across all three modes to discover personalized synergies and patterns.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkle className="w-5 h-5 text-primary" />
          <CardTitle>Cross-Mode Synergies</CardTitle>
        </div>
        <CardDescription>
          Insights connecting your nutrition, sleep, and scheduling habits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <Alert key={index} className={`border-l-4 ${getBorderColor(insight.type)}`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getIcon(insight.modes)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm">{insight.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {insight.confidence}% confidence
                  </Badge>
                </div>
                <AlertDescription className="text-sm">
                  {insight.description}
                </AlertDescription>
                {insight.action && (
                  <div className="mt-2 p-2 rounded-md bg-primary/5 border border-primary/20">
                    <p className="text-xs font-medium text-primary flex items-center gap-1">
                      <TrendUp className="w-3 h-3" />
                      {insight.action}
                    </p>
                  </div>
                )}
                <div className="flex gap-1 mt-2">
                  {insight.modes.map(mode => (
                    <Badge key={mode} variant="outline" className="text-xs">
                      {mode === 'nutriwell' && <Leaf className="w-3 h-3 mr-1" />}
                      {mode === 'sleepsync' && <Moon className="w-3 h-3 mr-1" />}
                      {mode === 'lifeflow' && <CalendarBlank className="w-3 h-3 mr-1" />}
                      {mode}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  )
}

interface Insight {
  type: 'correlation' | 'recommendation' | 'celebration'
  title: string
  description: string
  confidence: number
  modes: string[]
  action?: string
}

function generateInsights(
  foodLogs: any[],
  stressLogs: any[] = [],
  schedules: any[] = []
): Insight[] {
  const insights: Insight[] = []

  const last7Days = getLast7Days()
  const logsPerDay = last7Days.map(date => 
    foodLogs.filter(log => log.timestamp.startsWith(date)).length
  )

  const avgLogsPerDay = logsPerDay.reduce((a, b) => a + b, 0) / logsPerDay.length

  if (avgLogsPerDay >= 2 && schedules.length >= 3) {
    insights.push({
      type: 'celebration',
      title: 'Consistent Multi-Mode Usage',
      description: 'You are actively using NutriWell and LifeFlow together. This holistic approach helps you see connections between nutrition and daily activities.',
      confidence: 90,
      modes: ['nutriwell', 'lifeflow']
    })
  }

  if (stressLogs.length >= 3) {
    const recentStress = stressLogs.slice(0, 3)
    const avgStress = recentStress.reduce((sum, log) => sum + (log.stressLevel || 5), 0) / recentStress.length
    
    const recentLogs = foodLogs.filter(log => {
      const logDate = new Date(log.timestamp)
      const daysDiff = (Date.now() - logDate.getTime()) / (1000 * 60 * 60 * 24)
      return daysDiff <= 3
    })

    let fermentedCount = 0
    let fiberTotal = 0

    recentLogs.forEach(log => {
      if (log.food.tags?.includes('fermented')) fermentedCount++
      fiberTotal += (log.food.fiber || 0) * log.quantity
    })

    if (avgStress >= 6 && fermentedCount < 2) {
      insights.push({
        type: 'recommendation',
        title: 'High Stress + Low Gut Support',
        description: 'Your recent stress levels are elevated, and gut-supporting fermented foods are low. The gut-brain axis is a key pathway for managing stress.',
        confidence: 75,
        modes: ['nutriwell', 'lifeflow'],
        action: 'Add kefir, sauerkraut, or kimchi to meals. Schedule dedicated meal prep time in LifeFlow.'
      })
    }

    if (avgStress <= 4 && fermentedCount >= 3) {
      insights.push({
        type: 'celebration',
        title: 'Gut Health Supports Stress Resilience',
        description: 'Your consistent consumption of fermented foods coincides with lower stress levels. The gut-brain connection is working in your favor!',
        confidence: 80,
        modes: ['nutriwell', 'lifeflow']
      })
    }
  }

  const last3DaysLogs = foodLogs.filter(log => {
    const logDate = new Date(log.timestamp)
    const daysDiff = (Date.now() - logDate.getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 3
  })

  let proteinTotal = 0
  last3DaysLogs.forEach(log => {
    proteinTotal += (log.food.protein || 0) * log.quantity
  })
  const avgProteinPerDay = proteinTotal / 3

  if (schedules.length >= 3) {
    const recentSchedules = schedules.slice(0, 3)
    let exerciseCount = 0
    recentSchedules.forEach(schedule => {
      if (schedule.activities?.some((a: any) => a.category === 'exercise')) {
        exerciseCount++
      }
    })

    if (avgProteinPerDay >= 80 && exerciseCount >= 2) {
      insights.push({
        type: 'correlation',
        title: 'Protein Intake Supports Exercise Routine',
        description: `You're consistently meeting protein targets (${Math.round(avgProteinPerDay)}g/day) while maintaining your exercise schedule. This supports muscle recovery and performance.`,
        confidence: 85,
        modes: ['nutriwell', 'lifeflow'],
        action: 'Continue this pattern. Consider timing protein intake within 2 hours of workouts for optimal recovery.'
      })
    }
  }

  if (foodLogs.length >= 5 && schedules.length === 0) {
    insights.push({
      type: 'recommendation',
      title: 'Try LifeFlow for Better Meal Timing',
      description: 'You are tracking nutrition consistently. Use LifeFlow to schedule meals and optimize timing for better digestion and energy.',
      confidence: 70,
      modes: ['nutriwell', 'lifeflow', 'sleepsync'],
      action: 'Switch to LifeFlow mode and generate a schedule including your meal times.'
    })
  }

  return insights
}

function getLast7Days(): string[] {
  const dates: string[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
}

function getBorderColor(type: string): string {
  switch (type) {
    case 'celebration':
      return 'border-l-green-500'
    case 'correlation':
      return 'border-l-blue-500'
    case 'recommendation':
      return 'border-l-orange-500'
    default:
      return 'border-l-primary'
  }
}

function getIcon(modes: string[]) {
  if (modes.includes('nutriwell') && modes.includes('sleepsync') && modes.includes('lifeflow')) {
    return <Lightning className="w-5 h-5 text-primary" />
  }
  if (modes.includes('nutriwell') && modes.includes('lifeflow')) {
    return <TrendUp className="w-5 h-5 text-blue-600" />
  }
  if (modes.includes('nutriwell') && modes.includes('sleepsync')) {
    return <Moon className="w-5 h-5 text-purple-600" />
  }
  return <CheckCircle className="w-5 h-5 text-green-600" />
}
