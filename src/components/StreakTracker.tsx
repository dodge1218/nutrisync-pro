import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Flame, Calendar, TrendUp } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import type { FoodLog } from '../lib/nutritionEngine'

interface StreakTrackerProps {
  foodLogs: FoodLog[]
}

export default function StreakTracker({ foodLogs }: StreakTrackerProps) {
  const currentStreak = calculateStreak(foodLogs)
  const longestStreak = calculateLongestStreak(foodLogs)
  const last7Days = getLast7DaysStatus(foodLogs)

  const getStreakLevel = (streak: number) => {
    if (streak >= 30) return { label: 'Legendary', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30', emoji: '👑' }
    if (streak >= 14) return { label: 'Master', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30', emoji: '🔥' }
    if (streak >= 7) return { label: 'Champion', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', emoji: '⭐' }
    if (streak >= 3) return { label: 'Rising', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30', emoji: '🌱' }
    return { label: 'Starter', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-800', emoji: '💫' }
  }

  const level = getStreakLevel(currentStreak)

  return (
    <Card className="border-2 border-orange-200 dark:border-orange-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" weight="fill" />
            <CardTitle>Streak Tracker</CardTitle>
          </div>
          <Badge className={level.bgColor} variant="outline">
            <span className={`${level.color} font-medium`}>
              {level.emoji} {level.label}
            </span>
          </Badge>
        </div>
        <CardDescription>
          Keep logging daily to maintain your streak
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center border-r border-border">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-5xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                {currentStreak}
              </div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Flame className="h-4 w-4" weight="fill" />
                Current Streak
              </div>
            </motion.div>
          </div>

          <div className="flex-1 text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {longestStreak}
            </div>
            <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <TrendUp className="h-4 w-4" weight="bold" />
              Best Streak
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Last 7 Days</span>
          </div>
          <div className="flex gap-2">
            {last7Days.map((day, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex-1"
              >
                <div
                  className={`h-12 rounded-lg flex items-center justify-center font-medium text-xs transition-colors ${
                    day.logged
                      ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {day.dayName}
                </div>
                <div className="text-center text-xs text-muted-foreground mt-1">
                  {day.logged ? '✓' : '—'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {currentStreak === 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Start your streak today!</strong> Log at least one meal each day to build consistency.
            </div>
          </div>
        )}

        {currentStreak >= 3 && currentStreak < 7 && (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-sm text-green-900 dark:text-green-100">
              <strong>Great progress!</strong> {7 - currentStreak} more day{7 - currentStreak !== 1 ? 's' : ''} to reach Champion level!
            </div>
          </div>
        )}

        {currentStreak >= 7 && currentStreak < 14 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="text-sm text-yellow-900 dark:text-yellow-100">
              <strong>You're on fire!</strong> {14 - currentStreak} more day{14 - currentStreak !== 1 ? 's' : ''} to reach Master level!
            </div>
          </div>
        )}

        {currentStreak >= 14 && currentStreak < 30 && (
          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="text-sm text-orange-900 dark:text-orange-100">
              <strong>Incredible commitment!</strong> {30 - currentStreak} more day{30 - currentStreak !== 1 ? 's' : ''} to reach Legendary status!
            </div>
          </div>
        )}

        {currentStreak >= 30 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-sm text-purple-900 dark:text-purple-100">
              <strong>🎉 Legendary status achieved!</strong> You've built an amazing habit. Keep it going!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function calculateStreak(logs: FoodLog[]): number {
  if (logs.length === 0) return 0

  const dates = [...new Set(logs.map(log => log.timestamp.split('T')[0]))].sort().reverse()
  
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let currentDate = new Date(today)

  for (let i = 0; i < 365; i++) {
    const dateStr = currentDate.toISOString().split('T')[0]
    if (dates.includes(dateStr)) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

function calculateLongestStreak(logs: FoodLog[]): number {
  if (logs.length === 0) return 0

  const dates = [...new Set(logs.map(log => log.timestamp.split('T')[0]))].sort()
  let longestStreak = 1
  let currentStreak = 1

  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1])
    const currDate = new Date(dates[i])
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      currentStreak++
      longestStreak = Math.max(longestStreak, currentStreak)
    } else {
      currentStreak = 1
    }
  }

  return longestStreak
}

function getLast7DaysStatus(logs: FoodLog[]): Array<{ dayName: string; logged: boolean; date: string }> {
  const result: Array<{ dayName: string; logged: boolean; date: string }> = []
  const today = new Date()
  const logDates = new Set(logs.map(log => log.timestamp.split('T')[0]))

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    result.push({
      dayName: dayNames[date.getDay()],
      logged: logDates.has(dateStr),
      date: dateStr
    })
  }

  return result
}
