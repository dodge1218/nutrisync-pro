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
  completed: boolean
  completedAt?: string
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
  work: 'bg-blue-100 text-blue-700 border-blue-300',
  exercise: 'bg-green-100 text-green-700 border-green-300',
  hygiene: 'bg-purple-100 text-purple-700 border-purple-300',
  cooking: 'bg-orange-100 text-orange-700 border-orange-300',
  'pet-care': 'bg-pink-100 text-pink-700 border-pink-300',
  meal: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  custom: 'bg-gray-100 text-gray-700 border-gray-300'
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
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <CalendarBlank className="w-8 h-8 text-primary" />
            LifeFlow
          </h2>
          <p className="text-muted-foreground mt-1">
            Time-blocked scheduling powered by your food and sleep patterns
          </p>
        </div>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sun className="w-5 h-5 text-primary" />
            Your Awake Window
          </CardTitle>
          <CardDescription>
            Based on your sleep schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Wake Time</p>
              <p className="text-2xl font-bold">{awakeWindow.start}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Available Hours</p>
              <p className="text-2xl font-bold text-primary">{Math.round(awakeWindow.duration * 10) / 10}h</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Sleep Time</p>
              <p className="text-2xl font-bold">{awakeWindow.end}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="schedule">
            <ClockAfternoon className="w-4 h-4 mr-2" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="checkin">
            <CheckCircle className="w-4 h-4 mr-2" />
            Check-In
          </TabsTrigger>
          <TabsTrigger value="activities">
            <ListChecks className="w-4 h-4 mr-2" />
            Activities
          </TabsTrigger>
          <TabsTrigger value="goals">
            <Target className="w-4 h-4 mr-2" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="exercise">
            <Barbell className="w-4 h-4 mr-2" />
            Exercise
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label>Planning days:</Label>
                <div className="flex gap-2">
                  {[3, 5, 7].map(num => (
                    <Button
                      key={num}
                      variant={selectedDays === num ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDays(num)}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autofill-meals"
                  checked={autofillMeals}
                  onChange={(e) => setAutofillMeals(e.target.checked)}
                  className="w-4 h-4 rounded border-input"
                />
                <Label htmlFor="autofill-meals" className="cursor-pointer text-sm">
                  Auto-predict meals
                </Label>
              </div>
            </div>
            <Button onClick={generateSchedulesForDays}>
              <Sparkle className="w-4 h-4 mr-2" />
              Generate Schedule
            </Button>
          </div>

          {mealPatterns.length > 0 && autofillMeals && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">
                  <Sparkle className="w-4 h-4 inline mr-1" />
                  Detected {mealPatterns.length} meal patterns from your history. Future meals and cook times will be auto-filled based on your habits.
                </p>
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
                  <Card key={dateStr}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{dayName}, {dateDisplay}</CardTitle>
                          <CardDescription>{stats.completed} of {stats.total} completed</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={stats.percentage} className="w-24 h-2" />
                          <span className="text-sm font-medium">{stats.percentage}%</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {schedule.activities.map(activity => (
                          <div
                            key={activity.id}
                            className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                          >
                            <button
                              onClick={() => handleToggleActivity(dateStr, activity.id)}
                              className="flex-shrink-0"
                            >
                              {activity.isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-green-600" weight="fill" />
                              ) : (
                                <Circle className="w-5 h-5 text-muted-foreground" />
                              )}
                            </button>
                            <div className="flex items-center gap-2 flex-1">
                              <Badge variant="outline" className={categoryColors[activity.category]}>
                                {activityIcons[activity.category]}
                                <span className="ml-1 text-xs">{activity.category}</span>
                              </Badge>
                              <span className={activity.isCompleted ? 'line-through text-muted-foreground' : ''}>
                                {activity.name}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {activity.startTime} - {activity.endTime}
                            </div>
                          </div>
                        ))}
                        {schedule.activities.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No activities scheduled. Add recurring activities or generate a schedule.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarBlank className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No schedule generated yet</p>
                <Button onClick={generateSchedulesForDays}>
                  <Sparkle className="w-4 h-4 mr-2" />
                  Generate Schedule
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="checkin" className="space-y-4">
          <DailyCheckIn
            foodLogs={foodLogs}
            activeGoals={activeGoals}
            nutrientGaps={[]}
            recentStress={undefined}
          />
          <CheckInHistory />
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
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

          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Recurring Activities</h3>
              <p className="text-sm text-muted-foreground">Activities that repeat on specific days</p>
            </div>
            <Button onClick={() => setIsAddingActivity(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </div>

          {isAddingActivity && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">New Recurring Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddActivity} className="flex-1">Add Activity</Button>
                  <Button variant="outline" onClick={() => setIsAddingActivity(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-3">
            {(recurringActivities || []).map(activity => (
              <Card key={activity.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Badge variant="outline" className={categoryColors[activity.category]}>
                        {activityIcons[activity.category]}
                        <span className="ml-1">{activity.category}</span>
                      </Badge>
                      <div>
                        <p className="font-medium">{activity.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.startTime} • {activity.duration} min • {activity.days.join(', ').toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveActivity(activity.id)}
                    >
                      <Trash className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!recurringActivities || recurringActivities.length === 0) && !isAddingActivity && (
              <Card>
                <CardContent className="py-12 text-center">
                  <ListChecks className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No recurring activities yet</p>
                  <Button onClick={() => setIsAddingActivity(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Activity
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Your Goals</h3>
              <p className="text-sm text-muted-foreground">Track progress toward your objectives</p>
            </div>
            <Button onClick={() => setIsAddingGoal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>

          {isAddingGoal && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">New Goal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="flex gap-2">
                  <Button onClick={handleAddGoal} className="flex-1">Add Goal</Button>
                  <Button variant="outline" onClick={() => setIsAddingGoal(false)}>Cancel</Button>
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
                <Card key={goal.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          {goal.title}
                        </CardTitle>
                        <CardDescription className="mt-1">{goal.description}</CardDescription>
                        {goal.targetDate && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Target: {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={progress} className="w-24 h-2" />
                        <span className="text-sm font-medium">{progress}%</span>
                      </div>
                    </div>
                  </CardHeader>
                  {goal.milestones.length > 0 && (
                    <CardContent>
                      <div className="space-y-2">
                        {goal.milestones.map(milestone => (
                          <div
                            key={milestone.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/5 transition-colors"
                          >
                            <button
                              onClick={() => handleToggleMilestone(goal.id, milestone.id)}
                              className="flex-shrink-0"
                            >
                              {milestone.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-600" weight="fill" />
                              ) : (
                                <Circle className="w-5 h-5 text-muted-foreground" />
                              )}
                            </button>
                            <span className={milestone.completed ? 'line-through text-muted-foreground' : ''}>
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
              <Card>
                <CardContent className="py-12 text-center">
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No goals set yet</p>
                  <Button onClick={() => setIsAddingGoal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
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
