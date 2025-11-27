import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Progress } from '../../ui/progress'
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { RecurringActivity, Goal } from './types'
import { parseTimeString } from '../../../lib/circadianEngine'
import { Warning, Info, CheckCircle, Sparkle, ArrowRight } from '@phosphor-icons/react'

interface LifeGridProps {
  recurringActivities: RecurringActivity[]
  goals: Goal[]
  onGeneratePlan?: (aspiration: string) => Promise<void>
}

export default function LifeGrid({ recurringActivities, goals, onGeneratePlan }: LifeGridProps) {
  const [aspiration, setAspiration] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!aspiration.trim() || !onGeneratePlan) return
    setIsGenerating(true)
    try {
      await onGeneratePlan(aspiration)
      setAspiration('')
    } finally {
      setIsGenerating(false)
    }
  }
  // Calculate daily time allocation in minutes
  const dailyAllocation = useMemo(() => {
    const allocation = new Array(24 * 60).fill('empty') // Default to empty/free time
    const categoryTotals: Record<string, number> = { empty: 24 * 60 }

    // Process recurring activities
    recurringActivities.forEach(activity => {
      const { totalMinutes: startMinutes } = parseTimeString(activity.startTime)
      const duration = activity.duration
      const endMinutes = startMinutes + duration
      
      // Fill the time slots
      for (let i = startMinutes; i < endMinutes && i < 24 * 60; i++) {
        allocation[i] = activity.category
      }

      // Update totals (approximate for average day)
      // We weight it by frequency (days per week / 7)
      const frequency = activity.days.length / 7
      const weightedDuration = duration * frequency
      
      categoryTotals[activity.category] = (categoryTotals[activity.category] || 0) + weightedDuration
      categoryTotals['empty'] -= weightedDuration
    })

    // Add goal estimated time
    goals.filter(g => g.status === 'active').forEach(goal => {
      if (goal.estimatedTimePerDay) {
        const category = goal.category || 'learning'
        categoryTotals[category] = (categoryTotals[category] || 0) + goal.estimatedTimePerDay
        categoryTotals['empty'] -= goal.estimatedTimePerDay
      }
    })

    return { allocation, categoryTotals }
  }, [recurringActivities, goals])

  // Pre-calculate weekly templates for the grid visualization
  const weekTemplates = useMemo(() => {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    const templates: Record<string, string[]> = {}

    days.forEach(day => {
      const allocation = new Array(24).fill('empty') // Default to empty/free time
      
      // Find activities for this day
      const dayActivities = recurringActivities.filter(a => 
        a.days.map(d => d.toLowerCase()).includes(day)
      )

      dayActivities.forEach(activity => {
        const { totalMinutes: startMinutes } = parseTimeString(activity.startTime)
        const startHour = Math.floor(startMinutes / 60)
        const durationHours = Math.ceil(activity.duration / 60)
        
        for (let h = startHour; h < startHour + durationHours && h < 24; h++) {
          allocation[h] = activity.category
        }
      })
      templates[day] = allocation
    })
    return templates
  }, [recurringActivities])

  const totalCommittedMinutes = Object.entries(dailyAllocation.categoryTotals)
    .filter(([cat]) => cat !== 'empty' && cat !== 'rest') // Exclude empty and rest (sleep) from "committed" work/study time? Or just empty?
    // Usually "rest" is sleep, which is committed time but not "workload".
    // The previous code excluded 'rest' from totalCommittedMinutes.
    // Let's exclude 'empty' and 'rest' to keep the "workload" calculation similar (16h awake time).
    .reduce((sum, [, mins]) => sum + mins, 0)

  const totalHours = Math.round((totalCommittedMinutes / 60) * 10) / 10
  const isOvercommitted = totalHours > 16 // Assuming 8h sleep
  const freeTime = Math.max(0, 24 - 8 - totalHours) // Assuming 8h sleep

  // Generate grid data for 90 days
  const gridHours = Array.from({ length: 24 }, (_, i) => i)
  const gridDays = Array.from({ length: 90 }, (_, i) => i + 1)

  const getDayName = (dayIndex: number) => {
    const date = new Date()
    date.setDate(date.getDate() + dayIndex)
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase()
  }

  const getCellColor = (dayIndex: number, hour: number) => {
    const dayName = getDayName(dayIndex)
    const category = weekTemplates[dayName]?.[hour] || 'empty'
    
    switch (category) {
      case 'work': return 'bg-blue-500'
      case 'exercise': return 'bg-emerald-500'
      case 'learning': return 'bg-indigo-500'
      case 'social': return 'bg-rose-500'
      case 'cooking': return 'bg-orange-500'
      case 'meal': return 'bg-amber-500'
      case 'hygiene': return 'bg-purple-500'
      case 'pet-care': return 'bg-pink-500'
      case 'rest': return 'bg-indigo-950/90 dark:bg-indigo-950' // Very dark for sleep
      case 'empty': return 'bg-slate-100 dark:bg-slate-800/30' // Very light for free time
      default: return 'bg-slate-100 dark:bg-slate-800/30'
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Life Grid: 90-Day Visualization</CardTitle>
            <CardDescription>Your typical quarter at a glance. Each square is one hour.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1 overflow-x-auto pb-2">
              <div className="flex gap-1 mb-1 sticky top-0 bg-background z-10">
                <div className="w-8 text-xs text-muted-foreground font-medium text-right pr-1">Day</div>
                {gridHours.map(h => (
                  <div key={h} className="flex-1 min-w-[12px] text-[10px] text-center text-muted-foreground">
                    {h}
                  </div>
                ))}
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {gridDays.map((day, dayIndex) => (
                  <div key={day} className="flex gap-1 h-3 mb-[1px]">
                    <div className="w-8 text-[10px] text-muted-foreground leading-3 text-right pr-1">D{day}</div>
                    {gridHours.map(hour => (
                      <div 
                        key={hour} 
                        className={`flex-1 min-w-[12px] rounded-[1px] ${getCellColor(dayIndex, hour)} opacity-80 hover:opacity-100 transition-opacity`}
                        title={`Day ${day} (${getDayName(dayIndex)}), ${hour}:00`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {['work', 'exercise', 'learning', 'social', 'rest', 'empty'].map(cat => (
                <div key={cat} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    cat === 'work' ? 'bg-blue-500' :
                    cat === 'exercise' ? 'bg-emerald-500' :
                    cat === 'learning' ? 'bg-indigo-500' :
                    cat === 'social' ? 'bg-rose-500' :
                    cat === 'rest' ? 'bg-indigo-950/90 dark:bg-indigo-950' :
                    'bg-slate-100 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700'
                  }`} />
                  <span className="text-xs capitalize text-muted-foreground">
                    {cat === 'rest' ? 'Sleep / Rest' : cat === 'empty' ? 'Free Time' : cat}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className={`border-l-4 shadow-sm ${isOvercommitted ? 'border-l-red-500' : 'border-l-green-500'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                {isOvercommitted ? <Warning className="text-red-500" /> : <CheckCircle className="text-green-500" />}
                Reality Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Committed Time</span>
                    <span className={isOvercommitted ? 'text-red-500 font-bold' : ''}>{totalHours}h / 16h</span>
                  </div>
                  <Progress 
                    value={(totalHours / 16) * 100} 
                    className={`h-2 ${isOvercommitted ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'}`} 
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    (Assuming 8h sleep)
                  </p>
                </div>

                {isOvercommitted ? (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription className="text-xs">
                      You are trying to do too much! You have {Math.abs(freeTime).toFixed(1)}h deficit. Consider removing low-leverage activities.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900 py-2">
                    <AlertDescription className="text-xs text-green-800 dark:text-green-300">
                      Great balance! You have ~{freeTime.toFixed(1)}h of free time daily for spontaneity.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Future Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                "What is one dream you want to make a reality?"
              </p>
              <div className="space-y-3">
                {goals.length === 0 && (
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-xs text-indigo-700 dark:text-indigo-300 flex flex-col gap-2">
                    <div className="flex gap-2 items-start">
                      <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>You haven't set any major ambitions yet. What is your dream aspiration?</span>
                    </div>
                    
                    {onGeneratePlan && (
                      <div className="mt-1 space-y-2">
                        <Input 
                          placeholder="e.g., Run a marathon, Learn Python, Write a book..." 
                          value={aspiration}
                          onChange={(e) => setAspiration(e.target.value)}
                          className="h-8 text-xs bg-background"
                          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <Button 
                          size="sm" 
                          className="w-full h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                          onClick={handleGenerate}
                          disabled={!aspiration.trim() || isGenerating}
                        >
                          {isGenerating ? (
                            <>
                              <Sparkle className="w-3 h-3 mr-2 animate-spin" />
                              Building Plan...
                            </>
                          ) : (
                            <>
                              <Sparkle className="w-3 h-3 mr-2" />
                              Build My 90-Day Plan
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                {totalHours > 12 && (
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-xs text-orange-700 dark:text-orange-300 flex gap-2">
                    <Warning className="w-4 h-4 flex-shrink-0" />
                    <span>High workload detected. Ensure you aren't sacrificing health or relationships.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
