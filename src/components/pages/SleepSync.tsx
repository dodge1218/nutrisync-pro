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
  Timer,
  Brain,
  Sparkle
} from '@phosphor-icons/react'
import { 
  analyzeCircadianPattern, 
  getSleepReadinessMessage,
  parseTimeString,
  type UserSleepPreferences,
  type CircadianAnalysis
} from '../../lib/circadianEngine'
import type { FoodLog } from '../../lib/nutritionEngine'

interface SleepSyncProps {
  foodLogs: FoodLog[]
}

export default function SleepSync({ foodLogs }: SleepSyncProps) {
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
    if (score >= 90) return 'text-emerald-500'
    if (score >= 75) return 'text-blue-500'
    if (score >= 50) return 'text-amber-500'
    if (score >= 25) return 'text-orange-500'
    return 'text-red-500'
  }

  const getTrendIcon = (trend: 'improving' | 'stable' | 'declining') => {
    if (trend === 'improving') return <TrendUp className="w-4 h-4 text-emerald-500" weight="bold" />
    if (trend === 'declining') return <TrendDown className="w-4 h-4 text-red-500" weight="bold" />
    return <Minus className="w-4 h-4 text-muted-foreground" weight="bold" />
  }

  const getStatusBadge = (status: CircadianAnalysis['digestiveBufferStatus']) => {
    const colors = {
      optimal: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      good: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      fair: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      poor: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      critical: 'bg-red-500/10 text-red-600 border-red-500/20'
    }
    return (
      <Badge variant="outline" className={`${colors[status]} px-2.5 py-0.5 font-medium border`}>
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
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 flex items-center justify-center">
              <Moon className="w-7 h-7 text-indigo-500" weight="duotone" />
            </div>
            SleepSync
          </h2>
          <p className="text-muted-foreground mt-2 text-base">
            Sleep-optimized meal timing using circadian science
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditingSchedule(!isEditingSchedule)}
          className="bg-card hover:bg-accent/10 border-border/50 shadow-sm"
        >
          <ClockAfternoon className="w-4 h-4 mr-2" weight="duotone" />
          {isEditingSchedule ? 'Close Settings' : 'Sleep Schedule'}
        </Button>
      </div>

      {isEditingSchedule && (
        <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-background shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClockAfternoon className="w-5 h-5 text-indigo-500" weight="duotone" />
              Your Sleep Schedule
            </CardTitle>
            <CardDescription>
              Set your target sleep and wake times for personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sleep-time" className="text-sm font-medium">Target Sleep Time</Label>
                <div className="relative">
                  <Input
                    id="sleep-time"
                    type="time"
                    value={tempSleepTime}
                    onChange={(e) => setTempSleepTime(e.target.value)}
                    className="pl-10"
                  />
                  <Moon className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wake-time" className="text-sm font-medium">Target Wake Time</Label>
                <div className="relative">
                  <Input
                    id="wake-time"
                    type="time"
                    value={tempWakeTime}
                    onChange={(e) => setTempWakeTime(e.target.value)}
                    className="pl-10"
                  />
                  <SunHorizon className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSaveSchedule} className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-md">
                Save Schedule
              </Button>
              <Button variant="ghost" onClick={() => setIsEditingSchedule(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-indigo-500/5 to-transparent border-b border-border/50">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-indigo-500" weight="duotone" />
                </div>
                Today's Sleep Readiness
              </span>
              {getStatusBadge(todayAnalysis.digestiveBufferStatus)}
            </CardTitle>
            <CardDescription className="mt-2">
              How well-timed are your meals for tonight's sleep?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="text-center space-y-3">
              <div className={`text-6xl font-bold tracking-tighter ${getScoreColor(todayAnalysis.sleepReadinessScore)}`}>
                {todayAnalysis.sleepReadinessScore}
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {getSleepReadinessMessage(todayAnalysis.sleepReadinessScore)}
              </p>
              <Progress value={todayAnalysis.sleepReadinessScore} className="h-2.5 w-full max-w-[200px] mx-auto [&>div]:bg-indigo-500" />
            </div>

            {todayLogs.length > 0 ? (
              <div className="space-y-3 pt-4 border-t border-border/50">
                <div className="flex justify-between text-sm items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <SunHorizon className="w-4 h-4" /> First meal
                  </span>
                  <span className="font-semibold font-mono">{todayAnalysis.firstMealTime}</span>
                </div>
                <div className="flex justify-between text-sm items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Moon className="w-4 h-4" /> Last meal
                  </span>
                  <span className="font-semibold font-mono">{todayAnalysis.lastMealTime}</span>
                </div>
                <div className="flex justify-between text-sm items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <ClockAfternoon className="w-4 h-4" /> Eating window
                  </span>
                  <span className="font-semibold font-mono">{Math.round(todayAnalysis.eatingWindow * 10) / 10}h</span>
                </div>
                <div className="flex justify-between text-sm items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Timer className="w-4 h-4" /> Buffer before sleep
                  </span>
                  <span className={`font-semibold font-mono ${todayAnalysis.lastMealHoursBeforeSleep < 3 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {Math.round(todayAnalysis.lastMealHoursBeforeSleep * 10) / 10}h
                  </span>
                </div>

                {hoursUntilSleep > 0 && todayAnalysis.lastMealHoursBeforeSleep < 3 && (
                  <Alert className="mt-4 border-amber-500/30 bg-amber-500/10">
                    <Timer className="h-4 w-4 text-amber-600" weight="duotone" />
                    <AlertDescription className="text-amber-700 text-xs font-medium ml-2">
                      <strong>Digestion in progress:</strong> Your body needs{' '}
                      {Math.ceil(3 - todayAnalysis.lastMealHoursBeforeSleep)} more hour(s) 
                      before optimal sleep time.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-3 bg-muted/30 rounded-xl border border-dashed border-border">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Coffee className="h-5 w-5 text-muted-foreground" weight="duotone" />
                </div>
                <p className="text-sm text-muted-foreground max-w-[200px]">
                  No meals logged today. Start logging to see your sleep readiness score.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-purple-500/5 to-transparent border-b border-border/50">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <ClockAfternoon className="w-5 h-5 text-purple-500" weight="duotone" />
                </div>
                Weekly Pattern
              </span>
              <div className="flex items-center gap-1 bg-background/50 px-2 py-1 rounded-md border border-border/50 shadow-sm">
                {getTrendIcon(weekAnalysis.weeklyPattern.improvementTrend)}
                <span className="text-xs font-medium capitalize text-muted-foreground">{weekAnalysis.weeklyPattern.improvementTrend}</span>
              </div>
            </CardTitle>
            <CardDescription className="mt-2">
              Your meal timing trends over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg Last Meal</p>
                <p className="text-2xl font-bold text-foreground font-mono">
                  {weekAnalysis.weeklyPattern.averageLastMealTime > 0
                    ? `${Math.floor(weekAnalysis.weeklyPattern.averageLastMealTime / 60)}:${String(Math.round(weekAnalysis.weeklyPattern.averageLastMealTime % 60)).padStart(2, '0')}`
                    : '--:--'}
                </p>
              </div>
              <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Consistency</p>
                <p className="text-2xl font-bold text-foreground font-mono">
                  {weekAnalysis.weeklyPattern.consistencyScore}%
                </p>
              </div>
              <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Late Meals</p>
                <p className="text-2xl font-bold text-orange-500 font-mono">
                  {weekAnalysis.weeklyPattern.daysWithLateMeals}
                </p>
              </div>
              <div className="space-y-1 p-3 rounded-xl bg-muted/30 border border-border/50">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Trend</p>
                <p className="text-2xl font-bold capitalize text-foreground">
                  {weekAnalysis.weeklyPattern.improvementTrend}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50 space-y-3">
              {weekAnalysis.isEarlyEater && (
                <div className="flex items-start gap-3 text-sm text-emerald-700 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-emerald-600" weight="fill" />
                  <span className="font-medium">You're an early eater - following Blueprint principles!</span>
                </div>
              )}
              {weekAnalysis.isLateEater && (
                <div className="flex items-start gap-3 text-sm text-orange-700 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">
                  <Warning className="w-5 h-5 mt-0.5 flex-shrink-0 text-orange-600" weight="fill" />
                  <span className="font-medium">You're a late eater - try shifting meals earlier</span>
                </div>
              )}
              {weekAnalysis.caffeineIssues && (
                <div className="flex items-start gap-3 text-sm text-red-700 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                  <Coffee className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" weight="fill" />
                  <span className="font-medium">Caffeine too close to sleep - cut off 8-10 hours before bed</span>
                </div>
              )}
              {!weekAnalysis.isEarlyEater && !weekAnalysis.isLateEater && !weekAnalysis.caffeineIssues && (
                 <div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-muted-foreground" weight="duotone" />
                  <span>Keep logging to see more personalized insights.</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {todayAnalysis.warnings.length > 0 && (
        <Card className="border-orange-500/30 bg-orange-500/5 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-700 flex items-center gap-2 text-base">
              <Warning className="w-5 h-5" weight="fill" />
              Daily Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {todayAnalysis.warnings.map((warning, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-orange-800/90 font-medium">
                  <span className="text-orange-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-indigo-900 dark:text-indigo-100">
            <Sparkle className="w-5 h-5 text-indigo-500" weight="fill" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription>
            Based on your meal timing patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid md:grid-cols-2 gap-3">
            {todayAnalysis.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm p-3 rounded-lg bg-background/60 border border-indigo-500/10 shadow-sm">
                <CheckCircle className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" weight="duotone" />
                <span className="text-foreground/90">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <SunHorizon className="w-5 h-5 text-indigo-500" weight="duotone" />
            Blueprint Sleep Principles
          </CardTitle>
          <CardDescription>
            Science-backed strategies for optimal sleep quality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-indigo-500/20 transition-colors">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <ClockAfternoon className="w-4 h-4 text-indigo-500" />
                Early Time-Restricted Feeding (eTRF)
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Finish eating by 5-7pm to allow 15+ hours of fasting before breakfast. 
                Improves circadian alignment and sleep architecture.
              </p>
            </div>
            <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-indigo-500/20 transition-colors">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Timer className="w-4 h-4 text-indigo-500" />
                3-4 Hour Digestion Buffer
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Allow adequate time between last meal and sleep. Active digestion 
                raises body temperature and disrupts deep sleep phases.
              </p>
            </div>
            <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-indigo-500/20 transition-colors">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-500" />
                Light Evening Meals
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Heavy proteins and fats take 4-5 hours to digest. Choose vegetables, 
                fish, or soups for dinner to reduce digestive burden.
              </p>
            </div>
            <div className="space-y-2 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-indigo-500/20 transition-colors">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Coffee className="w-4 h-4 text-indigo-500" />
                Caffeine Clearance
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
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

