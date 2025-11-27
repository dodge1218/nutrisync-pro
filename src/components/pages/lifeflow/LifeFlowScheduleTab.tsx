import { toast } from 'sonner'
import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Label } from '../../ui/label'
import { Progress } from '../../ui/progress'
import { Badge } from '../../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog'
import { 
  CalendarBlank, 
  Sparkle,
  CheckCircle,
  Circle,
  GridFour,
  List,
  Warning,
  CaretDown
} from '@phosphor-icons/react'
import { DaySchedule, RecurringActivity, Goal } from './types'
import { categoryColors, activityIcons } from './constants'
import { parseTimeString, UserSleepPreferences } from '../../../lib/circadianEngine'
import LifeGrid from './LifeGrid'

interface LifeFlowScheduleTabProps {
  selectedDays: number
  setSelectedDays: (days: number) => void
  autofillMeals: boolean
  setAutofillMeals: (autofill: boolean) => void
  generateSchedulesForDays: () => void
  mealPatternsCount: number
  schedules: DaySchedule[]
  dates: Date[]
  handleToggleActivity: (date: string, activityId: string) => void
  recurringActivities: RecurringActivity[]
  setRecurringActivities: (activities: RecurringActivity[]) => void
  goals: Goal[]
  setGoals: (goals: Goal[]) => void
  setSleepPreferences: (prefs: UserSleepPreferences) => void
}

