import { useState, useMemo, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  CalendarBlank, 
  ClockAfternoon,
  Plus,
  Trash,
  CheckCircle,
  Circle,
  Target,
  TrendUp,
  Dog,
  Barbell,
  ForkKnife,
  Shower,
  BriefcaseMetal,
  Moon,
  Sun,
  Coffee,
  ListChecks,
  Sparkle,
  CookingPot
} from '@phosphor-icons/react'
import { parseTimeString, type UserSleepPreferences } from '../../lib/circadianEngine'
import { analyzeMealPatterns, estimateCookTime, predictFutureMeals, generateCookingSchedule } from '../../lib/mealPatternEngine'
import { 
  initializeAutoTasks, 
  getDefaultAutoTaskConfig, 
  generateAutoTaskActivities,
  markAutoTaskDeleted,
  toggleAutoTaskEnabled,
  type AutoTask,
  type AutoTaskConfig
} from '../../lib/autoTaskEngine'
import type { FoodLog } from '../../lib/nutritionEngine'
import type { MealTemplate } from '../../data/mealTemplates'
import ExerciseCreator from './ExerciseCreator'
import DailyCheckIn from '../DailyCheckIn'
import CheckInHistory from '../CheckInHistory'
import AutoTaskSettings from '../AutoTaskSettings'
import SmartRoutineBuilder from '../SmartRoutineBuilder'
import { toast } from 'sonner'

interface LifeFlowProps {
  foodLogs: FoodLog[]
}

export interface RecurringActivity {
  id: string
  name: string
  category: 'work' | 'exercise' | 'hygiene' | 'cooking' | 'pet-care' | 'meal' | 'custom'
  startTime: string
  duration: number
  days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[]
}

export interface Goal {
  id: string
  title: string
  description: string
  targetDate: string
  milestones: GoalMilestone[]
  status: 'active' | 'completed' | 'paused'
  createdAt: string
}

export interface GoalMilestone {
  id: string
  title: string
  type: 'checkbox' | 'numeric' | 'frequency' | 'habit'
  completed: boolean
  completedAt?: string
  target?: number
  unit?: string
  currentProgress?: number
  progressHistory?: Array<{ date: string; value: number }>
}

export interface DaySchedule {
  date: string
  activities: ScheduledActivity[]
}

export interface ScheduledActivity {
  id: string
  name: string
  startTime: string
  endTime: string
  category: string
  isCompleted: boolean
  isRecurring: boolean
  recurringId?: string
  mealTemplateId?: string
  isCookingActivity?: boolean
}

const activityIcons: Record<string, React.ReactNode> = {
  work: <BriefcaseMetal className="w-4 h-4" />,
  exercise: <Barbell className="w-4 h-4" />,
  hygiene: <Shower className="w-4 h-4" />,
  cooking: <CookingPot className="w-4 h-4" />,
  'pet-care': <Dog className="w-4 h-4" />,
  meal: <Coffee className="w-4 h-4" />,
  custom: <Circle className="w-4 h-4" />
}

const categoryColors: Record<string, string> = {
  work: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  exercise: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  hygiene: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  cooking: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
  'pet-care': 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800',
  meal: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  custom: 'bg-secondary text-secondary-foreground border-border'
}

