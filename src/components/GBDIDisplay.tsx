import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Trophy, TrendUp, TrendDown, Minus, Sparkle, Info } from '@phosphor-icons/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { motion } from 'framer-motion'

interface GutHealthDisplayProps {
  gbdi: number
  previousGbdi?: number
  fermentedFoodCount: number
  plantDiversityCount: number
  ultraProcessedBurden: number
  gutStressorPresent: boolean
}

export default function GutHealthDisplay({ 
  gbdi, 
  previousGbdi,
  fermentedFoodCount,
  plantDiversityCount,
  ultraProcessedBurden,
  gutStressorPresent
}: GutHealthDisplayProps) {
  const getGutHealthStatus = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100', emoji: '🌟' }
    if (score >= 65) return { label: 'Good', color: 'text-green-500', bgColor: 'bg-green-50', emoji: '✨' }
    if (score >= 50) return { label: 'Fair', color: 'text-yellow-500', bgColor: 'bg-yellow-50', emoji: '⚡' }
    if (score >= 35) return { label: 'Poor', color: 'text-orange-500', bgColor: 'bg-orange-50', emoji: '⚠️' }
    return { label: 'Critical', color: 'text-red-600', bgColor: 'bg-red-50', emoji: '🚨' }
  }

  const status = getGutHealthStatus(gbdi)
  const trend = previousGbdi ? gbdi - previousGbdi : 0

  const getTrendIcon = () => {
    if (trend > 5) return <TrendUp className="h-4 w-4 text-green-600" weight="bold" />
    if (trend < -5) return <TrendDown className="h-4 w-4 text-red-600" weight="bold" />
    return <Minus className="h-4 w-4 text-muted-foreground" weight="bold" />
  }

  const getProgressColor = () => {
    if (gbdi >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-500'
    if (gbdi >= 65) return 'bg-gradient-to-r from-green-400 to-green-500'
    if (gbdi >= 50) return 'bg-gradient-to-r from-yellow-400 to-yellow-500'
    if (gbdi >= 35) return 'bg-gradient-to-r from-orange-400 to-orange-500'
    return 'bg-gradient-to-r from-red-400 to-red-500'
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" weight="fill" />
            <CardTitle>Gut Health Score</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-semibold mb-2">How Gut Health is Calculated:</p>
                  <ul className="text-xs space-y-1">
                    <li>• <strong>Fiber:</strong> 25-35g/day (25% weight)</li>
                    <li>• <strong>Fermented foods:</strong> 2+ servings/day (20%)</li>
                    <li>• <strong>Plant diversity:</strong> 30+ unique plants/week (20%)</li>
                    <li>• <strong>Polyphenols:</strong> Berries, olive oil, tea (15%)</li>
                    <li>• <strong>Prebiotics:</strong> Garlic, onions, asparagus (10%)</li>
                    <li>• <strong>Limit ultra-processed:</strong> &lt;10% of calories (10%)</li>
                    <li>• <strong>Avoid gut stressors:</strong> NSAIDs, excess alcohol (10%)</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {previousGbdi !== undefined && (
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className={`text-sm font-medium ${
                trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-muted-foreground'
              }`}>
                {trend > 0 ? '+' : ''}{trend.toFixed(0)}
              </span>
            </div>
          )}
        </div>
        <CardDescription>
          Comprehensive gut-brain-digestive wellness metric - Higher is better
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center">
          <motion.div 
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`text-6xl font-bold ${status.color}`}>
              {Math.round(gbdi)}
            </div>
            <div className="text-center mt-2">
              <Badge className={status.bgColor} variant="outline">
                <span className={`${status.color} font-medium`}>
                  {status.emoji} {status.label}
                </span>
              </Badge>
            </div>
          </motion.div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Health</span>
            <span className="font-medium">{Math.round(gbdi)}/100</span>
          </div>
          <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
            <motion.div 
              className={`h-full ${getProgressColor()}`}
              initial={{ width: 0 }}
              animate={{ width: `${gbdi}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className={`p-3 rounded-lg ${fermentedFoodCount >= 1 ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-xs text-muted-foreground mb-1">Fermented Foods</div>
            <div className={`text-2xl font-bold ${fermentedFoodCount >= 1 ? 'text-green-600' : 'text-red-600'}`}>
              {fermentedFoodCount}
            </div>
            <div className="text-xs text-muted-foreground">today</div>
          </div>

          <div className={`p-3 rounded-lg ${plantDiversityCount >= 10 ? 'bg-green-50' : 'bg-yellow-50'}`}>
            <div className="text-xs text-muted-foreground mb-1">Plant Diversity</div>
            <div className={`text-2xl font-bold ${plantDiversityCount >= 10 ? 'text-green-600' : 'text-yellow-600'}`}>
              {plantDiversityCount}
            </div>
            <div className="text-xs text-muted-foreground">varieties</div>
          </div>

          <div className={`p-3 rounded-lg ${ultraProcessedBurden < 20 ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-xs text-muted-foreground mb-1">Ultra-Processed</div>
            <div className={`text-2xl font-bold ${ultraProcessedBurden < 20 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.round(ultraProcessedBurden)}%
            </div>
            <div className="text-xs text-muted-foreground">of meals</div>
          </div>

          <div className={`p-3 rounded-lg ${!gutStressorPresent ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-xs text-muted-foreground mb-1">Gut Stressors</div>
            <div className={`text-2xl font-bold ${!gutStressorPresent ? 'text-green-600' : 'text-red-600'}`}>
              {gutStressorPresent ? 'Yes' : 'None'}
            </div>
            <div className="text-xs text-muted-foreground">detected</div>
          </div>
        </div>

        {gbdi >= 80 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200"
          >
            <div className="flex items-start gap-2">
              <Sparkle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" weight="fill" />
              <div>
                <div className="font-medium text-green-900">Outstanding!</div>
                <div className="text-sm text-green-700">
                  Your gut biome is thriving. Keep up the diverse, fiber-rich, fermented food intake!
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {gbdi < 50 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200"
          >
            <div className="flex items-start gap-2">
              <Sparkle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" weight="fill" />
              <div>
                <div className="font-medium text-red-900">Action Needed</div>
                <div className="text-sm text-red-700">
                  Focus on adding fermented foods, increasing fiber, and reducing ultra-processed foods to improve your gut health.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
