import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Sparkle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import type { DailySnapshot } from '../lib/historyTracking'
import { getShortDayLabel } from '../lib/historyTracking'
import { NUTRIENT_DISPLAY_NAMES, type NutrientKey } from '../lib/dailyValues'

interface HistoryLineGraphProps {
  snapshots: DailySnapshot[]
}

type MetricType = 'composite' | 'gbdi' | 'calories' | 'protein' | 'fiber' | 'vitaminC' | 'vitaminD' | 'calcium' | 'iron' | 'magnesium' | 'zinc'

interface MetricConfig {
  key: MetricType
  label: string
  color: string
  dataKey: (snapshot: DailySnapshot) => number
  unit?: string
}

const METRICS: MetricConfig[] = [
  {
    key: 'composite',
    label: 'Composite Score',
    color: '#10b981',
    dataKey: (s) => Math.round(s.compositeScore),
    unit: '%'
  },
  {
    key: 'gbdi',
    label: 'GBDI',
    color: '#8b5cf6',
    dataKey: (s) => Math.round(s.gbdi),
    unit: '%'
  },
  {
    key: 'calories',
    label: 'Calories',
    color: '#f59e0b',
    dataKey: (s) => Math.round(s.calories),
    unit: 'kcal'
  },
  {
    key: 'protein',
    label: 'Protein',
    color: '#ef4444',
    dataKey: (s) => Math.round(s.percentages.protein || 0),
    unit: '%'
  },
  {
    key: 'fiber',
    label: 'Fiber',
    color: '#06b6d4',
    dataKey: (s) => Math.round(s.percentages.fiber || 0),
    unit: '%'
  },
  {
    key: 'vitaminC',
    label: 'Vitamin C',
    color: '#ec4899',
    dataKey: (s) => Math.round(s.percentages.vitaminC || 0),
    unit: '%'
  },
  {
    key: 'vitaminD',
    label: 'Vitamin D',
    color: '#f97316',
    dataKey: (s) => Math.round(s.percentages.vitaminD || 0),
    unit: '%'
  },
  {
    key: 'calcium',
    label: 'Calcium',
    color: '#14b8a6',
    dataKey: (s) => Math.round(s.percentages.calcium || 0),
    unit: '%'
  },
  {
    key: 'iron',
    label: 'Iron',
    color: '#64748b',
    dataKey: (s) => Math.round(s.percentages.iron || 0),
    unit: '%'
  },
  {
    key: 'magnesium',
    label: 'Magnesium',
    color: '#a855f7',
    dataKey: (s) => Math.round(s.percentages.magnesium || 0),
    unit: '%'
  },
  {
    key: 'zinc',
    label: 'Zinc',
    color: '#84cc16',
    dataKey: (s) => Math.round(s.percentages.zinc || 0),
    unit: '%'
  }
]

export default function HistoryLineGraph({ snapshots }: HistoryLineGraphProps) {
  const [activeMetrics, setActiveMetrics] = useState<Set<MetricType>>(
    new Set(['composite', 'gbdi', 'calories'])
  )

  if (!snapshots || snapshots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">7-Day Nutrition Trends</CardTitle>
          <CardDescription>Start logging food to see your nutrition trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-12 text-center text-muted-foreground">
            <p>No data available yet. Begin tracking your meals to see trends over the next 7 days.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const toggleMetric = (metric: MetricType) => {
    const newMetrics = new Set(activeMetrics)
    if (newMetrics.has(metric)) {
      if (newMetrics.size > 1) {
        newMetrics.delete(metric)
      }
    } else {
      newMetrics.add(metric)
    }
    setActiveMetrics(newMetrics)
  }

  const hasExcellentPerformance = snapshots.some(s => s.compositeScore >= 90)

  const chartData = snapshots.map(snapshot => {
    const dataPoint: any = {
      name: getShortDayLabel(snapshot.date),
      fullDate: snapshot.date
    }
    
    METRICS.forEach(metric => {
      dataPoint[metric.key] = metric.dataKey(snapshot)
    })
    
    return dataPoint
  })

  const averageComposite = snapshots.length > 0
    ? Math.round(snapshots.reduce((sum, s) => sum + s.compositeScore, 0) / snapshots.length)
    : 0

  return (
    <Card className="relative overflow-hidden">
      {hasExcellentPerformance && (
        <motion.div
          className="absolute top-0 right-0 p-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <Sparkle className="w-8 h-8 text-yellow-500" weight="fill" />
          </motion.div>
        </motion.div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              7-Day Nutrition Trends
              {hasExcellentPerformance && (
                <Badge className="bg-yellow-500 text-white">90%+ Achievement!</Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-2">
              Average composite score: <span className="font-semibold text-foreground">{averageComposite}%</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {METRICS.map(metric => {
            const isActive = activeMetrics.has(metric.key)
            return (
              <Button
                key={metric.key}
                size="sm"
                variant={isActive ? 'default' : 'outline'}
                onClick={() => toggleMetric(metric.key)}
                className="text-xs"
                style={
                  isActive
                    ? {
                        backgroundColor: metric.color,
                        borderColor: metric.color,
                        color: 'white'
                      }
                    : {}
                }
              >
                {metric.label}
              </Button>
            )
          })}
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              stroke="var(--color-muted-foreground)"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="var(--color-muted-foreground)"
              domain={[0, 150]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                padding: '0.75rem'
              }}
              formatter={(value: number, name: string) => {
                const metric = METRICS.find(m => m.key === name)
                return [
                  `${value}${metric?.unit || ''}`,
                  metric?.label || name
                ]
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => {
                const metric = METRICS.find(m => m.key === value)
                return metric?.label || value
              }}
            />
            {METRICS.filter(m => activeMetrics.has(m.key)).map(metric => (
              <Line
                key={metric.key}
                type="monotone"
                dataKey={metric.key}
                stroke={metric.color}
                strokeWidth={2}
                dot={{ fill: metric.color, r: 4 }}
                activeDot={{ r: 6 }}
                name={metric.key}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        {hasExcellentPerformance && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <Sparkle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" weight="fill" />
              <div>
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                  Outstanding Performance!
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                  You've achieved 90%+ composite nutrition score. Keep up this excellent work for optimal health!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
