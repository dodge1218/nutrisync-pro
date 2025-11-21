import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { CheckCircle, Circle, Plus, Sparkle, Target, Heart, Leaf, Lightning } from '@phosphor-icons/react'
import {
  CheckInSession,
  TaskSuggestion,
  CommittedTask,
  TaskCategory,
  generateTaskSuggestions,
  calculateCompletionRate,
  getTodaySession,
  getYesterdayIncompleteTasks,
} from '@/lib/checkInEngine'
import { FoodLog } from '@/lib/nutritionEngine'
import { ulid } from 'ulid'

interface DailyCheckInProps {
  foodLogs: FoodLog[]
  activeGoals: any[]
  nutrientGaps: string[]
  recentStress?: { level: number }
}

const categoryIcons: Record<TaskCategory, any> = {
  goal: Target,
  wellness: Heart,
  health: Leaf,
  habit: CheckCircle,
  productivity: Lightning,
  custom: Circle,
}

const categoryColors: Record<TaskCategory, string> = {
  goal: 'bg-primary/10 text-primary border-primary/20',
  wellness: 'bg-accent/10 text-accent border-accent/20',
  health: 'bg-green-500/10 text-green-600 border-green-500/20',
  habit: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  productivity: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  custom: 'bg-muted text-muted-foreground border-border',
}