export default function LifeFlow({ foodLogs }: LifeFlowProps) {
  const [sleepPreferences] = useKV<UserSleepPreferences>('sleep-preferences', {
    targetSleepTime: '22:00',
    targetWakeTime: '06:30',
    desiredDigestiveBuffer: 240
  })

  const [recurringActivities, setRecurringActivities] = useKV<RecurringActivity[]>('lifeflow-recurring', [])
  const [autoTasks, setAutoTasks] = useKV<AutoTask[]>('lifeflow-auto-tasks', initializeAutoTasks())
  const [autoTaskConfig, setAutoTaskConfig] = useKV<AutoTaskConfig>('lifeflow-auto-config', getDefaultAutoTaskConfig())
  const [schedules, setSchedules] = useKV<DaySchedule[]>('lifeflow-schedules', [])
  const [goals, setGoals] = useKV<Goal[]>('lifeflow-goals', [])
  const [mealTemplates] = useKV<MealTemplate[]>('meal-templates', [])
  const [cookHistory] = useKV<{ templateId: string; actualMinutes: number; timestamp: string }[]>('cook-history', [])

  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [isSmartBuilderOpen, setIsSmartBuilderOpen] = useState(false)
  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [selectedDays, setSelectedDays] = useState(3)
  const [autofillMeals, setAutofillMeals] = useState(true)

  const [newActivity, setNewActivity] = useState<Partial<RecurringActivity>>({
    name: '',
    category: 'custom',
    startTime: '09:00',
    duration: 60,
    days: ['mon', 'tue', 'wed', 'thu', 'fri']
  })
  
  const [durationUnit, setDurationUnit] = useState<'minutes' | 'hours'>('minutes')

  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: '',
    description: '',
    targetDate: '',
    milestones: []
  })

  const [newMilestone, setNewMilestone] = useState('')

  const today = new Date()
  const dates = useMemo(() => {
    const result: Date[] = []
    for (let i = 0; i < selectedDays; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      result.push(date)
    }
    return result
  }, [selectedDays, today])

  const mealPatterns = useMemo(() => {
    if (!mealTemplates || mealTemplates.length === 0) return []
    return analyzeMealPatterns(foodLogs, mealTemplates, 30)
  }, [foodLogs, mealTemplates])

  const awakeWindow = useMemo(() => {
    if (!sleepPreferences) return { start: '06:30', end: '22:00', duration: 15.5 }
    
    const wakeMinutes = parseTimeString(sleepPreferences.targetWakeTime).totalMinutes
    const sleepMinutes = parseTimeString(sleepPreferences.targetSleepTime).totalMinutes
    
    let duration = sleepMinutes - wakeMinutes
    if (duration < 0) duration += 24 * 60
    
    return {
      start: sleepPreferences.targetWakeTime,
      end: sleepPreferences.targetSleepTime,
      duration: duration / 60
    }
  }, [sleepPreferences])

  const generateSchedulesForDays = () => {
    const newSchedules: DaySchedule[] = []
    
    dates.forEach(date => {
      const dateStr = date.toISOString().split('T')[0]
      const dayName = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()] as any
      
      const existingSchedule = schedules?.find(s => s.date === dateStr)
      if (existingSchedule) {
        newSchedules.push(existingSchedule)
        return
      }

      const activities: ScheduledActivity[] = []

      const relevantRecurring = (recurringActivities || []).filter(r => r.days.includes(dayName))
      
      relevantRecurring.forEach(recurring => {
        const startMinutes = parseTimeString(recurring.startTime).totalMinutes
        const endMinutes = startMinutes + recurring.duration
        const endHour = Math.floor(endMinutes / 60)
        const endMin = endMinutes % 60
        const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`

        activities.push({
          id: `${dateStr}-${recurring.id}`,
          name: recurring.name,
          startTime: recurring.startTime,
          endTime,
          category: recurring.category,
          isCompleted: false,
          isRecurring: true,
          recurringId: recurring.id
        })
      })

      if (autofillMeals && mealPatterns.length > 0 && mealTemplates) {
        const predictions = predictFutureMeals(mealPatterns, mealTemplates, date)
        
        const defaultMealTimes = {
          breakfast: '08:00',
          lunch: '12:30',
          dinner: '18:00'
        }

        predictions.forEach(prediction => {
          if (prediction.confidence > 30) {
            const mealTime = defaultMealTimes[prediction.mealType as keyof typeof defaultMealTimes]
            const cookEstimate = estimateCookTime(prediction.template, cookHistory)
            
            const cookSchedule = generateCookingSchedule(mealTime, cookEstimate.estimatedMinutes)

            activities.push({
              id: `${dateStr}-cook-${prediction.template.id}`,
              name: `Cook: ${prediction.template.name}`,
              startTime: cookSchedule.cookStartTime,
              endTime: cookSchedule.cookEndTime,
              category: 'cooking',
              isCompleted: false,
              isRecurring: false,
              mealTemplateId: prediction.template.id,
              isCookingActivity: true
            })

            const mealStartMinutes = parseTimeString(mealTime).totalMinutes
            const mealEndMinutes = mealStartMinutes + 30
            const mealEndHour = Math.floor(mealEndMinutes / 60)
            const mealEndMin = mealEndMinutes % 60
            const mealEndTime = `${String(mealEndHour).padStart(2, '0')}:${String(mealEndMin).padStart(2, '0')}`

            activities.push({
              id: `${dateStr}-meal-${prediction.template.id}`,
              name: `Meal: ${prediction.template.name}`,
              startTime: mealTime,
              endTime: mealEndTime,
              category: 'meal',
              isCompleted: false,
              isRecurring: false,
              mealTemplateId: prediction.template.id
            })
          }
        })
      } else {
        const dateLogs = foodLogs.filter(log => log.timestamp.startsWith(dateStr))
        dateLogs.forEach((log, idx) => {
          const mealTime = log.timestamp.split('T')[1]?.substring(0, 5) || '12:00'
          const startMinutes = parseTimeString(mealTime).totalMinutes
          const endMinutes = startMinutes + 30
          const endHour = Math.floor(endMinutes / 60)
          const endMin = endMinutes % 60
          const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`

          activities.push({
            id: `${dateStr}-meal-${idx}`,
            name: `Meal: ${log.food.name}`,
            startTime: mealTime,
            endTime,
            category: 'meal',
            isCompleted: false,
            isRecurring: false
          })
        })
      }

      if (autoTaskConfig && autoTaskConfig.enabled && autoTasks && sleepPreferences) {
        const existingActivityNames = activities.map(a => a.name)
        const generatedAutoTasks = generateAutoTaskActivities(
          autoTasks,
          autoTaskConfig,
          sleepPreferences.targetWakeTime,
          sleepPreferences.targetSleepTime,
          dayName,
          existingActivityNames
        )

        generatedAutoTasks.forEach((autoTask, idx) => {
          activities.push({
            id: `${dateStr}-auto-${autoTask.autoTaskId}-${idx}`,
            name: autoTask.name,
            startTime: autoTask.startTime,
            endTime: autoTask.endTime,
            category: autoTask.category,
            isCompleted: false,
            isRecurring: false
          })
        })
      }

      activities.sort((a, b) => parseTimeString(a.startTime).totalMinutes - parseTimeString(b.startTime).totalMinutes)

      newSchedules.push({
        date: dateStr,
        activities
      })
    })

    setSchedules(newSchedules)
    toast.success(`Generated schedule for ${dates.length} days${autofillMeals ? ' with predicted meals' : ''}`)
  }

  const handleAddActivity = () => {
    if (!newActivity.name || !newActivity.startTime) return

    const activity: RecurringActivity = {
      id: Date.now().toString(),
      name: newActivity.name,
      category: newActivity.category || 'custom',
      startTime: newActivity.startTime,
      duration: newActivity.duration || 60,
      days: newActivity.days || ['mon', 'tue', 'wed', 'thu', 'fri']
    }

    setRecurringActivities((current) => [...(current || []), activity])
    setIsAddingActivity(false)
    setNewActivity({
      name: '',
      category: 'custom',
      startTime: '09:00',
      duration: 60,
      days: ['mon', 'tue', 'wed', 'thu', 'fri']
    })
  }

  const handleSmartAddActivities = (activities: RecurringActivity[]) => {
    setRecurringActivities((current) => [...(current || []), ...activities])
    setIsSmartBuilderOpen(false)
    toast.success(`Added ${activities.length} activities to your routine`)
  }

  const handleRemoveActivity = (id: string) => {
    setRecurringActivities((current) => (current || []).filter(a => a.id !== id))
  }

  const handleAddGoal = () => {
    if (!newGoal.title) return

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description || '',
      targetDate: newGoal.targetDate || '',
      milestones: newGoal.milestones || [],
      status: 'active',
      createdAt: new Date().toISOString()
    }

    setGoals((current) => [...(current || []), goal])
    setIsAddingGoal(false)
    setNewGoal({
      title: '',
      description: '',
      targetDate: '',
      milestones: []
    })
  }

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((current) => 
      (current || []).map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            milestones: goal.milestones.map(m => 
              m.id === milestoneId 
                ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : undefined }
                : m
            )
          }
        }
        return goal
      })
    )
  }

  const handleToggleActivity = (date: string, activityId: string) => {
    setSchedules((current) =>
      (current || []).map(schedule => {
        if (schedule.date === date) {
          return {
            ...schedule,
            activities: schedule.activities.map(a =>
              a.id === activityId ? { ...a, isCompleted: !a.isCompleted } : a
            )
          }
        }
        return schedule
      })
    )
  }

  const getScheduleStats = (schedule: DaySchedule) => {
    const total = schedule.activities.length
    const completed = schedule.activities.filter(a => a.isCompleted).length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, percentage }
  }

  const activeGoals = (goals || []).filter(g => g.status === 'active')

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
            LifeFlow
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Time-blocked scheduling powered by your food and sleep patterns
          </p>
        </div>
      </div>

      <Card className="border-sky-500/20 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-background shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
              <Sun className="w-5 h-5 text-sky-500" weight="duotone" />
            </div>
            Your Awake Window
          </CardTitle>
          <CardDescription>
            Based on your sleep schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <div className="text-center p-4 rounded-xl bg-card shadow-sm border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-2">Wake Time</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{awakeWindow.start}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-md border-2 border-sky-400/30">
              <p className="text-xs font-medium text-white/90 mb-2">Available Hours</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{Math.round(awakeWindow.duration * 10) / 10}h</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-card shadow-sm border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-2">Sleep Time</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{awakeWindow.end}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto bg-card/50 p-1 gap-1">
          <TabsTrigger value="schedule" className="flex-col md:flex-row gap-1 py-3 data-[state=active]:bg-sky-500/10 data-[state=active]:text-sky-500">
            <ClockAfternoon className="w-4 h-4" weight="duotone" />
            <span className="text-xs md:text-sm">Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="checkin" className="flex-col md:flex-row gap-1 py-3 data-[state=active]:bg-sky-500/10 data-[state=active]:text-sky-500">
            <CheckCircle className="w-4 h-4" weight="duotone" />
            <span className="text-xs md:text-sm">Check-In</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex-col md:flex-row gap-1 py-3 data-[state=active]:bg-sky-500/10 data-[state=active]:text-sky-500">
            <ListChecks className="w-4 h-4" weight="duotone" />
            <span className="text-xs md:text-sm">Activities</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex-col md:flex-row gap-1 py-3 data-[state=active]:bg-sky-500/10 data-[state=active]:text-sky-500">
            <Target className="w-4 h-4" weight="duotone" />
            <span className="text-xs md:text-sm">Goals</span>
          </TabsTrigger>
          <TabsTrigger value="exercise" className="flex-col md:flex-row gap-1 py-3 data-[state=active]:bg-sky-500/10 data-[state=active]:text-sky-500">
            <Barbell className="w-4 h-4" weight="duotone" />
            <span className="text-xs md:text-sm">Exercise</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4 mt-6">
          <Card className="border-sky-500/20 bg-gradient-to-r from-sky-500/5 to-background shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Label className="text-sm font-semibold text-foreground whitespace-nowrap">Planning days:</Label>
                    <div className="flex gap-2">
                      {[3, 5, 7].map(num => (
                        <Button
                          key={num}
                          variant={selectedDays === num ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedDays(num)}
                          className={`min-w-[2.5rem] ${selectedDays === num ? 'bg-sky-500 hover:bg-sky-600 text-white' : ''}`}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/50 border border-border/50">
                    <input
                      type="checkbox"
                      id="autofill-meals"
                      checked={autofillMeals}
                      onChange={(e) => setAutofillMeals(e.target.checked)}
                      className="w-4 h-4 rounded border-input accent-sky-500"
                    />
                    <Label htmlFor="autofill-meals" className="cursor-pointer text-sm font-medium">
                      Auto-predict meals
                    </Label>
                  </div>
                </div>
                <Button onClick={generateSchedulesForDays} className="w-full md:w-auto bg-sky-500 hover:bg-sky-600 text-white shadow-md">
                  <Sparkle className="w-4 h-4 mr-2" weight="duotone" />
                  Generate Schedule
                </Button>
              </div>
            </CardContent>
          </Card>

          {mealPatterns.length > 0 && autofillMeals && (
            <Card className="border-sky-500/20 bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-sky-500/10 shadow-sm">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkle className="w-5 h-5 text-sky-500" weight="duotone" />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed pt-1">
                    <span className="font-semibold">AI-Powered Predictions Active:</span> Detected {mealPatterns.length} meal patterns from your history. Future meals and cook times will be auto-filled based on your habits.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {schedules && schedules.length > 0 ? (
            <div className="grid gap-4">
              {dates.map(date => {
                const dateStr = date.toISOString().split('T')[0]
                const schedule = schedules.find(s => s.date === dateStr)
                if (!schedule) return null

                const stats = getScheduleStats(schedule)
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
                const dateDisplay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

                return (
                  <Card key={dateStr} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-background border-b border-border/50">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <CalendarBlank className="w-5 h-5 text-sky-500" weight="duotone" />
                            {dayName}, {dateDisplay}
                          </CardTitle>
                          <CardDescription className="mt-1.5 font-medium">{stats.completed} of {stats.total} completed</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={stats.percentage} className="w-24 sm:w-32 h-2.5 [&>div]:bg-sky-500" />
                          <span className="text-base font-bold text-sky-500 min-w-[3.5rem] text-right">{stats.percentage}%</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 pb-6">
                      <div className="space-y-2.5">
                        {schedule.activities.map(activity => (
                          <div
                            key={activity.id}
                            className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-border/50 bg-card hover:bg-sky-500/5 hover:border-sky-500/30 transition-all shadow-sm"
                          >
                            <button
                              onClick={() => handleToggleActivity(dateStr, activity.id)}
                              className="flex-shrink-0 self-start sm:self-auto"
                            >
                              {activity.isCompleted ? (
                                <CheckCircle className="w-6 h-6 text-green-600" weight="fill" />
                              ) : (
                                <Circle className="w-6 h-6 text-muted-foreground hover:text-sky-500 transition-colors" />
                              )}
                            </button>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 min-w-0">
                              <Badge variant="outline" className={`${categoryColors[activity.category]} flex-shrink-0 w-fit px-2.5 py-1 font-medium`}>
                                {activityIcons[activity.category]}
                                <span className="ml-1.5 text-xs">{activity.category}</span>
                              </Badge>
                              <span className={`${activity.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground font-medium'} truncate sm:flex-1`}>
                                {activity.name}
                              </span>
                            </div>
                            <div className="text-sm font-semibold text-muted-foreground whitespace-nowrap self-end sm:self-auto bg-muted/50 px-3 py-1.5 rounded-lg">
                              {activity.startTime} - {activity.endTime}
                            </div>
                          </div>
                        ))}
                        {schedule.activities.length === 0 && (
                          <div className="text-center py-12 px-4">
                            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                              <CalendarBlank className="w-8 h-8 text-muted-foreground" weight="duotone" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              No activities scheduled. Add recurring activities or generate a schedule.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="border-border/50 shadow-sm">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 rounded-2xl bg-sky-500/10 flex items-center justify-center mx-auto mb-6">
                  <CalendarBlank className="w-10 h-10 text-sky-500" weight="duotone" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">No schedule generated yet</h3>
                <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                  Create your personalized daily schedule with time-blocked activities, meals, and goals
                </p>
                <Button onClick={generateSchedulesForDays} size="lg" className="bg-sky-500 hover:bg-sky-600 text-white shadow-md">
                  <Sparkle className="w-5 h-5 mr-2" weight="duotone" />
                  Generate Schedule
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="checkin" className="space-y-4 mt-6">
          <DailyCheckIn
            foodLogs={foodLogs}
            activeGoals={activeGoals}
            nutrientGaps={[]}
            recentStress={undefined}
          />
          <CheckInHistory />
        </TabsContent>

        <TabsContent value="activities" className="space-y-6 mt-6">
          <AutoTaskSettings
            config={autoTaskConfig || getDefaultAutoTaskConfig()}
            autoTasks={autoTasks || []}
            onConfigChange={(newConfig) => setAutoTaskConfig(newConfig)}
            onTaskToggle={(taskId) => {
              if (autoTasks) {
                setAutoTasks((currentTasks) => toggleAutoTaskEnabled(currentTasks || [], taskId))
              }
            }}
          />

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-2">
            <div>
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
                  <ListChecks className="w-5 h-5 text-sky-500" weight="duotone" />
                </div>
                Recurring Activities
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Activities that repeat on specific days</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                onClick={() => setIsSmartBuilderOpen(true)} 
                variant="outline"
                className="flex-1 sm:flex-none border-sky-500/30 hover:bg-sky-500/5 text-sky-600 dark:text-sky-400"
              >
                <Sparkle className="w-4 h-4 mr-2" weight="fill" />
                AI Builder
              </Button>
              <Button onClick={() => setIsAddingActivity(true)} className="flex-1 sm:flex-none bg-sky-500 hover:bg-sky-600 text-white shadow-md">
                <Plus className="w-4 h-4 mr-2" weight="bold" />
                Add Activity
              </Button>
            </div>
          </div>

          {isSmartBuilderOpen && (
            <div className="mb-6">
              <SmartRoutineBuilder 
                onAddActivities={handleSmartAddActivities}
                onClose={() => setIsSmartBuilderOpen(false)}
              />
            </div>
          )}

          {isAddingActivity && (
            <Card className="border-sky-500/30 shadow-md">
              <CardHeader className="bg-gradient-to-r from-sky-500/5 to-background border-b border-border/50">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-sky-500" weight="duotone" />
                  New Recurring Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="activity-name">Activity Name</Label>
                  <Input
                    id="activity-name"
                    placeholder="e.g., Walk the dog, Go to work, Morning workout"
                    value={newActivity.name}
                    onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="activity-category">Category</Label>
                    <select
                      id="activity-category"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={newActivity.category}
                      onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value as any })}
                    >
                      <option value="work">Work</option>
                      <option value="exercise">Exercise</option>
                      <option value="hygiene">Hygiene</option>
                      <option value="cooking">Cooking</option>
                      <option value="pet-care">Pet Care</option>
                      <option value="meal">Meal</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activity-start">Start Time</Label>
                    <Input
                      id="activity-start"
                      type="time"
                      value={newActivity.startTime}
                      onChange={(e) => setNewActivity({ ...newActivity, startTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="activity-duration">Duration</Label>
                    <Tabs value={durationUnit} onValueChange={(v) => setDurationUnit(v as any)} className="w-auto">
                      <TabsList className="h-8">
                        <TabsTrigger value="minutes" className="text-xs px-3 h-7">Minutes</TabsTrigger>
                        <TabsTrigger value="hours" className="text-xs px-3 h-7">Hours</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <Input
                    id="activity-duration"
                    type="number"
                    min={durationUnit === 'minutes' ? "5" : "0.25"}
                    step={durationUnit === 'minutes' ? "5" : "0.25"}
                    value={durationUnit === 'minutes' ? newActivity.duration : (newActivity.duration || 60) / 60}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value)
                      const minutes = durationUnit === 'minutes' ? val : val * 60
                      setNewActivity({ ...newActivity, duration: minutes })
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    {durationUnit === 'minutes' 
                      ? `${newActivity.duration || 60} minutes (${((newActivity.duration || 60) / 60).toFixed(2)} hours)`
                      : `${((newActivity.duration || 60) / 60).toFixed(2)} hours (${newActivity.duration || 60} minutes)`
                    }
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Repeat on</Label>
                  <div className="flex gap-2">
                    {[
                      { value: 'mon', label: 'Mon' },
                      { value: 'tue', label: 'Tue' },
                      { value: 'wed', label: 'Wed' },
                      { value: 'thu', label: 'Thu' },
                      { value: 'fri', label: 'Fri' },
                      { value: 'sat', label: 'Sat' },
                      { value: 'sun', label: 'Sun' }
                    ].map(day => (
                      <Button
                        key={day.value}
                        type="button"
                        variant={(newActivity.days || []).includes(day.value as any) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          const current = newActivity.days || []
                          const updated = current.includes(day.value as any)
                            ? current.filter(d => d !== day.value)
                            : [...current, day.value as any]
                          setNewActivity({ ...newActivity, days: updated })
                        }}
                        className={(newActivity.days || []).includes(day.value as any) ? 'bg-sky-500 hover:bg-sky-600 text-white' : ''}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={handleAddActivity} className="flex-1 bg-sky-500 hover:bg-sky-600 text-white shadow-md" size="lg">
                    <Plus className="w-4 h-4 mr-2" weight="bold" />
                    Add Activity
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingActivity(false)} size="lg">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {(recurringActivities || []).map(activity => (
              <Card key={activity.id} className="hover:border-sky-500/40 transition-all shadow-sm hover:shadow-md border-border/50">
                <CardContent className="pt-6 pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                      <Badge variant="outline" className={`${categoryColors[activity.category]} flex-shrink-0 px-2.5 py-1`}>
                        {activityIcons[activity.category]}
                        <span className="ml-1.5 font-medium">{activity.category}</span>
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate text-base">{activity.name}</p>
                        <p className="text-sm text-muted-foreground mt-1.5 font-medium">
                          {activity.startTime} • {activity.duration} min
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {activity.days.map(day => (
                            <Badge key={day} variant="secondary" className="text-xs font-semibold px-2">
                              {day.toUpperCase()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveActivity(activity.id)}
                      className="self-end sm:self-auto hover:bg-destructive/10"
                    >
                      <Trash className="w-5 h-5 text-destructive" weight="duotone" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!recurringActivities || recurringActivities.length === 0) && !isAddingActivity && (
              <Card className="border-border/50 shadow-sm">
                <CardContent className="py-16 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-sky-500/10 flex items-center justify-center mx-auto mb-6">
                    <ListChecks className="w-10 h-10 text-sky-500" weight="duotone" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">No recurring activities yet</h3>
                  <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                    Add activities that repeat weekly, like work hours, exercise routines, or daily tasks
                  </p>
                  <Button onClick={() => setIsAddingActivity(true)} size="lg" className="bg-sky-500 hover:bg-sky-600 text-white shadow-md">
                    <Plus className="w-5 h-5 mr-2" weight="bold" />
                    Add Your First Activity
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6 mt-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-sky-500" weight="duotone" />
                </div>
                Your Goals
              </h3>
              <p className="text-sm text-muted-foreground mt-1">Track progress toward your objectives</p>
            </div>
            <Button onClick={() => setIsAddingGoal(true)} className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white shadow-md">
              <Plus className="w-4 h-4 mr-2" weight="bold" />
              Add Goal
            </Button>
          </div>

          {isAddingGoal && (
            <Card className="border-sky-500/30 shadow-md">
              <CardHeader className="bg-gradient-to-r from-sky-500/5 to-background border-b border-border/50">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Target className="w-5 h-5 text-sky-500" weight="duotone" />
                  New Goal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="goal-title">Goal Title</Label>
                  <Input
                    id="goal-title"
                    placeholder="e.g., Run a 5K, Learn to cook, Read 12 books"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal-description">Description</Label>
                  <Input
                    id="goal-description"
                    placeholder="Why is this goal important to you?"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal-target">Target Date</Label>
                  <Input
                    id="goal-target"
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Milestones</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a milestone..."
                      value={newMilestone}
                      onChange={(e) => setNewMilestone(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newMilestone) {
                          const milestone: GoalMilestone = {
                            id: Date.now().toString(),
                            title: newMilestone,
                            type: 'checkbox',
                            completed: false
                          }
                          setNewGoal({
                            ...newGoal,
                            milestones: [...(newGoal.milestones || []), milestone]
                          })
                          setNewMilestone('')
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (newMilestone) {
                          const milestone: GoalMilestone = {
                            id: Date.now().toString(),
                            title: newMilestone,
                            type: 'checkbox',
                            completed: false
                          }
                          setNewGoal({
                            ...newGoal,
                            milestones: [...(newGoal.milestones || []), milestone]
                          })
                          setNewMilestone('')
                        }
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {newGoal.milestones && newGoal.milestones.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {newGoal.milestones.map(m => (
                        <div key={m.id} className="text-sm flex items-center gap-2 p-2 rounded bg-muted">
                          <Circle className="w-3 h-3" />
                          <span>{m.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={handleAddGoal} className="flex-1 bg-sky-500 hover:bg-sky-600 text-white shadow-md" size="lg">
                    <Target className="w-4 h-4 mr-2" weight="bold" />
                    Add Goal
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingGoal(false)} size="lg">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {activeGoals.map(goal => {
              const completedMilestones = goal.milestones.filter(m => m.completed).length
              const totalMilestones = goal.milestones.length
              const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

              return (
                <Card key={goal.id} className="hover:border-sky-500/40 transition-all shadow-sm hover:shadow-md border-border/50">
                  <CardHeader className="bg-gradient-to-r from-sky-500/5 to-background border-b border-border/30">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold">
                          <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                            <Target className="w-5 h-5 text-sky-500" weight="duotone" />
                          </div>
                          <span className="break-words">{goal.title}</span>
                        </CardTitle>
                        <CardDescription className="mt-2 break-words leading-relaxed">{goal.description}</CardDescription>
                        {goal.targetDate && (
                          <p className="text-xs font-medium text-muted-foreground mt-3">
                            Target: {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <Progress value={progress} className="w-24 sm:w-32 h-2.5 [&>div]:bg-sky-500" />
                        <span className="text-base font-bold text-sky-500 min-w-[3.5rem] text-right">{progress}%</span>
                      </div>
                    </div>
                  </CardHeader>
                  {goal.milestones.length > 0 && (
                    <CardContent className="pt-5 pb-5">
                      <div className="space-y-2.5">
                        {goal.milestones.map(milestone => (
                          <div
                            key={milestone.id}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-sky-500/5 transition-colors border border-transparent hover:border-sky-500/20"
                          >
                            <button
                              onClick={() => handleToggleMilestone(goal.id, milestone.id)}
                              className="flex-shrink-0 mt-0.5"
                            >
                              {milestone.completed ? (
                                <CheckCircle className="w-6 h-6 text-green-600" weight="fill" />
                              ) : (
                                <Circle className="w-6 h-6 text-muted-foreground hover:text-sky-500 transition-colors" />
                              )}
                            </button>
                            <span className={`${milestone.completed ? 'line-through text-muted-foreground' : 'text-foreground font-medium'} break-words flex-1`}>
                              {milestone.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
            {activeGoals.length === 0 && !isAddingGoal && (
              <Card className="border-border/50 shadow-sm">
                <CardContent className="py-16 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-sky-500/10 flex items-center justify-center mx-auto mb-6">
                    <Target className="w-10 h-10 text-sky-500" weight="duotone" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">No goals set yet</h3>
                  <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                    Set measurable goals with milestones to track your progress over time
                  </p>
                  <Button onClick={() => setIsAddingGoal(true)} size="lg" className="bg-sky-500 hover:bg-sky-600 text-white shadow-md">
                    <Plus className="w-5 h-5 mr-2" weight="bold" />
                    Set Your First Goal
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="exercise" className="space-y-4">
          <ExerciseCreator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
