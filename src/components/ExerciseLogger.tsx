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
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Today's Burn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">{todayCalories}</span>
              <span className="text-sm text-muted-foreground">cal</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{todayMinutes} minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Weekly Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-accent">{weeklyCalories}</span>
              <span className="text-sm text-muted-foreground">cal</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{weeklyMinutes} minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Workouts This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{logs.filter(log => {
                const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
                return log.timestamp >= oneWeekAgo
              }).length}</span>
              <span className="text-sm text-muted-foreground">sessions</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Per Session</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Log Exercise
          </CardTitle>
          <CardDescription>Track your workout and calculate calories burned</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {activityCategories.map(cat => (
              <Button
                key={cat.value}
                size="sm"
                variant={filterType === cat.value ? 'default' : 'outline'}
                onClick={() => setFilterType(cat.value)}
              >
                <cat.icon className="w-4 h-4 mr-2" />
                {cat.label}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activity">Activity</Label>
              <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                <SelectTrigger id="activity">
                  <SelectValue placeholder="Select an activity" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[300px]">
                    {filteredActivities.map(activity => (
                      <SelectItem key={activity.id} value={activity.id}>
                        <div className="flex items-center justify-between w-full gap-4">
                          <span>{activity.name}</span>
                          <Badge 
                            variant="outline" 
                            className={
                              activity.intensity === 'high' 
                                ? 'text-destructive' 
                                : activity.intensity === 'moderate'
                                ? 'text-orange-600'
                                : 'text-muted-foreground'
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
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="How did it feel? Any details to remember..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {selectedExercise && duration > 0 && (
              <div className="p-4 bg-primary/10 border-2 border-primary rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Estimated Calorie Burn</span>
                </div>
                <div className="text-4xl font-bold text-primary">{caloriesBurned}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {duration} minutes of {selectedExercise.name}
                </p>
              </div>
            )}

            <Button 
              onClick={handleLogExercise} 
              className="w-full" 
              size="lg"
              disabled={!selectedActivity || duration <= 0}
            >
              <Check className="mr-2 w-5 h-5" />
              Log Exercise
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your exercise history (last 30 days)</CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <PersonSimpleRun className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No exercises logged yet</p>
              <p className="text-sm mt-1">Start tracking your workouts above!</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {logs.map(log => (
                  <div
                    key={log.id}
                    className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{log.activityName}</h4>
                        <Badge 
                          variant="outline" 
                          className={
                            log.intensity === 'high' 
                              ? 'text-destructive' 
                              : log.intensity === 'moderate'
                              ? 'text-orange-600'
                              : 'text-muted-foreground'
                          }
                        >
                          {log.intensity}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {log.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="w-4 h-4" />
                          {log.caloriesBurned} cal
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(log.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      {log.notes && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                          "{log.notes}"
                        </p>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteLog(log.id)}
                    >
                      <Trash className="w-4 h-4 text-destructive" />
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
