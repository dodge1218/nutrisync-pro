import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { 
  Trophy, 
  Crown, 
  Flame, 
  Leaf, 
  Brain,
  Heart,
  Lightning,
  Star,
  Sparkle,
  Target
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import type { FoodLog } from '../lib/nutritionEngine'

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  progress?: number
  maxProgress?: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface AchievementsPanelProps {
  foodLogs: FoodLog[]
  gbdi: number
  fermentedFoodCount: number
  plantDiversityCount: number
}

export default function AchievementsPanel({ 
  foodLogs, 
  gbdi, 
  fermentedFoodCount,
  plantDiversityCount 
}: AchievementsPanelProps) {
  const today = new Date().toISOString().split('T')[0]
  const todaysLogs = foodLogs.filter(log => log.timestamp.startsWith(today))

  const last7Days = new Date()
  last7Days.setDate(last7Days.getDate() - 7)
  const weekLogs = foodLogs.filter(log => new Date(log.timestamp) >= last7Days)

  const consecutiveDaysLogged = calculateStreak(foodLogs)
  
  const totalFermentedFoods = weekLogs.filter(log => 
    log.food.tags.includes('fermented') || log.food.tags.includes('probiotic')
  ).length

  const achievements: Achievement[] = [
    {
      id: 'first-log',
      name: 'Getting Started',
      description: 'Log your first meal',
      icon: <Target className="h-6 w-6" weight="fill" />,
      unlocked: foodLogs.length >= 1,
      rarity: 'common'
    },
    {
      id: 'gut-hero',
      name: 'Gut Hero',
      description: 'Achieve GBDI score of 80+',
      icon: <Trophy className="h-6 w-6" weight="fill" />,
      unlocked: gbdi >= 80,
      rarity: 'epic'
    },
    {
      id: 'fermented-fan',
      name: 'Fermented Fan',
      description: 'Eat 7 fermented foods in a week',
      icon: <Sparkle className="h-6 w-6" weight="fill" />,
      unlocked: totalFermentedFoods >= 7,
      progress: totalFermentedFoods,
      maxProgress: 7,
      rarity: 'rare'
    },
    {
      id: 'plant-diversity-master',
      name: 'Diversity Champion',
      description: 'Eat 30+ different plant types in a week',
      icon: <Leaf className="h-6 w-6" weight="fill" />,
      unlocked: plantDiversityCount >= 30,
      progress: plantDiversityCount,
      maxProgress: 30,
      rarity: 'legendary'
    },
    {
      id: 'consistency-king',
      name: 'Consistency King',
      description: 'Log meals for 7 consecutive days',
      icon: <Flame className="h-6 w-6" weight="fill" />,
      unlocked: consecutiveDaysLogged >= 7,
      progress: consecutiveDaysLogged,
      maxProgress: 7,
      rarity: 'epic'
    },
    {
      id: 'brain-booster',
      name: 'Brain Booster',
      description: 'Reach optimal B-vitamin levels for 3 days',
      icon: <Brain className="h-6 w-6" weight="fill" />,
      unlocked: false,
      progress: 0,
      maxProgress: 3,
      rarity: 'rare'
    },
    {
      id: 'omega-warrior',
      name: 'Omega Warrior',
      description: 'Eat fatty fish 3 times this week',
      icon: <Heart className="h-6 w-6" weight="fill" />,
      unlocked: weekLogs.filter(log => 
        log.food.tags.includes('omega-3') || 
        log.food.name.toLowerCase().includes('salmon') ||
        log.food.name.toLowerCase().includes('sardine')
      ).length >= 3,
      rarity: 'rare'
    },
    {
      id: 'no-processed',
      name: 'Clean Eater',
      description: 'Go 3 days without ultra-processed foods',
      icon: <Star className="h-6 w-6" weight="fill" />,
      unlocked: false,
      progress: 0,
      maxProgress: 3,
      rarity: 'epic'
    },
    {
      id: 'perfect-day',
      name: 'Perfect Day',
      description: 'Meet 100% of DV for all major nutrients in one day',
      icon: <Crown className="h-6 w-6" weight="fill" />,
      unlocked: false,
      rarity: 'legendary'
    },
    {
      id: 'meal-master',
      name: 'Meal Master',
      description: 'Log 50 meals total',
      icon: <Lightning className="h-6 w-6" weight="fill" />,
      unlocked: foodLogs.length >= 50,
      progress: foodLogs.length,
      maxProgress: 50,
      rarity: 'rare'
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'legendary': return 'from-purple-500 to-pink-500'
      case 'epic': return 'from-purple-400 to-indigo-500'
      case 'rare': return 'from-blue-400 to-cyan-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getRarityBorder = (rarity: string) => {
    switch(rarity) {
      case 'legendary': return 'border-purple-500'
      case 'epic': return 'border-purple-400'
      case 'rare': return 'border-blue-400'
      default: return 'border-gray-400'
    }
  }

  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const lockedAchievements = achievements.filter(a => !a.unlocked)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" weight="fill" />
            <CardTitle>Achievements</CardTitle>
          </div>
          <Badge variant="secondary" className="text-lg">
            {unlockedAchievements.length}/{achievements.length}
          </Badge>
        </div>
        <CardDescription>
          Unlock achievements by improving your nutrition habits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {unlockedAchievements.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3 text-green-700 dark:text-green-400">🎉 Unlocked</h3>
            <div className="grid gap-3">
              {unlockedAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`relative overflow-hidden p-4 rounded-lg border-2 ${getRarityBorder(achievement.rarity)} bg-card`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${getRarityColor(achievement.rarity)} text-white`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-semibold">{achievement.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {achievement.description}
                      </div>
                      {achievement.maxProgress && achievement.progress !== undefined && (
                        <div className="text-xs text-green-700 dark:text-green-400 font-medium mt-1">
                          ✓ Completed: {achievement.progress}/{achievement.maxProgress}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {lockedAchievements.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3 text-muted-foreground">🔒 Locked</h3>
            <div className="grid gap-3">
              {lockedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="relative p-4 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 opacity-60"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-semibold text-muted-foreground">{achievement.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {achievement.description}
                      </div>
                      {achievement.maxProgress && achievement.progress !== undefined && (
                        <div className="mt-2 space-y-1">
                          <div className="text-xs text-muted-foreground">
                            Progress: {achievement.progress}/{achievement.maxProgress}
                          </div>
                          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div 
                              className="h-full bg-primary transition-all"
                              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
  const today = new Date().toISOString().split('T')[0]
  let currentDate = new Date(today)

  for (let i = 0; i < dates.length; i++) {
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