export default function LifeFlowScheduleTab({
  selectedDays,
  setSelectedDays,
  autofillMeals,
  setAutofillMeals,
  generateSchedulesForDays,
  mealPatternsCount,
  schedules,
  dates,
  handleToggleActivity,
  recurringActivities,
  setRecurringActivities,
  goals,
  setGoals,
  setSleepPreferences
}: LifeFlowScheduleTabProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [showConflictDialog, setShowConflictDialog] = useState(false)
  const [pendingActivities, setPendingActivities] = useState<RecurringActivity[]>([])
  const [conflicts, setConflicts] = useState<{ existing: RecurringActivity, new: RecurringActivity, day: string }[]>([])
  const dayRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const scrollToDay = (dateStr: string) => {
    const element = dayRefs.current[dateStr]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const getSolidColor = (category: string) => {
    switch (category) {
      case 'work': return 'bg-blue-500'
      case 'exercise': return 'bg-emerald-500'
      case 'learning': return 'bg-indigo-500'
      case 'social': return 'bg-rose-500'
      case 'cooking': return 'bg-orange-500'
      case 'meal': return 'bg-amber-500'
      case 'hygiene': return 'bg-purple-500'
      case 'pet-care': return 'bg-pink-500'
      case 'rest': return 'bg-indigo-950/90 dark:bg-indigo-950'
      default: return 'bg-slate-100 dark:bg-slate-800/30'
    }
  }

  const DayTimeline = ({ schedule }: { schedule: DaySchedule }) => {
    // Create an array of 24 hours
    const hours = Array.from({ length: 24 }, (_, i) => i)
    
    // Map each hour to a category
    const hourCategories = hours.map(hour => {
      const startMin = hour * 60
      const endMin = (hour + 1) * 60
      
      // Find activity that covers the majority of this hour
      const activitiesInHour = schedule.activities.filter(a => {
        const { totalMinutes: start } = parseTimeString(a.startTime)
        const { totalMinutes: end } = parseTimeString(a.endTime)
        // Handle overnight wrapping if needed, but assuming single day for now
        return (start < endMin && end > startMin)
      })

      if (activitiesInHour.length === 0) return 'empty'

      // Simple logic: take the first one or the one with most overlap
      // For simplicity, taking the first one found
      return activitiesInHour[0].category
    })

    return (
      <div className="flex w-full h-3 rounded-full overflow-hidden mt-4 border border-border/50">
        {hourCategories.map((category, i) => (
          <div 
            key={i} 
            className={`flex-1 ${getSolidColor(category)}`} 
            title={`${i}:00 - ${category}`}
          />
        ))}
      </div>
    )
  }

  const checkForConflicts = (newActivities: RecurringActivity[], existingActivities: RecurringActivity[]) => {
    const foundConflicts: { existing: RecurringActivity, new: RecurringActivity, day: string }[] = []

    newActivities.forEach(newActivity => {
      const newStart = parseTimeString(newActivity.startTime).totalMinutes
      const newEnd = newStart + newActivity.duration

      existingActivities.forEach(existing => {
        // Check if they share any days
        const commonDays = newActivity.days.filter(day => existing.days.includes(day))
        
        if (commonDays.length > 0) {
          const existingStart = parseTimeString(existing.startTime).totalMinutes
          const existingEnd = existingStart + existing.duration

          // Check for time overlap
          if (
            (newStart >= existingStart && newStart < existingEnd) ||
            (newEnd > existingStart && newEnd <= existingEnd) ||
            (newStart <= existingStart && newEnd >= existingEnd)
          ) {
            commonDays.forEach(day => {
              foundConflicts.push({
                existing,
                new: newActivity,
                day
              })
            })
          }
        }
      })
    })

    return foundConflicts
  }

  const handleResolveConflict = (resolution: 'keep-existing' | 'replace' | 'merge') => {
    if (resolution === 'keep-existing') {
      // Filter out pending activities that cause conflicts
      const conflictingNewIds = new Set(conflicts.map(c => c.new.id))
      const safeNewActivities = pendingActivities.filter(a => !conflictingNewIds.has(a.id))
      setRecurringActivities([...recurringActivities, ...safeNewActivities])
      toast.success(`Added ${safeNewActivities.length} non-conflicting activities.`)
    } else if (resolution === 'replace') {
      // Remove existing activities that conflict
      const conflictingExistingIds = new Set(conflicts.map(c => c.existing.id))
      const keptExisting = recurringActivities.filter(a => !conflictingExistingIds.has(a.id))
      setRecurringActivities([...keptExisting, ...pendingActivities])
      toast.success('Updated schedule with new activities.')
    } else {
      // Merge - keep both (might be messy but user asked for it)
      setRecurringActivities([...recurringActivities, ...pendingActivities])
      toast.success('Merged all activities.')
    }
    setShowConflictDialog(false)
    setPendingActivities([])
    setConflicts([])
  }

  const populateDemoAccount = () => {
    // 1. Set Sleep Preferences
    setSleepPreferences({
      targetWakeTime: '06:00',
      targetSleepTime: '22:30',
      desiredDigestiveBuffer: 180
    })

    // 2. Set Goals
    const demoGoals: Goal[] = [
      {
        id: 'goal-1',
        title: 'Run a Marathon',
        description: 'Train for the upcoming city marathon',
        targetDate: '2025-06-01',
        status: 'active',
        createdAt: new Date().toISOString(),
        category: 'exercise',
        color: 'bg-emerald-500',
        milestones: [
          { id: 'm1', title: 'Run 5k', type: 'checkbox', completed: true },
          { id: 'm2', title: 'Run 10k', type: 'checkbox', completed: false },
          { id: 'm3', title: 'Weekly Mileage', type: 'numeric', target: 40, unit: 'km', completed: false, currentProgress: 25 }
        ]
      },
      {
        id: 'goal-2',
        title: 'Learn Spanish',
        description: 'Be conversational by summer',
        targetDate: '2025-08-01',
        status: 'active',
        createdAt: new Date().toISOString(),
        category: 'learning',
        color: 'bg-indigo-500',
        milestones: [
          { id: 'm4', title: 'Complete Duolingo Unit 1', type: 'checkbox', completed: true },
          { id: 'm5', title: '15 mins daily practice', type: 'habit', completed: false }
        ]
      },
      {
        id: 'goal-3',
        title: 'Eat Whole Foods',
        description: 'Reduce processed food intake',
        targetDate: '2025-04-01',
        status: 'active',
        createdAt: new Date().toISOString(),
        category: 'meal',
        color: 'bg-amber-500',
        milestones: [
          { id: 'm6', title: 'No sugar for 1 week', type: 'checkbox', completed: false }
        ]
      }
    ]
    setGoals(demoGoals)

    // 3. Set Recurring Activities (Full Routine)
    const demoActivities: RecurringActivity[] = [
      // Morning Routine
      { id: 'wake-up', name: 'Wake Up & Hydrate', category: 'hygiene', startTime: '06:00', duration: 15, days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
      { id: 'morning-run', name: 'Morning Run', category: 'exercise', startTime: '06:15', duration: 45, days: ['mon', 'wed', 'fri'] },
      { id: 'morning-yoga', name: 'Morning Yoga', category: 'exercise', startTime: '06:15', duration: 30, days: ['tue', 'thu', 'sat'] },
      { id: 'shower', name: 'Shower & Get Ready', category: 'hygiene', startTime: '07:00', duration: 30, days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
      { id: 'breakfast', name: 'Breakfast', category: 'meal', startTime: '07:30', duration: 30, days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
      
      // Work Block
      { id: 'deep-work', name: 'Deep Work', category: 'work', startTime: '08:30', duration: 180, days: ['mon', 'tue', 'wed', 'thu', 'fri'] },
      { id: 'lunch', name: 'Lunch Break', category: 'meal', startTime: '12:00', duration: 60, days: ['mon', 'tue', 'wed', 'thu', 'fri'] },
      { id: 'meetings', name: 'Meetings & Admin', category: 'work', startTime: '13:00', duration: 120, days: ['mon', 'tue', 'wed', 'thu', 'fri'] },
      
      // Afternoon/Evening
      { id: 'study-spanish', name: 'Spanish Practice', category: 'learning', startTime: '17:30', duration: 30, days: ['mon', 'tue', 'wed', 'thu', 'fri'] },
      { id: 'dinner-prep', name: 'Dinner Prep', category: 'cooking', startTime: '18:00', duration: 45, days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
      { id: 'dinner', name: 'Dinner', category: 'meal', startTime: '18:45', duration: 45, days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
      { id: 'social', name: 'Social / Family Time', category: 'social', startTime: '19:30', duration: 90, days: ['fri', 'sat'] },
      { id: 'reading', name: 'Reading', category: 'rest', startTime: '21:00', duration: 60, days: ['mon', 'tue', 'wed', 'thu', 'sun'] },
      
      // Sleep
      { id: 'wind-down', name: 'Wind Down', category: 'rest', startTime: '22:00', duration: 30, days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
      { id: 'sleep', name: 'Sleep', category: 'rest', startTime: '22:30', duration: 450, days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] } // 7.5 hours
    ]
    setRecurringActivities(demoActivities)
    
    setSelectedDays(90)
    toast.success("Demo account populated! Click 'Generate' to see the 90-day plan.")
  }

  const getScheduleStats = (schedule: DaySchedule) => {
    const total = schedule.activities.length
    const completed = schedule.activities.filter(a => a.isCompleted).length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, percentage }
  }

  const handleGeneratePlan = async (aspiration: string) => {
    try {
      const prompt = `
        User wants to achieve: "${aspiration}".
        Create a balanced weekly schedule of recurring activities to help them achieve this goal.
        The schedule should be realistic and sustainable.
        Return a JSON object with a "activities" property containing an array of recurring activities.
        Each activity should have:
        - name: string (descriptive name)
        - category: 'work' | 'exercise' | 'learning' | 'social' | 'rest' | 'custom'
        - startTime: string (HH:MM format)
        - duration: number (minutes)
        - days: array of strings ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun')
        
        Example:
        {
          "activities": [
            { "name": "Morning Run", "category": "exercise", "startTime": "07:00", "duration": 30, "days": ["mon", "wed", "fri"] }
          ]
        }
      `

      let content = ''
      
      // Check if window.spark is available (it might not be in local dev preview)
      if (window.spark && window.spark.llm) {
        const response = await window.spark.llm({
          messages: [{ role: 'user', content: prompt }]
        } as any)
        content = typeof response === 'string' ? response : (response as any).message?.content || JSON.stringify(response)
      } else if (import.meta.env.VITE_OPENAI_API_KEY) {
        // Use direct OpenAI call with provided key
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: 'gpt-4o',
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.7
            })
          })
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error("OpenAI API Error:", errorData)
            throw new Error(`OpenAI API Error: ${response.status} ${errorData.error?.message || response.statusText}`)
          }
          
          const data = await response.json()
          content = data.choices[0]?.message?.content || ''
        } catch (err) {
          console.error("OpenAI fetch failed", err)
          toast.error("Failed to connect to OpenAI. Using mock data instead.")
          // Fallthrough to mock if API fails
        }
      }
      
      if (!content) {
        // Fallback mock for local dev preview or if API fails
        console.warn("LLM not available or failed, using mock response")
        await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate delay
        content = JSON.stringify({
          activities: [
            { name: `Work on ${aspiration}`, category: "learning", startTime: "19:00", duration: 60, days: ["mon", "wed", "fri"] },
            { name: "Reflect on Progress", category: "rest", startTime: "20:00", duration: 15, days: ["sun"] }
          ]
        })
      }

      const jsonMatch = content.match(/\{[\s\S]*\}/)
      
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0])
        if (data.activities && Array.isArray(data.activities)) {
          const newActivities = data.activities.map((a: any, i: number) => ({
            ...a,
            id: `generated-${Date.now()}-${i}`,
            days: a.days.map((d: string) => d.toLowerCase())
          }))
          
          const foundConflicts = checkForConflicts(newActivities, recurringActivities)
          
          if (foundConflicts.length > 0) {
            setPendingActivities(newActivities)
            setConflicts(foundConflicts)
            setShowConflictDialog(true)
          } else {
            setRecurringActivities([...(recurringActivities || []), ...newActivities])
            toast.success(`Generated ${newActivities.length} activities for your plan!`)
          }
        } else {
          toast.error("Could not generate a valid plan. Please try again.")
        }
      } else {
        toast.error("AI response was not in the expected format.")
      }
    } catch (error) {
      console.error("Failed to generate plan:", error)
      toast.error("An error occurred while generating your plan.")
    }
  }

  return (
    <div className="space-y-4 mt-6">
      <Card className="border-sky-500/20 bg-gradient-to-r from-sky-500/5 to-background shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <Label className="text-sm font-semibold text-foreground whitespace-nowrap">Planning days:</Label>
                <div className="flex gap-2">
                  {[3, 5, 7, 90].map(num => (
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
            <div className="flex gap-2 w-full md:w-auto items-center">
              {viewMode === 'list' && (
                <div className="w-[160px] hidden md:block">
                  <Select onValueChange={scrollToDay}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Jump to day..." />
                    </SelectTrigger>
                    <SelectContent>
                      {dates.map(date => {
                        const dateStr = date.toISOString().split('T')[0]
                        const label = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                        return <SelectItem key={dateStr} value={dateStr}>{label}</SelectItem>
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 px-3"
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <GridFour className="w-4 h-4 mr-2" />
                  Grid
                </Button>
              </div>
              <Button onClick={generateSchedulesForDays} className="flex-1 md:flex-none bg-sky-500 hover:bg-sky-600 text-white shadow-md">
                <Sparkle className="w-4 h-4 mr-2" weight="duotone" />
                Generate
              </Button>
            </div>
          </div>
          {(!recurringActivities || recurringActivities.length === 0) && (
            <div className="mt-4 pt-4 border-t border-border/50 flex justify-center">
              <Button variant="outline" onClick={populateDemoAccount} className="text-sky-600 border-sky-200 hover:bg-sky-50">
                <Sparkle className="w-4 h-4 mr-2" />
                Populate Full Demo Account
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {viewMode === 'grid' ? (
        <LifeGrid 
          recurringActivities={recurringActivities} 
          goals={goals} 
          onGeneratePlan={handleGeneratePlan}
        />
      ) : (
        <>
          {mealPatternsCount > 0 && autofillMeals && (
            <Card className="border-sky-500/20 bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-sky-500/10 shadow-sm">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkle className="w-5 h-5 text-sky-500" weight="duotone" />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed pt-1">
                    <span className="font-semibold">AI-Powered Predictions Active:</span> Detected {mealPatternsCount} meal patterns from your history. Future meals and cook times will be auto-filled based on your habits.
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
                  <div key={dateStr} ref={el => { if (el) dayRefs.current[dateStr] = el }}>
                    <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all">
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
                        <DayTimeline schedule={schedule} />
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
                  </div>
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
        </>
      )}

      <Dialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <Warning className="w-5 h-5" weight="fill" />
              Schedule Conflicts Detected
            </DialogTitle>
            <DialogDescription>
              The generated plan overlaps with your existing schedule. How would you like to proceed?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="text-sm text-muted-foreground">
              Found {conflicts.length} conflicts. For example:
            </div>
            {conflicts.slice(0, 3).map((conflict, idx) => (
              <div key={idx} className="bg-muted/50 p-3 rounded-lg text-sm border border-border/50">
                <div className="font-medium text-foreground capitalize mb-1">{conflict.day}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">
                    <span className="text-xs uppercase font-bold block mb-0.5">Existing</span>
                    <span className="text-foreground">{conflict.existing.name}</span>
                    <div className="text-xs">{conflict.existing.startTime} ({conflict.existing.duration}m)</div>
                  </div>
                  <div className="text-sky-600">
                    <span className="text-xs uppercase font-bold block mb-0.5">New</span>
                    <span className="font-medium">{conflict.new.name}</span>
                    <div className="text-xs">{conflict.new.startTime} ({conflict.new.duration}m)</div>
                  </div>
                </div>
              </div>
            ))}
            {conflicts.length > 3 && (
              <div className="text-xs text-center text-muted-foreground">
                + {conflicts.length - 3} more conflicts...
              </div>
            )}
            
            <div className="bg-sky-50 dark:bg-sky-900/20 p-3 rounded-lg text-xs text-sky-700 dark:text-sky-300">
              Tip: You can adjust your planning days ({selectedDays} days) to focus on a smaller batch if this is too complex.
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => handleResolveConflict('keep-existing')}>
              Keep Existing
            </Button>
            <Button variant="default" onClick={() => handleResolveConflict('replace')} className="bg-sky-500 hover:bg-sky-600">
              Replace Conflicting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
