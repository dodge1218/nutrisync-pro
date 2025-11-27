import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Sparkle, ChartLine, ChartBar } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import type { DailySnapshot } from '../lib/historyTracking'
import { getShortDayLabel, calculateMicronutrientComposite, calculateVitaminComposite } from '../lib/historyTracking'
import { NUTRIENT_DISPLAY_NAMES, type NutrientKey } from '../lib/dailyValues'

interface HistoryLineGraphProps {
  snapshots: DailySnapshot[]
}

type MetricType = 'composite' | 'gbdi' | 'protein' | 'fiber' | 'calories' | 'micronutrientComposite' | 'vitaminComposite'

interface MetricConfig {
  key: MetricType
  label: string
  color: string
  dataKey: (snapshot: DailySnapshot, unit: 'percent' | 'amount') => number
  unit: (unit: 'percent' | 'amount') => string
  yAxisId: 'left' | 'right'
}

const METRICS: MetricConfig[] = [
  {
    key: 'composite',
    label: 'Composite Score',
    color: '#10b981',
    dataKey: (s) => Math.round(s.compositeScore),
    unit: () => '%',
    yAxisId: 'left'
  },
  {
    key: 'gbdi',
    label: 'GBDI',
    color: '#8b5cf6',
    dataKey: (s) => Math.round(s.gbdi),
    unit: () => '%',
    yAxisId: 'left'
  },
  {
    key: 'protein',
    label: 'Protein',
    color: '#ef4444',
    dataKey: (s, unit) => unit === 'percent' ? Math.round(s.percentages.protein || 0) : Math.round(s.totals.protein || 0),
    unit: (unit) => unit === 'percent' ? '%' : 'g',
    yAxisId: 'left'
  },
  {
    key: 'fiber',
    label: 'Fiber',
    color: '#06b6d4',
    dataKey: (s, unit) => unit === 'percent' ? Math.round(s.percentages.fiber || 0) : Math.round(s.totals.fiber || 0),
    unit: (unit) => unit === 'percent' ? '%' : 'g',
    yAxisId: 'left'
  },
  {
    key: 'calories',
    label: 'Calories',
    color: '#f59e0b',
    dataKey: (s) => Math.round(s.calories),
    unit: () => 'kcal',
    yAxisId: 'right'
  },
  {
    key: 'micronutrientComposite',
    label: 'Minerals Avg',
    color: '#14b8a6',
    dataKey: (s) => Math.round(calculateMicronutrientComposite(s.totals)),
    unit: () => '%',
    yAxisId: 'left'
  },
  {
    key: 'vitaminComposite',
    label: 'Vitamins Avg',
    color: '#ec4899',
    dataKey: (s) => Math.round(calculateVitaminComposite(s.totals)),
    unit: () => '%',
    yAxisId: 'left'
  }
]

