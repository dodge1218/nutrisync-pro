import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { TrendUp, ChartLine } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { useEffect } from 'react'

interface GBDIHistoryProps {
  currentGbdi: number
  currentDate: string
}

interface GBDIHistoryEntry {
  date: string
  score: number
}

export default function GBDIHistory({ currentGbdi, currentDate }: GBDIHistoryProps) {
  const [history, setHistory] = useKV<GBDIHistoryEntry[]>('gbdi-history', [])

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

  const points = validHistory.map((entry, index) => {
    const x = (index / (validHistory.length - 1)) * 100
    const y = getY(entry.score)
    return { x: `${x}%`, y, score: entry.score, date: entry.date }
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
            <CardTitle>GBDI Trend</CardTitle>
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
