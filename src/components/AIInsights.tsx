import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Skeleton } from './ui/skeleton'
import { Sparkle, Info } from '@phosphor-icons/react'
import type { FoodLog } from '../lib/nutritionEngine'
import { analyzeDailyIntake } from '../lib/nutritionEngine'

interface AIInsightsProps {
  foodLogs: FoodLog[]
  daysToAnalyze?: number
}

export default function AIInsights({ foodLogs, daysToAnalyze = 7 }: AIInsightsProps) {
  const [insights, setInsights] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateInsights = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const today = new Date()
      const weekData: string[] = []
      
      for (let i = daysToAnalyze - 1; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        const dayLogs = foodLogs.filter(log => log.timestamp.startsWith(dateStr))
        
        if (dayLogs.length > 0) {
          const analysis = analyzeDailyIntake(dayLogs, { staples: true })
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
          
          weekData.push(`${dayName}:
- GBDI Score: ${Math.round(analysis.wellnessAudit.gbdi)}/100
- Gut Support: ${Math.round(analysis.gutSupportScore)}/100
- Fiber: ${Math.round(analysis.totals.fiber || 0)}g
- Fermented Foods: ${analysis.wellnessAudit.fermentedFoodCount}
- Plant Diversity: ${analysis.wellnessAudit.plantDiversityCount}
- Ultra-processed: ${Math.round(analysis.wellnessAudit.ultraProcessedBurden)}%
- Key gaps: ${analysis.gaps.filter(g => g.percentOfDV < 50).map(g => g.nutrient).join(', ') || 'None'}`)
        }
      }
      
      if (weekData.length < 2) {
        setError('Need at least 2 days of data to generate insights')
        setLoading(false)
        return
      }

      const weekDataStr = weekData.join('\n\n')
      
      const prompt = `You are a nutrition and wellness expert analyzing a user's week of eating patterns. Based on the data below, provide personalized insights in 3-4 concise bullet points. Focus on:

1. Notable patterns or trends (improving, declining, consistent)
2. Specific actionable recommendations to address gaps or optimize health
3. Positive reinforcement for good habits
4. One key priority action for the coming week

Be encouraging, specific, and practical. Avoid generic advice.

Data for the last ${daysToAnalyze} days:

${weekDataStr}

Provide insights as a bulleted list (use • for bullets). Keep each point to 1-2 sentences maximum.`

      const result = await window.spark.llm(prompt, 'gpt-4o-mini')
      setInsights(result)
    } catch (err) {
      console.error('Error generating insights:', err)
      setError('Failed to generate insights. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkle className="w-5 h-5 text-primary" weight="fill" />
          AI-Powered Weekly Insights
        </CardTitle>
        <CardDescription>
          Get personalized nutrition recommendations based on your eating patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!insights && !loading && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Analyze your last {daysToAnalyze} days of nutrition data to get personalized insights and recommendations
              </p>
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  This uses AI to identify patterns and provide tailored guidance based on your unique eating habits
                </AlertDescription>
              </Alert>
            </div>
            <Button 
              onClick={generateInsights}
              className="gap-2"
            >
              <Sparkle className="w-4 h-4" weight="fill" />
              Generate Insights
            </Button>
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {insights && !loading && (
          <div className="space-y-4">
            <Alert className="border-primary/20 bg-primary/5">
              <Sparkle className="h-4 w-4 text-primary" weight="fill" />
              <AlertTitle>Your Personalized Insights</AlertTitle>
              <AlertDescription className="mt-3">
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {insights}
                </div>
              </AlertDescription>
            </Alert>
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateInsights}
              className="w-full"
            >
              Regenerate Insights
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