export default function HistoryLineGraph({ snapshots }: HistoryLineGraphProps) {
  const [activeMetrics, setActiveMetrics] = useState<Set<MetricType>>(
    new Set(['composite', 'protein', 'fiber'])
  )
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')
  const [displayUnit, setDisplayUnit] = useState<'percent' | 'amount'>('percent')

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

  // Generate 7 days window including future days if needed
  const generateChartData = () => {
    const data = []
    const today = new Date()
    // Create a map of existing snapshots
    const snapshotMap = new Map(snapshots.map(s => [s.date, s]))

    // Generate last 5 days + today + next 1 day (total 7)
    for (let i = 5; i >= -1; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const snapshot = snapshotMap.get(dateStr)

      const dataPoint: any = {
        name: getShortDayLabel(dateStr),
        fullDate: dateStr,
        isFuture: i < 0
      }

      METRICS.forEach(metric => {
        if (snapshot) {
          dataPoint[metric.key] = metric.dataKey(snapshot, displayUnit)
          // Calculate goal for outline
          if (metric.key === 'calories') {
             // Infer goal from percentage if available, else default 2000
             const pct = snapshot.percentages.calories || 0
             const val = snapshot.calories
             dataPoint[`${metric.key}Goal`] = pct > 0 ? Math.round(val / (pct / 100)) : 2000
          } else if (metric.key === 'protein' && displayUnit === 'amount') {
             const pct = snapshot.percentages.protein || 0
             const val = snapshot.totals.protein || 0
             dataPoint[`${metric.key}Goal`] = pct > 0 ? Math.round(val / (pct / 100)) : 50
          } else {
             dataPoint[`${metric.key}Goal`] = 100 // Default for %
          }
        } else {
          dataPoint[metric.key] = 0
          // Default goals for future/missing days
          if (metric.key === 'calories') dataPoint[`${metric.key}Goal`] = 2000
          else if (metric.key === 'protein' && displayUnit === 'amount') dataPoint[`${metric.key}Goal`] = 50 // Approx
          else dataPoint[`${metric.key}Goal`] = 100
        }
      })
      data.push(dataPoint)
    }
    return data
  }

  const chartData = generateChartData()

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
                <Badge className="bg-yellow-500 text-yellow-950 hover:bg-yellow-600">90%+ Achievement!</Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-2">
              Average composite score: <span className="font-semibold text-foreground">{averageComposite}%</span>
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="unit-toggle" className="text-xs">Grams</Label>
              <Switch 
                id="unit-toggle"
                checked={displayUnit === 'percent'}
                onCheckedChange={(checked) => setDisplayUnit(checked ? 'percent' : 'amount')}
              />
              <Label htmlFor="unit-toggle" className="text-xs">% DV</Label>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={chartType === 'line' ? 'default' : 'outline'}
                onClick={() => setChartType('line')}
              >
                <ChartLine className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={chartType === 'bar' ? 'default' : 'outline'}
                onClick={() => setChartType('bar')}
              >
                <ChartBar className="w-4 h-4" />
              </Button>
            </div>
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
          <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              stroke="var(--color-muted-foreground)"
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              stroke="var(--color-muted-foreground)"
              domain={displayUnit === 'percent' ? [0, 150] : ['auto', 'auto']}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              stroke="#f59e0b"
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                padding: '0.75rem'
              }}
              formatter={(value: number, name: string) => {
                if (name.includes('Goal')) return [value, 'Goal']
                const metric = METRICS.find(m => m.key === name)
                return [
                  `${value}${metric?.unit(displayUnit) || ''}`,
                  metric?.label || name
                ]
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => {
                if (value.includes('Goal')) return 'Goal / Deficit'
                const metric = METRICS.find(m => m.key === value)
                return metric?.label || value
              }}
            />
            
            {METRICS.filter(m => activeMetrics.has(m.key)).map(metric => {
              const isBar = chartType === 'bar'
              
              return (
                <片>
                  {/* Goal Outline (Only for Bar chart mode and primarily for Calories/Protein) */}
                  {isBar && (metric.key === 'calories' || (metric.key === 'protein' && displayUnit === 'amount')) && (
                    <Bar
                      key={`${metric.key}-goal`}
                      dataKey={`${metric.key}Goal`}
                      yAxisId={metric.yAxisId}
                      fill="transparent"
                      stroke={metric.color}
                      strokeDasharray="4 4"
                      strokeWidth={1}
                      barSize={20}
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={false}
                    />
                  )}

                  {isBar ? (
                    <Bar
                      key={metric.key}
                      dataKey={metric.key}
                      yAxisId={metric.yAxisId}
                      fill={metric.color}
                      name={metric.key}
                      radius={[4, 4, 0, 0]}
                      barSize={20}
                    />
                  ) : (
                    <Line
                      key={metric.key}
                      type="monotone"
                      dataKey={metric.key}
                      yAxisId={metric.yAxisId}
                      stroke={metric.color}
                      strokeWidth={2}
                      dot={{ fill: metric.color, r: 4 }}
                      activeDot={{ r: 6 }}
                      name={metric.key}
                    />
                  )}
                  
                  {/* Average Trendline (Only in Bar mode as requested) */}
                  {isBar && (
                    <Line
                      key={`${metric.key}-trend`}
                      type="monotone"
                      dataKey={metric.key}
                      yAxisId={metric.yAxisId}
                      stroke={metric.color}
                      strokeWidth={2}
                      dot={false}
                      strokeOpacity={0.5}
                    />
                  )}
                </片>
              )
            })}
          </ComposedChart>
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
