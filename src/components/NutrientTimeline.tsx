import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import type { FoodLog } from '../lib/nutritionEngine'
import { calculateNutrientTotals, performWellnessAudit, detectNutrientGaps } from '../lib/nutritionEngine'
import { NUTRIENT_DISPLAY_NAMES, type NutrientKey } from '../lib/dailyValues'

interface NutrientTimelineProps {
  foodLogs: FoodLog[]
  nutrient: NutrientKey
  days: number
}

interface DayData {
  date: string
  value: number
  percentOfDV: number
  status: 'critical' | 'low' | 'good' | 'optimal'
}

export default function NutrientTimeline({ foodLogs, nutrient, days }: NutrientTimelineProps) {
  const getDayData = (): DayData[] => {
    const data: DayData[] = []
    const now = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const dayStart = new Date(now)
      dayStart.setDate(now.getDate() - i)
      dayStart.setHours(0, 0, 0, 0)
      
      const dayEnd = new Date(dayStart)
      dayEnd.setHours(23, 59, 59, 999)

      const dayLogs = foodLogs.filter(log => {
        const logDate = new Date(log.timestamp)
        return logDate >= dayStart && logDate <= dayEnd
      })

      const totals = calculateNutrientTotals(dayLogs)
      const gaps = detectNutrientGaps(totals)
      const gap = gaps.find(g => g.nutrient === nutrient)

      const value = totals[nutrient] || 0
      const percentOfDV = gap ? gap.percentOfDV : 0

      let status: 'critical' | 'low' | 'good' | 'optimal'
      if (percentOfDV < 50) status = 'critical'
      else if (percentOfDV < 80) status = 'low'
      else if (percentOfDV < 100) status = 'good'
      else status = 'optimal'

      data.push({
        date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value,
        percentOfDV,
        status
      })
    }

    return data
  }

  const dayData = getDayData()
  const maxValue = Math.max(...dayData.map(d => d.percentOfDV), 100)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-destructive'
      case 'low': return 'bg-orange-500'
      case 'good': return 'bg-yellow-500'
      case 'optimal': return 'bg-primary'
      default: return 'bg-muted'
    }
  }

  const average = dayData.reduce((sum, d) => sum + d.percentOfDV, 0) / dayData.length
  const trend = dayData.length >= 2 
    ? dayData[dayData.length - 1].percentOfDV - dayData[dayData.length - 2].percentOfDV 
    : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{NUTRIENT_DISPLAY_NAMES[nutrient]}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={average >= 80 ? 'default' : 'destructive'}>
              {Math.round(average)}% avg
            </Badge>
            {trend !== 0 && (
              <Badge variant="outline" className={trend > 0 ? 'text-primary' : 'text-destructive'}>
                {trend > 0 ? '+' : ''}{Math.round(trend)}%
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-end justify-between h-32 gap-1">
            {dayData.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center justify-end gap-1">
                <div className="w-full relative group">
                  <div 
                    className={`w-full rounded-t transition-all ${getStatusColor(day.status)}`}
                    style={{ 
                      height: `${Math.max((day.percentOfDV / maxValue) * 128, 4)}px`,
                      minHeight: '4px'
                    }}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                    <div className="bg-popover text-popover-foreground border rounded px-2 py-1 text-xs whitespace-nowrap shadow-lg">
                      {Math.round(day.percentOfDV)}% DV
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
            {dayData.map((day, idx) => (
              idx % Math.ceil(dayData.length / 5) === 0 && (
                <span key={idx}>{day.date}</span>
              )
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 text-xs pt-2 border-t">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-destructive" />
              <span className="text-muted-foreground">&lt;50%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-orange-500" />
              <span className="text-muted-foreground">50-80%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-500" />
              <span className="text-muted-foreground">80-100%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-primary" />
              <span className="text-muted-foreground">100%+</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
