import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { TrendUp, ChartLine, Info } from '@phosphor-icons/react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { useKV } from '@github/spark/hooks'
import { useEffect } from 'react'

interface GutHealthHistoryProps {
  currentGbdi: number
  currentDate: string
}

interface GutHealthHistoryEntry {
  date: string
  score: number
}

export default function GutHealthHistory({ currentGbdi, currentDate }: GutHealthHistoryProps) {
  const [history, setHistory] = useKV<GutHealthHistoryEntry[]>('gbdi-history', [])

  useEffect(() => {
    if (currentGbdi > 0) {
      setHistory((prevHistory) => {
        const currentHistory = prevHistory || []
        const existingIndex = currentHistory.findIndex(entry => entry.date === currentDate)
        
        if (existingIndex >= 0) {
          const updated = [...currentHistory]
          updated[existingIndex] = { date: currentDate, score: currentGbdi }
          return updated
        } else {
          return [...currentHistory, { date: currentDate, score: currentGbdi }].slice(-30)
        }
      })
    }
  }, [currentGbdi, currentDate, setHistory])

  const validHistory = (history || []).filter(entry => entry.score > 0).slice(-7)

  if (validHistory.length < 2) {
    return null
  }

  const maxScore = 100
  const minScore = 0
  const chartHeight = 120

  const getY = (score: number) => {
    return chartHeight - ((score - minScore) / (maxScore - minScore)) * chartHeight
  }

  const getEmoji = (score: number) => {
    if (score >= 70) return '😊'
    if (score >= 50) return '😐'
    return '😔'
  }

  const getEmojiColor = (score: number) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const points = validHistory.map((entry, index) => {
    const x = (index / (validHistory.length - 1)) * 100
    const y = getY(entry.score)
    return { x: `${x}%`, y, score: entry.score, date: entry.date, emoji: getEmoji(entry.score), emojiColor: getEmojiColor(entry.score) }
  })

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ')

  const avgScore = validHistory.reduce((sum, entry) => sum + entry.score, 0) / validHistory.length
  const trend = validHistory.length >= 2 
    ? validHistory[validHistory.length - 1].score - validHistory[0].score 
    : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChartLine className="h-5 w-5 text-primary" weight="bold" />
            <CardTitle>Gut Health Trend</CardTitle>
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
          <div className="flex items-center gap-2">
            <TrendUp className={`h-4 w-4 ${trend >= 0 ? 'text-green-600' : 'text-red-600 rotate-180'}`} weight="bold" />
            <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}
            </span>
          </div>
        </div>
        <CardDescription>
          Last {validHistory.length} days • Avg: {avgScore.toFixed(0)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <svg 
          viewBox={`0 0 100 ${chartHeight}`} 
          className="w-full" 
          style={{ height: `${chartHeight}px` }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="gbdiGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.70 0.15 150)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="oklch(0.70 0.15 150)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d={`${pathData} L 100% ${chartHeight} L 0 ${chartHeight} Z`}
            fill="url(#gbdiGradient)"
          />

          <path
            d={pathData}
            fill="none"
            stroke="oklch(0.42 0.19 160)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill="oklch(0.42 0.19 160)"
                className="cursor-pointer hover:r-4 transition-all"
              />
              <text
                x={point.x}
                y={point.y}
                dy="-8"
                textAnchor="middle"
                className={`text-lg ${point.emojiColor}`}
                style={{ fontSize: '16px' }}
              >
                {point.emoji}
              </text>
            </g>
          ))}
        </svg>

        <div className="flex justify-between mt-4 text-xs text-muted-foreground">
          <span>{validHistory[0]?.date.slice(5)}</span>
          <span>{validHistory[validHistory.length - 1]?.date.slice(5)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
