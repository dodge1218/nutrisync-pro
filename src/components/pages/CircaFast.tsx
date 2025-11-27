import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Alert, AlertDescription } from '../ui/alert'
import { 
  Moon, 
  SunHorizon, 
  ClockAfternoon, 
  TrendUp, 
  TrendDown, 
  Minus,
  Warning,
  CheckCircle,
  Coffee,
  ForkKnife,
  Timer,
  Brain,
  Sparkle
} from '@phosphor-icons/react'
import { 
  analyzeCircadianPattern, 
  getDigestiveBufferColor, 
  getSleepReadinessMessage,
  parseTimeString,
  type UserSleepPreferences,
  type CircadianAnalysis
} from '../../lib/circadianEngine'
import type { FoodLog } from '../../lib/nutritionEngine'

interface CircaFastProps {
  foodLogs: FoodLog[]
}

export default function SleepSync({ foodLogs }: CircaFastProps) {
  const [sleepPreferences, setSleepPreferences] = useKV<UserSleepPreferences>('sleep-preferences', {
    targetSleepTime: '22:00',
    targetWakeTime: '06:30',
    desiredDigestiveBuffer: 240
  })

  const [isEditingSchedule, setIsEditingSchedule] = useState(false)
  const [tempSleepTime, setTempSleepTime] = useState(sleepPreferences?.targetSleepTime || '22:00')
  const [tempWakeTime, setTempWakeTime] = useState(sleepPreferences?.targetWakeTime || '06:30')

  const today = new Date().toISOString().split('T')[0]
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  
  const todayLogs = useMemo(() => 
    foodLogs.filter(log => log.timestamp.startsWith(today)),
    [foodLogs, today]
  )
  
  const weekLogs = useMemo(() => 
    foodLogs.filter(log => log.timestamp >= sevenDaysAgo),
    [foodLogs, sevenDaysAgo]
  )

  const todayAnalysis = useMemo<CircadianAnalysis>(() => 
    analyzeCircadianPattern(todayLogs, sleepPreferences || undefined),
    [todayLogs, sleepPreferences]
  )

  const weekAnalysis = useMemo<CircadianAnalysis>(() => 
    analyzeCircadianPattern(weekLogs, sleepPreferences || undefined),
    [weekLogs, sleepPreferences]
  )

  const handleSaveSchedule = () => {
    setSleepPreferences({
      targetSleepTime: tempSleepTime,
      targetWakeTime: tempWakeTime,
      desiredDigestiveBuffer: 240
    })
    setIsEditingSchedule(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400'
    if (score >= 75) return 'text-blue-600 dark:text-blue-400'
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400'
    if (score >= 25) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getTrendIcon = (trend: 'improving' | 'stable' | 'declining') => {
    if (trend === 'improving') return <TrendUp className="w-4 h-4 text-green-600 dark:text-green-400" />
    if (trend === 'declining') return <TrendDown className="w-4 h-4 text-red-600 dark:text-red-400" />
    return <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
  }

  const getStatusBadge = (status: CircadianAnalysis['digestiveBufferStatus']) => {
    const colors = {
      optimal: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
      good: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
      fair: 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
      poor: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
      critical: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
    }
    return (
      <Badge variant="outline" className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const currentTime = new Date()
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()
  const sleepMinutes = parseTimeString(sleepPreferences?.targetSleepTime || '22:00').totalMinutes
  const minutesUntilSleep = sleepMinutes - currentMinutes
  const hoursUntilSleep = minutesUntilSleep / 60

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Moon className="w-8 h-8 text-primary" />
            SleepSync
          </h2>
          <p className="text-muted-foreground mt-1">
            Sleep-optimized meal timing using circadian science
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditingSchedule(!isEditingSchedule)}
        >
          <ClockAfternoon className="w-4 h-4 mr-2" />
          Sleep Schedule
        </Button>
      </div>

      {isEditingSchedule && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Your Sleep Schedule</CardTitle>
            <CardDescription>
              Set your target sleep and wake times for personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sleep-time">Target Sleep Time</Label>
                <Input
                  id="sleep-time"
                  type="time"
                  value={tempSleepTime}
                  onChange={(e) => setTempSleepTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wake-time">Target Wake Time</Label>
                <Input
                  id="wake-time"
                  type="time"
                  value={tempWakeTime}
                  onChange={(e) => setTempWakeTime(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveSchedule} className="flex-1">
                Save Schedule
              </Button>
              <Button variant="outline" onClick={() => setIsEditingSchedule(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Today's Sleep Readiness
              </span>
              {getStatusBadge(todayAnalysis.digestiveBufferStatus)}
            </CardTitle>
            <CardDescription>
              How well-timed are your meals for tonight's sleep?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className={`text-5xl font-bold ${getScoreColor(todayAnalysis.sleepReadinessScore)}`}>
                {todayAnalysis.sleepReadinessScore}
              </div>
              <p className="text-sm text-muted-foreground">
                {getSleepReadinessMessage(todayAnalysis.sleepReadinessScore)}
              </p>
              <Progress value={todayAnalysis.sleepReadinessScore} className="h-3" />
            </div>

            {todayLogs.length > 0 ? (
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">First meal</span>
                  <span className="font-medium">{todayAnalysis.firstMealTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last meal</span>
                  <span className="font-medium">{todayAnalysis.lastMealTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Eating window</span>
                  <span className="font-medium">{Math.round(todayAnalysis.eatingWindow * 10) / 10}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Buffer before sleep</span>
                  <span className="font-medium">
                    {Math.round(todayAnalysis.lastMealHoursBeforeSleep * 10) / 10}h
                  </span>
                </div>

                {hoursUntilSleep > 0 && todayAnalysis.lastMealHoursBeforeSleep < 3 && (
                  <Alert className="mt-4 border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
                    <Timer className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className="text-amber-900 dark:text-amber-100">
                      <strong>Digestion in progress:</strong> Your body needs{' '}
                      {Math.ceil(3 - todayAnalysis.lastMealHoursBeforeSleep)} more hour(s) 
                      before optimal sleep time.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <Alert>
                <Coffee className="h-4 w-4" />
                <AlertDescription>
                  No meals logged today. Start logging with timestamps to see your sleep readiness score.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ClockAfternoon className="w-5 h-5 text-primary" />
                Weekly Pattern
              </span>
              {getTrendIcon(weekAnalysis.weeklyPattern.improvementTrend)}
            </CardTitle>
            <CardDescription>
              Your meal timing trends over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Avg Last Meal</p>
                <p className="text-2xl font-bold">
                  {weekAnalysis.weeklyPattern.averageLastMealTime > 0
                    ? `${Math.floor(weekAnalysis.weeklyPattern.averageLastMealTime / 60)}:${String(Math.round(weekAnalysis.weeklyPattern.averageLastMealTime % 60)).padStart(2, '0')}`
                    : 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Consistency</p>
                <p className="text-2xl font-bold">
                  {weekAnalysis.weeklyPattern.consistencyScore}%
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Late Meals</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {weekAnalysis.weeklyPattern.daysWithLateMeals}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Trend</p>
                <p className="text-2xl font-bold capitalize">
                  {weekAnalysis.weeklyPattern.improvementTrend}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              {weekAnalysis.isEarlyEater && (
                <div className="flex items-start gap-2 text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>You're an early eater - following optimal circadian principles!</span>
                </div>
              )}
              {weekAnalysis.isLateEater && (
                <div className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <Warning className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>You're a late eater - try shifting meals earlier</span>
                </div>
              )}
              {weekAnalysis.caffeineIssues && (
                <div className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <Coffee className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Caffeine too close to sleep - cut off 8-10 hours before bed</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {todayAnalysis.warnings.length > 0 && (
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10">
          <CardHeader>
            <CardTitle className="text-orange-900 dark:text-orange-100 flex items-center gap-2">
              <Warning className="w-5 h-5" />
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {todayAnalysis.warnings.map((warning, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-orange-900 dark:text-orange-100">
                  <span className="text-orange-500 dark:text-orange-400 mt-1">•</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkle className="w-5 h-5 text-primary" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription>
            Based on your meal timing patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {todayAnalysis.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SunHorizon className="w-5 h-5 text-primary" />
            Core Sleep Principles
          </CardTitle>
          <CardDescription>
            Science-backed strategies for optimal sleep quality (adapted from Blueprint protocol)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Early Time-Restricted Feeding (eTRF)</h4>
              <p className="text-sm text-muted-foreground">
                Finish eating by 5-7pm to allow 15+ hours of fasting before breakfast. 
                Improves circadian alignment and sleep architecture.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">3-4 Hour Digestion Buffer</h4>
              <p className="text-sm text-muted-foreground">
                Allow adequate time between last meal and sleep. Active digestion 
                raises body temperature and disrupts deep sleep phases.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Light Evening Meals</h4>
              <p className="text-sm text-muted-foreground">
                Heavy proteins and fats take 4-5 hours to digest. Choose vegetables, 
                fish, or soups for dinner to reduce digestive burden.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Caffeine Clearance</h4>
              <p className="text-sm text-muted-foreground">
                Caffeine has a 5-6 hour half-life. Stop intake 8-10 hours before 
                sleep to prevent sleep disruption and reduce sleep latency.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
