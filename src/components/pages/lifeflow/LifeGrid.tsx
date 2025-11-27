import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Progress } from '../../ui/progress'
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert'
import { RecurringActivity, Goal } from './types'
import { parseTimeString } from '../../../lib/circadianEngine'
import { Warning, Info, CheckCircle } from '@phosphor-icons/react'

interface LifeGridProps {
  recurringActivities: RecurringActivity[]
  goals: Goal[]
}

export default function LifeGrid({ recurringActivities, goals }: LifeGridProps) {
  // Calculate daily time allocation in minutes
  const dailyAllocation = useMemo(() => {
    const allocation = new Array(24 * 60).fill('rest') // Default to rest/sleep
    const categoryTotals: Record<string, number> = { rest: 24 * 60 }

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
      categoryTotals['rest'] -= weightedDuration
    })

    // Add goal estimated time
    goals.filter(g => g.status === 'active').forEach(goal => {
      if (goal.estimatedTimePerDay) {
        const category = goal.category || 'learning'
        categoryTotals[category] = (categoryTotals[category] || 0) + goal.estimatedTimePerDay
        categoryTotals['rest'] -= goal.estimatedTimePerDay
      }
    })

    return { allocation, categoryTotals }
  }, [recurringActivities, goals])

  const totalCommittedMinutes = Object.entries(dailyAllocation.categoryTotals)
    .filter(([cat]) => cat !== 'rest')
    .reduce((sum, [, mins]) => sum + mins, 0)

  const totalHours = Math.round((totalCommittedMinutes / 60) * 10) / 10
  const isOvercommitted = totalHours > 16 // Assuming 8h sleep
  const freeTime = Math.max(0, 24 - 8 - totalHours) // Assuming 8h sleep

  // Generate grid data for a month (30 days)
  // For now, we'll just repeat the "typical day" pattern but add some noise/variation visually if we wanted
  // or just show the ideal schedule.
  const gridHours = Array.from({ length: 24 }, (_, i) => i)
  const gridDays = Array.from({ length: 30 }, (_, i) => i + 1)

  const getHourColor = (hour: number) => {
    // Check the dominant activity in this hour
    const startMin = hour * 60
    const endMin = (hour + 1) * 60
    const counts: Record<string, number> = {}
    
    for (let i = startMin; i < endMin; i++) {
      const cat = dailyAllocation.allocation[i]
      counts[cat] = (counts[cat] || 0) + 1
    }

    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
    
    switch (dominant) {
      case 'work': return 'bg-blue-500'
      case 'exercise': return 'bg-emerald-500'
      case 'learning': return 'bg-indigo-500'
      case 'social': return 'bg-rose-500'
      case 'cooking': return 'bg-orange-500'
      case 'meal': return 'bg-amber-500'
      case 'hygiene': return 'bg-purple-500'
      case 'pet-care': return 'bg-pink-500'
      case 'rest': return 'bg-slate-200 dark:bg-slate-800'
      default: return 'bg-slate-200 dark:bg-slate-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Life Grid: 30-Day Visualization</CardTitle>
            <CardDescription>Your typical month at a glance. Each square is one hour.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1 overflow-x-auto pb-2">
              <div className="flex gap-1 mb-1">
                <div className="w-8 text-xs text-muted-foreground"></div>
                {gridHours.map(h => (
                  <div key={h} className="flex-1 min-w-[12px] text-[10px] text-center text-muted-foreground">
                    {h}
                  </div>
                ))}
              </div>
              {gridDays.map(day => (
                <div key={day} className="flex gap-1 h-3">
                  <div className="w-8 text-[10px] text-muted-foreground leading-3 text-right pr-1">D{day}</div>
                  {gridHours.map(hour => (
                    <div 
                      key={hour} 
                      className={`flex-1 min-w-[12px] rounded-[1px] ${getHourColor(hour)} opacity-80 hover:opacity-100 transition-opacity`}
                      title={`Day ${day}, ${hour}:00`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {['work', 'exercise', 'learning', 'social', 'rest'].map(cat => (
                <div key={cat} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    cat === 'work' ? 'bg-blue-500' :
                    cat === 'exercise' ? 'bg-emerald-500' :
                    cat === 'learning' ? 'bg-indigo-500' :
                    cat === 'social' ? 'bg-rose-500' :
                    'bg-slate-200 dark:bg-slate-800'
                  }`} />
                  <span className="text-xs capitalize text-muted-foreground">{cat}</span>
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
              <CardTitle className="text-base font-bold">Regret Minimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                "In 20 years, will you regret not doing this?"
              </p>
              <div className="space-y-2">
                {goals.length === 0 && (
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded text-xs text-indigo-700 dark:text-indigo-300 flex gap-2">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span>You haven't set any major ambitions yet. What's one thing you'd regret not building?</span>
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
