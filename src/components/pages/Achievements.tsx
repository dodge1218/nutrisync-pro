import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
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
  Target,
  Medal
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { analyzeDailyIntake, type FoodLog } from '../../lib/nutritionEngine'

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

interface AchievementsProps {
  foodLogs: FoodLog[]
}

export default function Achievements({ foodLogs }: AchievementsProps) {
  const today = new Date().toISOString().split('T')[0]
  const todaysLogs = foodLogs.filter(log => log.timestamp.startsWith(today))

  const analysis = useMemo(() => {
    if (todaysLogs.length === 0) return null
    return analyzeDailyIntake(todaysLogs, { staples: true })
  }, [todaysLogs])

  const gbdi = analysis?.wellnessAudit.gbdi || 0
  const fermentedFoodCount = analysis?.wellnessAudit.fermentedFoodCount || 0
  const plantDiversityCount = analysis?.wellnessAudit.plantDiversityCount || 0

  const last7Days = new Date()
  last7Days.setDate(last7Days.getDate() - 7)
  const weekLogs = foodLogs.filter(log => new Date(log.timestamp) >= last7Days)

  const consecutiveDaysLogged = calculateStreak(foodLogs)
  
  const totalFermentedFoods = weekLogs.filter(log => 
    log.food.tags.includes('fermented') || log.food.tags.includes('probiotic')
  ).length

  const weeklyFattyFish = weekLogs.filter(log => 
    log.food.tags.includes('omega-3') || 
    log.food.name.toLowerCase().includes('salmon') ||
    log.food.name.toLowerCase().includes('sardine') ||
    log.food.name.toLowerCase().includes('mackerel')
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
      id: 'gut-master',
      name: 'Gut Master',
      description: 'Achieve perfect GBDI score of 100',
      icon: <Crown className="h-6 w-6" weight="fill" />,
      unlocked: gbdi >= 100,
      rarity: 'legendary'
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
      id: 'plant-diversity-good',
      name: 'Plant Explorer',
      description: 'Eat 15+ different plant types in a week',
      icon: <Leaf className="h-6 w-6" weight="fill" />,
      unlocked: plantDiversityCount >= 15,
      progress: plantDiversityCount,
      maxProgress: 15,
      rarity: 'rare'
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
      id: 'consistency-legend',
      name: 'Dedication Master',
      description: 'Log meals for 30 consecutive days',
      icon: <Flame className="h-6 w-6" weight="fill" />,
      unlocked: consecutiveDaysLogged >= 30,
      progress: consecutiveDaysLogged,
      maxProgress: 30,
      rarity: 'legendary'
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
      unlocked: weeklyFattyFish >= 3,
      progress: weeklyFattyFish,
      maxProgress: 3,
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
    {
      id: 'meal-legend',
      name: 'Nutrition Legend',
      description: 'Log 200 meals total',
      icon: <Medal className="h-6 w-6" weight="fill" />,
      unlocked: foodLogs.length >= 200,
      progress: foodLogs.length,
      maxProgress: 200,
      rarity: 'legendary'
    },
    {
      id: 'first-week',
      name: 'First Week',
      description: 'Track your nutrition for one full week',
      icon: <Target className="h-6 w-6" weight="fill" />,
      unlocked: consecutiveDaysLogged >= 7,
      rarity: 'common'
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

  const achievementsByRarity = {
    legendary: achievements.filter(a => a.rarity === 'legendary'),
    epic: achievements.filter(a => a.rarity === 'epic'),
    rare: achievements.filter(a => a.rarity === 'rare'),
    common: achievements.filter(a => a.rarity === 'common'),
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" weight="duotone" />
            Achievements
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Track your progress and unlock rewards
          </p>
        </div>
        <Badge variant="secondary" className="text-xl px-4 py-2 h-auto bg-amber-100 text-amber-800 border-amber-200">
          {unlockedAchievements.length}/{achievements.length} Unlocked
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-amber-900">Total Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
            </div>
            <p className="text-xs text-amber-700/80 mt-1">
              {unlockedAchievements.length} of {achievements.length} unlocked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Legendary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-500">
              {achievementsByRarity.legendary.filter(a => a.unlocked).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of {achievementsByRarity.legendary.length} unlocked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Epic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">
              {achievementsByRarity.epic.filter(a => a.unlocked).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of {achievementsByRarity.epic.length} unlocked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Rare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">
              {achievementsByRarity.rare.filter(a => a.unlocked).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of {achievementsByRarity.rare.length} unlocked
            </p>
          </CardContent>
        </Card>
      </div>

      {unlockedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkle className="h-5 w-5 text-green-600" weight="fill" />
              <CardTitle>Unlocked Achievements</CardTitle>
            </div>
            <CardDescription>
              Congratulations on your accomplishments!
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {unlockedAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`relative overflow-hidden p-4 rounded-lg border-2 ${getRarityBorder(achievement.rarity)} bg-gradient-to-br ${getRarityColor(achievement.rarity)} bg-opacity-10`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${getRarityColor(achievement.rarity)} text-white shrink-0`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <div className="font-semibold">{achievement.name}</div>
                      <Badge variant="outline" className="text-xs uppercase">
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {achievement.description}
                    </div>
                    {achievement.maxProgress && achievement.progress !== undefined && (
                      <div className="text-xs text-green-700 font-medium mt-1">
                        ✓ Completed: {achievement.progress}/{achievement.maxProgress}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {lockedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-muted-foreground" weight="fill" />
              <CardTitle>Locked Achievements</CardTitle>
            </div>
            <CardDescription>
              Keep going to unlock these achievements
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {lockedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="relative p-4 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 opacity-60"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <div className="font-semibold text-muted-foreground">{achievement.name}</div>
                      <Badge variant="outline" className="text-xs uppercase">
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
          </CardContent>
        </Card>
      )}
    </div>
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
