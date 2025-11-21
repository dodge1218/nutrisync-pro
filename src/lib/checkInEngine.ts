import { FoodLog } from './nutritionEngine'

export type TaskCategory = 'goal' | 'wellness' | 'health' | 'habit' | 'productivity' | 'custom'
export type TaskSource = 'suggested' | 'user-created'

export interface CommittedTask {
  id: string
  description: string
  category: TaskCategory
  source: TaskSource
  sourceGoalId?: string
  completed: boolean
  completedAt?: number
  deferred: boolean
  reminder?: {
    time: string
    enabled: boolean
  }
}

export interface CheckInSession {
  id: string
  date: string
  checkInTime: number
  committedTasks: CommittedTask[]
  completionRate: number
  reviewedIncompleteFromYesterday: boolean
}

export interface CheckInHistory {
  sessions: CheckInSession[]
  stats: {
    totalSessions: number
    averageCompletionRate: number
    currentStreak: number
    longestStreak: number
    categoryPerformance: Record<string, number>
    mostCommittedTasks: Array<{ description: string; count: number }>
    mostCompletedTasks: Array<{ description: string; completionRate: number }>
  }
}

export interface TaskSuggestion {
  description: string
  category: TaskCategory
  reason: string
}

export function generateTaskSuggestions(params: {
  activeGoals: any[]
  nutrientGaps: string[]
  recentStress?: { level: number }
  unscheduledTime: boolean
  yesterdayIncomplete: CommittedTask[]
  foodLogs: FoodLog[]
}): TaskSuggestion[] {
  const suggestions: TaskSuggestion[] = []
  const { activeGoals, nutrientGaps, recentStress, unscheduledTime, yesterdayIncomplete, foodLogs } = params

  if (yesterdayIncomplete.length > 0) {
    yesterdayIncomplete.forEach((task) => {
      suggestions.push({
        description: task.description,
        category: task.category,
        reason: 'You skipped this yesterday',
      })
    })
  }

  if (activeGoals.length > 0) {
    activeGoals.slice(0, 2).forEach((goal: any) => {
      if (goal.milestones && goal.milestones.length > 0) {
        const incompleteMilestone = goal.milestones.find((m: any) => !m.completed)
        if (incompleteMilestone) {
          suggestions.push({
            description: `Work on: ${incompleteMilestone.title}`,
            category: 'goal',
            reason: `From your goal: ${goal.title}`,
          })
        }
      }
    })
  }

  nutrientGaps.forEach((gap) => {
    suggestions.push({
      description: `Add ${gap} to your diet today`,
      category: 'health',
      reason: 'You have a nutrient gap',
    })
  })

  if (recentStress && recentStress.level >= 7) {
    suggestions.push(
      {
        description: 'Take a 10-minute walk',
        category: 'wellness',
        reason: 'High stress detected',
      },
      {
        description: '5-minute breathing exercise',
        category: 'wellness',
        reason: 'Stress management',
      }
    )
  }

  const loggedToday = foodLogs.filter((log) => {
    const logDate = new Date(log.timestamp).toDateString()
    const today = new Date().toDateString()
    return logDate === today
  })

  if (loggedToday.length === 0) {
    suggestions.push({
      description: 'Log all your meals today',
      category: 'habit',
      reason: 'Build consistency',
    })
  }

  suggestions.push(
    {
      description: 'Drink 8 glasses of water',
      category: 'health',
      reason: 'Hydration is essential',
    },
    {
      description: 'Read 10 pages',
      category: 'habit',
      reason: 'Daily learning habit',
    },
    {
      description: 'Morning sunlight (10 min)',
      category: 'wellness',
      reason: 'Circadian rhythm support',
    },
    {
      description: 'Gratitude journal entry',
      category: 'wellness',
      reason: 'Mental well-being',
    },
    {
      description: 'No phone 1 hour before bed',
      category: 'habit',
      reason: 'Better sleep quality',
    }
  )

  if (unscheduledTime) {
    suggestions.push({
      description: 'Plan tomorrow\'s schedule',
      category: 'productivity',
      reason: 'You have free time',
    })
  }

  const uniqueSuggestions = Array.from(
    new Map(suggestions.map((s) => [s.description, s])).values()
  )

  return uniqueSuggestions.slice(0, 10)
}

export function calculateCompletionRate(tasks: CommittedTask[]): number {
  if (tasks.length === 0) return 0
  const completed = tasks.filter((t) => t.completed).length
  return Math.round((completed / tasks.length) * 100)
}

export function calculateCheckInStats(sessions: CheckInSession[]): CheckInHistory['stats'] {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      averageCompletionRate: 0,
      currentStreak: 0,
      longestStreak: 0,
      categoryPerformance: {},
      mostCommittedTasks: [],
      mostCompletedTasks: [],
    }
  }

  const totalSessions = sessions.length
  const totalCompletionRate =
    sessions.reduce((sum, s) => sum + s.completionRate, 0) / sessions.length

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  for (let i = sortedSessions.length - 1; i >= 0; i--) {
    const session = sortedSessions[i]
    if (session.completionRate === 100) {
      tempStreak++
      if (session.date === today || session.date === yesterday) {
        currentStreak = tempStreak
      }
    } else {
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak
      }
      tempStreak = 0
    }
  }

  if (tempStreak > longestStreak) {
    longestStreak = tempStreak
  }

  const categoryData: Record<string, { completed: number; total: number }> = {}
  const taskFrequency: Record<string, number> = {}
  const taskCompletions: Record<string, { completed: number; total: number }> = {}

  sessions.forEach((session) => {
    session.committedTasks.forEach((task) => {
      if (!categoryData[task.category]) {
        categoryData[task.category] = { completed: 0, total: 0 }
      }
      categoryData[task.category].total++
      if (task.completed) {
        categoryData[task.category].completed++
      }

      taskFrequency[task.description] = (taskFrequency[task.description] || 0) + 1

      if (!taskCompletions[task.description]) {
        taskCompletions[task.description] = { completed: 0, total: 0 }
      }
      taskCompletions[task.description].total++
      if (task.completed) {
        taskCompletions[task.description].completed++
      }
    })
  })

  const categoryPerformance: Record<string, number> = {}
  Object.entries(categoryData).forEach(([category, data]) => {
    categoryPerformance[category] = Math.round((data.completed / data.total) * 100)
  })

  const mostCommittedTasks = Object.entries(taskFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([description, count]) => ({ description, count }))

  const mostCompletedTasks = Object.entries(taskCompletions)
    .filter(([, data]) => data.total >= 3)
    .map(([description, data]) => ({
      description,
      completionRate: Math.round((data.completed / data.total) * 100),
    }))
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 5)

  return {
    totalSessions,
    averageCompletionRate: Math.round(totalCompletionRate),
    currentStreak,
    longestStreak,
    categoryPerformance,
    mostCommittedTasks,
    mostCompletedTasks,
  }
}

export function getTodaySession(sessions: CheckInSession[]): CheckInSession | null {
  const today = new Date().toISOString().split('T')[0]
  return sessions.find((s) => s.date === today) || null
}

export function getYesterdaySession(sessions: CheckInSession[]): CheckInSession | null {
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  return sessions.find((s) => s.date === yesterday) || null
}

export function getYesterdayIncompleteTasks(sessions: CheckInSession[]): CommittedTask[] {
  const yesterday = getYesterdaySession(sessions)
  if (!yesterday) return []
  return yesterday.committedTasks.filter((t) => !t.completed && !t.deferred)
}
