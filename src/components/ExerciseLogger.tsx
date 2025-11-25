import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  PersonSimpleRun, 
  Barbell, 
  Flame,
  Clock,
  Calendar,
  Trash,
  Plus,
  Check
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import {
  EXERCISE_ACTIVITIES,
  calculateCaloriesBurned,
  getTotalWeeklyCaloriesBurned,
  getTotalWeeklyExerciseMinutes,
  type ExerciseActivity,
  type ExerciseLog,
  type ExerciseProfile
} from '../lib/exerciseEngine'

interface ExerciseLoggerProps {
  profile: ExerciseProfile
}

export default function ExerciseLogger({ profile }: ExerciseLoggerProps) {
  const [exerciseLogs, setExerciseLogs] = useKV<ExerciseLog[]>('exercise-logs', [])
  const [selectedActivity, setSelectedActivity] = useState<string>('')
  const [duration, setDuration] = useState<number>(30)
  const [notes, setNotes] = useState<string>('')
  const [filterType, setFilterType] = useState<string>('all')

  const logs = exerciseLogs || []

  const selectedExercise = EXERCISE_ACTIVITIES.find(ex => ex.id === selectedActivity)

  const caloriesBurned = selectedExercise
    ? calculateCaloriesBurned(
        selectedExercise.metValue,
        profile.weight,
        profile.weightUnit,
        duration
      )
    : 0

  const handleLogExercise = () => {
    if (!selectedActivity || duration <= 0) {
      toast.error('Please select an activity and enter duration')
      return
    }

    const exercise = EXERCISE_ACTIVITIES.find(ex => ex.id === selectedActivity)
    if (!exercise) return

    const newLog: ExerciseLog = {
      id: `ex-${Date.now()}`,
      activityId: exercise.id,
      activityName: exercise.name,
      date: new Date().toISOString().split('T')[0],
      duration,
      caloriesBurned,
      intensity: exercise.intensity,
      notes: notes || undefined,
      timestamp: Date.now()
    }

    setExerciseLogs((currentLogs) => [newLog, ...(currentLogs || [])])
    
    setSelectedActivity('')
    setDuration(30)
    setNotes('')

    toast.success(`Logged ${exercise.name} - ${caloriesBurned} calories burned!`)
  }

  const handleDeleteLog = (logId: string) => {
    setExerciseLogs((currentLogs) => (currentLogs || []).filter(log => log.id !== logId))
    toast.success('Exercise log deleted')
  }

  const filteredActivities = filterType === 'all'
    ? EXERCISE_ACTIVITIES
    : EXERCISE_ACTIVITIES.filter(ex => ex.type === filterType)

  const weeklyCalories = getTotalWeeklyCaloriesBurned(logs)
  const weeklyMinutes = getTotalWeeklyExerciseMinutes(logs)

  const todayLogs = logs.filter(log => {
    const today = new Date().toISOString().split('T')[0]
    return log.date === today
  })

  const todayCalories = todayLogs.reduce((sum, log) => sum + log.caloriesBurned, 0)
  const todayMinutes = todayLogs.reduce((sum, log) => sum + log.duration, 0)

  const activityCategories = [
    { value: 'all', label: 'All Activities', icon: PersonSimpleRun },
    { value: 'cardio', label: 'Cardio', icon: PersonSimpleRun },
    { value: 'strength', label: 'Strength', icon: Barbell },
    { value: 'sports', label: 'Sports', icon: PersonSimpleRun },
    { value: 'flexibility', label: 'Flexibility', icon: PersonSimpleRun },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Burn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-orange-500">{todayCalories}</span>
              <span className="text-sm text-muted-foreground">cal</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{todayMinutes} minutes</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-accent">{weeklyCalories}</span>
              <span className="text-sm text-muted-foreground">cal</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{weeklyMinutes} minutes</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Workouts This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">{logs.filter(log => {
                const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
                return log.timestamp >= oneWeekAgo
              }).length}</span>
              <span className="text-sm text-muted-foreground">sessions</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Per Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-orange-600">
                {logs.length > 0 ? Math.round(logs.reduce((sum, log) => sum + log.caloriesBurned, 0) / logs.length) : 0}
              </span>
              <span className="text-sm text-muted-foreground">cal</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-accent/30 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-accent/5 to-background border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <Plus className="w-5 h-5 text-accent" weight="bold" />
            </div>
            Log Exercise
          </CardTitle>
          <CardDescription>Track your workout and calculate calories burned</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {activityCategories.map(cat => (
              <Button
                key={cat.value}
                size="sm"
                variant={filterType === cat.value ? 'default' : 'outline'}
                onClick={() => setFilterType(cat.value)}
                className={filterType === cat.value ? 'bg-accent hover:bg-accent/90' : 'hover:bg-accent/10'}
              >
                <cat.icon className="w-4 h-4 mr-2" weight="duotone" />
                {cat.label}
              </Button>
            ))}
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="activity" className="text-sm font-medium">Activity</Label>
              <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                <SelectTrigger id="activity" className="h-11">
                  <SelectValue placeholder="Select an activity" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[300px]">
                    {filteredActivities.map(activity => (
                      <SelectItem key={activity.id} value={activity.id}>
                        <div className="flex items-center justify-between w-full gap-4">
                          <span className="font-medium">{activity.name}</span>
                          <Badge 
                            variant="outline" 
                            className={
                              activity.intensity === 'high' 
                                ? 'text-destructive border-destructive/30 bg-destructive/5' 
                                : activity.intensity === 'moderate'
                                ? 'text-orange-600 border-orange-600/30 bg-orange-600/5'
                                : 'text-muted-foreground border-border bg-muted/50'
                            }
                          >
                            {activity.intensity}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="How did it feel? Any details to remember..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            {selectedExercise && duration > 0 && (
              <div className="p-5 bg-gradient-to-br from-orange-500/10 to-accent/10 border border-orange-500/20 rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-5 h-5 text-orange-500" weight="fill" />
                    <span className="font-semibold text-orange-700 dark:text-orange-400">Estimated Burn</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {duration} minutes of {selectedExercise.name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-orange-500">{caloriesBurned}</div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Calories</span>
                </div>
              </div>
            )}

            <Button 
              onClick={handleLogExercise} 
              className="w-full bg-accent hover:bg-accent/90 shadow-md h-12 text-base" 
              size="lg"
              disabled={!selectedActivity || duration <= 0}
            >
              <Check className="mr-2 w-5 h-5" weight="bold" />
              Log Exercise
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-muted/30 to-transparent border-b border-border/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Calendar className="w-5 h-5 text-muted-foreground" weight="duotone" />
            </div>
            Recent Activity
          </CardTitle>
          <CardDescription>Your exercise history (last 30 days)</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/10 rounded-xl border border-dashed border-border/50">
              <PersonSimpleRun className="w-12 h-12 mx-auto mb-4 opacity-30" weight="duotone" />
              <p className="font-medium">No exercises logged yet</p>
              <p className="text-sm mt-1 opacity-70">Start tracking your workouts above!</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {logs.map(log => (
                  <div
                    key={log.id}
                    className="flex items-start justify-between p-4 border border-border/50 rounded-xl hover:bg-accent/5 hover:border-accent/20 transition-all group bg-card shadow-sm"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-foreground">{log.activityName}</h4>
                        <Badge 
                          variant="outline" 
                          className={
                            log.intensity === 'high' 
                              ? 'text-destructive border-destructive/20 bg-destructive/5' 
                              : log.intensity === 'moderate'
                              ? 'text-orange-600 border-orange-600/20 bg-orange-600/5'
                              : 'text-muted-foreground border-border bg-muted/50'
                          }
                        >
                          {log.intensity}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-md">
                          <Clock className="w-4 h-4 text-accent" weight="duotone" />
                          {log.duration} min
                        </span>
                        <span className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-md">
                          <Flame className="w-4 h-4 text-orange-500" weight="duotone" />
                          {log.caloriesBurned} cal
                        </span>
                        <span className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-md">
                          <Calendar className="w-4 h-4 text-muted-foreground" weight="duotone" />
                          {new Date(log.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      {log.notes && (
                        <p className="text-sm text-muted-foreground mt-3 italic pl-3 border-l-2 border-accent/30">
                          "{log.notes}"
                        </p>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteLog(log.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash className="w-4 h-4" weight="duotone" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