export default function DailyCheckIn({
  foodLogs,
  activeGoals,
  nutrientGaps,
  recentStress,
}: DailyCheckInProps) {
  const [sessions, setSessions] = useKV<CheckInSession[]>('check-in-sessions', [])
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [selectedTasks, setSelectedTasks] = useState<TaskSuggestion[]>([])
  const [customTask, setCustomTask] = useState('')
  const [customCategory, setCustomCategory] = useState<TaskCategory>('custom')

  const todaySession = getTodaySession(sessions || [])
  const yesterdayIncomplete = getYesterdayIncompleteTasks(sessions || [])

  const suggestions = generateTaskSuggestions({
    activeGoals,
    nutrientGaps,
    recentStress,
    unscheduledTime: true,
    yesterdayIncomplete,
    foodLogs,
  })

  const handleToggleSuggestion = (suggestion: TaskSuggestion) => {
    setSelectedTasks((prev) => {
      const exists = prev.find((t) => t.description === suggestion.description)
      if (exists) {
        return prev.filter((t) => t.description !== suggestion.description)
      }
      return [...prev, suggestion]
    })
  }

  const handleAddCustomTask = () => {
    if (customTask.trim()) {
      setSelectedTasks((prev) => [
        ...prev,
        {
          description: customTask.trim(),
          category: customCategory,
          reason: 'Custom task',
        },
      ])
      setCustomTask('')
    }
  }

  const handleCommit = () => {
    if (selectedTasks.length === 0) return

    const newSession: CheckInSession = {
      id: ulid(),
      date: new Date().toISOString().split('T')[0],
      checkInTime: Date.now(),
      committedTasks: selectedTasks.map((task) => ({
        id: ulid(),
        description: task.description,
        category: task.category,
        source: task.reason === 'Custom task' ? 'user-created' : 'suggested',
        completed: false,
        deferred: false,
      })),
      completionRate: 0,
      reviewedIncompleteFromYesterday: yesterdayIncomplete.length > 0,
    }

    setSessions((prevSessions) => {
      const otherSessions = (prevSessions || []).filter((s) => s.date !== newSession.date)
      return [...otherSessions, newSession]
    })

    setShowCheckIn(false)
    setSelectedTasks([])
  }

  const handleToggleTaskComplete = (taskId: string) => {
    if (!todaySession) return

    setSessions((prevSessions) => {
      return (prevSessions || []).map((session) => {
        if (session.id === todaySession.id) {
          const updatedTasks = session.committedTasks.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed ? Date.now() : undefined,
              }
            }
            return task
          })
          return {
            ...session,
            committedTasks: updatedTasks,
            completionRate: calculateCompletionRate(updatedTasks),
          }
        }
        return session
      })
    })
  }

  if (!todaySession) {
    return (
      <>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkle className="w-5 h-5 text-primary" weight="fill" />
              <CardTitle>Daily Check-In</CardTitle>
            </div>
            <CardDescription>
              Commit to 3-5 tasks for today and build accountability
            </CardDescription>
          </CardHeader>
          <CardContent>
            {yesterdayIncomplete.length > 0 && (
              <div className="mb-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <p className="text-sm font-medium text-orange-600 mb-2">
                  You have {yesterdayIncomplete.length} incomplete task
                  {yesterdayIncomplete.length > 1 ? 's' : ''} from yesterday
                </p>
                <ul className="space-y-1">
                  {yesterdayIncomplete.map((task) => (
                    <li key={task.id} className="text-sm text-muted-foreground">
                      • {task.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Button onClick={() => setShowCheckIn(true)} size="lg" className="w-full">
              <Sparkle className="w-4 h-4 mr-2" weight="fill" />
              Start Today's Check-In
            </Button>
          </CardContent>
        </Card>

        <Dialog open={showCheckIn} onOpenChange={setShowCheckIn}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Choose Your Tasks for Today</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {yesterdayIncomplete.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-orange-600">
                    From Yesterday ({yesterdayIncomplete.length})
                  </h3>
                  <div className="space-y-2">
                    {yesterdayIncomplete.map((task) => {
                      const taskAsSuggestion: TaskSuggestion = {
                        description: task.description,
                        category: task.category,
                        reason: 'You skipped this yesterday',
                      }
                      const isSelected = selectedTasks.some(
                        (t) => t.description === task.description
                      )
                      return (
                        <label
                          key={task.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleToggleSuggestion(taskAsSuggestion)}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{task.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {taskAsSuggestion.reason}
                            </p>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Suggested Tasks</h3>
                <p className="text-xs text-muted-foreground">
                  Choose 3-5 tasks to commit to today
                </p>
                <div className="grid gap-2">
                  {suggestions.map((suggestion, idx) => {
                    const isSelected = selectedTasks.some(
                      (t) => t.description === suggestion.description
                    )
                    const Icon = categoryIcons[suggestion.category]
                    return (
                      <label
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleSuggestion(suggestion)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{suggestion.description}</p>
                            <Badge
                              variant="outline"
                              className={`text-xs ${categoryColors[suggestion.category]}`}
                            >
                              <Icon className="w-3 h-3 mr-1" />
                              {suggestion.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {suggestion.reason}
                          </p>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Add Custom Task</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter your own task..."
                    value={customTask}
                    onChange={(e) => setCustomTask(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCustomTask()
                      }
                    }}
                  />
                  <select
                    className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as TaskCategory)}
                  >
                    <option value="custom">Custom</option>
                    <option value="goal">Goal</option>
                    <option value="wellness">Wellness</option>
                    <option value="health">Health</option>
                    <option value="habit">Habit</option>
                    <option value="productivity">Productivity</option>
                  </select>
                  <Button onClick={handleAddCustomTask} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
                  {selectedTasks.length < 3 && ' (minimum 3 recommended)'}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowCheckIn(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCommit}
                    disabled={selectedTasks.length === 0}
                  >
                    Commit to These Tasks
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  const completedCount = todaySession.committedTasks.filter((t) => t.completed).length
  const totalCount = todaySession.committedTasks.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" weight="fill" />
            <CardTitle>Today's Committed Tasks</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={completedCount === totalCount ? 'default' : 'secondary'}>
              {completedCount}/{totalCount} Complete
            </Badge>
            <span className="text-2xl font-bold text-primary">
              {todaySession.completionRate}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {todaySession.committedTasks.map((task) => {
            const Icon = categoryIcons[task.category]
            return (
              <label
                key={task.id}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  task.completed
                    ? 'bg-primary/5 border-primary/20'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleToggleTaskComplete(task.id)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`font-medium text-sm ${
                        task.completed ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {task.description}
                    </p>
                    <Badge
                      variant="outline"
                      className={`text-xs ${categoryColors[task.category]}`}
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {task.category}
                    </Badge>
                  </div>
                  {task.completedAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Completed at {new Date(task.completedAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </label>
            )
          })}
        </div>

        {completedCount === totalCount && (
          <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-primary" weight="fill" />
            <p className="font-semibold text-primary">Perfect Day! 🎉</p>
            <p className="text-sm text-muted-foreground mt-1">
              You completed all your committed tasks today
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
