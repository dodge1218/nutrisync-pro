import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import {
  CheckInSession,
  calculateCheckInStats,
  TaskCategory,
} from '@/lib/checkInEngine'
import { Calendar, Target, Heart, Leaf, CheckCircle, Lightning, Flame, Trophy } from '@phosphor-icons/react'
import { format, parseISO, isToday } from 'date-fns'

const categoryIcons: Record<TaskCategory, any> = {
  goal: Target,
  wellness: Heart,
  health: Leaf,
  habit: CheckCircle,
  productivity: Lightning,
  custom: Calendar,
}

export default function CheckInHistory() {
  const [sessions] = useKV<CheckInSession[]>('check-in-sessions', [])

  if (!sessions || sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Check-In History</CardTitle>
          <CardDescription>
            Your task completion history will appear here once you start doing daily check-ins
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const stats = calculateCheckInStats(sessions)
  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Check-In Performance</CardTitle>
          <CardDescription>Your accountability and completion stats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-3xl font-bold text-primary">{stats.totalSessions}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Check-Ins</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-3xl font-bold text-accent">{stats.averageCompletionRate}%</p>
              <p className="text-sm text-muted-foreground mt-1">Avg Completion</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="w-6 h-6 text-orange-500" weight="fill" />
                <p className="text-3xl font-bold text-orange-500">{stats.currentStreak}</p>
              </div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Trophy className="w-6 h-6 text-yellow-500" weight="fill" />
                <p className="text-3xl font-bold text-yellow-600">{stats.longestStreak}</p>
              </div>
              <p className="text-sm text-muted-foreground">Longest Streak</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>How well you complete different types of tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.categoryPerformance)
              .sort(([, a], [, b]) => b - a)
              .map(([category, percentage]) => {
                const Icon = categoryIcons[category as TaskCategory]
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium capitalize">{category}</span>
                      </div>
                      <span className="text-sm font-bold">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>

      {stats.mostCommittedTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Most Committed Tasks</CardTitle>
            <CardDescription>Tasks you commit to most frequently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.mostCommittedTasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <p className="text-sm flex-1">{task.description}</p>
                  <Badge variant="secondary">{task.count}x</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {stats.mostCompletedTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Highest Completion Rates</CardTitle>
            <CardDescription>Tasks you're best at completing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.mostCompletedTasks.map((task, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <p className="text-sm flex-1">{task.description}</p>
                  <Badge
                    variant={task.completionRate === 100 ? 'default' : 'secondary'}
                  >
                    {task.completionRate}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Check-Ins</CardTitle>
          <CardDescription>Last 7 days of activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSessions.map((session) => {
              const date = parseISO(session.date)
              const completedCount = session.committedTasks.filter(
                (t) => t.completed
              ).length
              const totalCount = session.committedTasks.length

              return (
                <div key={session.id} className="p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold">
                        {isToday(date) ? 'Today' : format(date, 'MMM d, yyyy')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {completedCount}/{totalCount} tasks completed
                      </p>
                    </div>
                    <Badge
                      variant={session.completionRate === 100 ? 'default' : 'secondary'}
                      className="text-lg px-3 py-1"
                    >
                      {session.completionRate}%
                    </Badge>
                  </div>
                  <Progress value={session.completionRate} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
