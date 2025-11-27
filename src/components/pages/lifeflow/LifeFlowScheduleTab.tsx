import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Label } from '../../ui/label'
import { Progress } from '../../ui/progress'
import { Badge } from '../../ui/badge'
import { 
  CalendarBlank, 
  Sparkle,
  CheckCircle,
  Circle
} from '@phosphor-icons/react'
import { DaySchedule } from './types'
import { categoryColors, activityIcons } from './constants'

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
  handleToggleActivity
}: LifeFlowScheduleTabProps) {

  const getScheduleStats = (schedule: DaySchedule) => {
    const total = schedule.activities.length
    const completed = schedule.activities.filter(a => a.isCompleted).length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, percentage }
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
    </div>
  )
}
