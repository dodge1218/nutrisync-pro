import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calendar, TrendUp, TrendDown, Minus, Plus, X } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { toast } from 'sonner'
import { format, parseISO, subDays } from 'date-fns'

export interface ProfileHistoryEntry {
  date: string
  weight?: number
  bmi?: number
  waistCircumference?: number
  bodyFatPercentage?: number
  notes?: string
}

export default function ProfileHistory() {
  const [history, setHistory] = useKV<ProfileHistoryEntry[]>('profile-history', [])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'bmi' | 'waist' | 'bodyFat'>('weight')
  const [newEntry, setNewEntry] = useState<ProfileHistoryEntry>({
    date: format(new Date(), 'yyyy-MM-dd'),
    weight: undefined,
    bmi: undefined,
    waistCircumference: undefined,
    bodyFatPercentage: undefined,
    notes: ''
  })

  const sortedHistory = useMemo(() => {
    return [...(history || [])].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }, [history])

  const last30Days = useMemo(() => {
    return sortedHistory.filter(entry => {
      const entryDate = parseISO(entry.date)
      const thirtyDaysAgo = subDays(new Date(), 30)
      return entryDate >= thirtyDaysAgo
    })
  }, [sortedHistory])

  const metricData = useMemo(() => {
    return last30Days.map(entry => ({
      date: format(parseISO(entry.date), 'MMM d'),
      weight: entry.weight,
      bmi: entry.bmi,
      waist: entry.waistCircumference,
      bodyFat: entry.bodyFatPercentage
    }))
  }, [last30Days])

  const calculateBMI = (weight: number, heightCm: number) => {
    const heightM = heightCm / 100
    return weight / (heightM * heightM)
  }

  const getTrend = (metric: 'weight' | 'bmi' | 'waist' | 'bodyFat') => {
    if (last30Days.length < 2) return null
    
    const recent = last30Days.slice(-5)
    const values = recent.map(e => {
      switch(metric) {
        case 'weight': return e.weight
        case 'bmi': return e.bmi
        case 'waist': return e.waistCircumference
        case 'bodyFat': return e.bodyFatPercentage
        default: return undefined
      }
    }).filter(v => v !== undefined) as number[]

    if (values.length < 2) return null

    const firstValue = values[0]
    const lastValue = values[values.length - 1]
    const percentChange = ((lastValue - firstValue) / firstValue) * 100

    return {
      direction: percentChange > 1 ? 'up' : percentChange < -1 ? 'down' : 'stable',
      change: Math.abs(percentChange).toFixed(1)
    }
  }

  const latestEntry = sortedHistory[sortedHistory.length - 1]

  const addEntry = () => {
    if (!newEntry.weight && !newEntry.bmi && !newEntry.waistCircumference && !newEntry.bodyFatPercentage) {
      toast.error('Please enter at least one measurement')
      return
    }

    const updatedHistory = [...(history || [])]
    const existingIndex = updatedHistory.findIndex(e => e.date === newEntry.date)
    
    if (existingIndex >= 0) {
      updatedHistory[existingIndex] = newEntry
      toast.success('Entry updated')
    } else {
      updatedHistory.push(newEntry)
      toast.success('Entry added')
    }

    setHistory(updatedHistory)
    setIsAddDialogOpen(false)
    setNewEntry({
      date: format(new Date(), 'yyyy-MM-dd'),
      weight: undefined,
      bmi: undefined,
      waistCircumference: undefined,
      bodyFatPercentage: undefined,
      notes: ''
    })
  }

  const deleteEntry = (date: string) => {
    const filtered = (history || []).filter(e => e.date !== date)
    setHistory(filtered)
    toast.success('Entry deleted')
  }

  const weightTrend = getTrend('weight')
  const bmiTrend = getTrend('bmi')

  const metricConfig = {
    weight: { label: 'Weight (lb)', color: '#10b981', dataKey: 'weight' },
    bmi: { label: 'BMI', color: '#3b82f6', dataKey: 'bmi' },
    waist: { label: 'Waist (in)', color: '#f59e0b', dataKey: 'waist' },
    bodyFat: { label: 'Body Fat (%)', color: '#ef4444', dataKey: 'bodyFat' }
  }

  const config = metricConfig[selectedMetric]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Profile History</h2>
          <p className="text-muted-foreground">Track your body metrics over time</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Log Measurements
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Log Body Measurements</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  max={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>

              <div>
                <Label htmlFor="weight">Weight (lb)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 165.5"
                  value={newEntry.weight || ''}
                  onChange={(e) => setNewEntry({ ...newEntry, weight: e.target.value ? parseFloat(e.target.value) : undefined })}
                />
              </div>

              <div>
                <Label htmlFor="waist">Waist Circumference (inches)</Label>
                <Input
                  id="waist"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 32.5"
                  value={newEntry.waistCircumference || ''}
                  onChange={(e) => setNewEntry({ ...newEntry, waistCircumference: e.target.value ? parseFloat(e.target.value) : undefined })}
                />
              </div>

              <div>
                <Label htmlFor="bodyFat">Body Fat Percentage (%)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 18.5"
                  value={newEntry.bodyFatPercentage || ''}
                  onChange={(e) => setNewEntry({ ...newEntry, bodyFatPercentage: e.target.value ? parseFloat(e.target.value) : undefined })}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="e.g., Morning weight, after workout"
                  value={newEntry.notes || ''}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                />
              </div>

              <Button onClick={addEntry} className="w-full">
                Save Measurements
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {sortedHistory.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No measurements yet</h3>
          <p className="text-muted-foreground mb-4">
            Start tracking your body metrics to see progress over time
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            Log Your First Measurement
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestEntry?.weight && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Current Weight</span>
                  {weightTrend && (
                    <Badge variant={weightTrend.direction === 'down' ? 'default' : weightTrend.direction === 'up' ? 'secondary' : 'outline'}>
                      {weightTrend.direction === 'up' ? (
                        <TrendUp className="w-3 h-3 mr-1" />
                      ) : weightTrend.direction === 'down' ? (
                        <TrendDown className="w-3 h-3 mr-1" />
                      ) : (
                        <Minus className="w-3 h-3 mr-1" />
                      )}
                      {weightTrend.change}%
                    </Badge>
                  )}
                </div>
                <div className="text-2xl font-bold">{latestEntry.weight} lb</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {format(parseISO(latestEntry.date), 'MMM d, yyyy')}
                </div>
              </Card>
            )}

            {latestEntry?.bmi && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Current BMI</span>
                  {bmiTrend && (
                    <Badge variant={bmiTrend.direction === 'down' ? 'default' : bmiTrend.direction === 'up' ? 'secondary' : 'outline'}>
                      {bmiTrend.direction === 'up' ? (
                        <TrendUp className="w-3 h-3 mr-1" />
                      ) : bmiTrend.direction === 'down' ? (
                        <TrendDown className="w-3 h-3 mr-1" />
                      ) : (
                        <Minus className="w-3 h-3 mr-1" />
                      )}
                      {bmiTrend.change}%
                    </Badge>
                  )}
                </div>
                <div className="text-2xl font-bold">{latestEntry.bmi.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {latestEntry.bmi < 18.5 ? 'Underweight' :
                   latestEntry.bmi < 25 ? 'Normal' :
                   latestEntry.bmi < 30 ? 'Overweight' : 'Obese'}
                </div>
              </Card>
            )}

            {latestEntry?.waistCircumference && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Waist</span>
                </div>
                <div className="text-2xl font-bold">{latestEntry.waistCircumference} in</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {format(parseISO(latestEntry.date), 'MMM d, yyyy')}
                </div>
              </Card>
            )}

            {latestEntry?.bodyFatPercentage && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Body Fat</span>
                </div>
                <div className="text-2xl font-bold">{latestEntry.bodyFatPercentage}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {format(parseISO(latestEntry.date), 'MMM d, yyyy')}
                </div>
              </Card>
            )}
          </div>

          {metricData.length >= 2 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Trend (Last 30 Days)</h3>
                <div className="flex gap-2">
                  {(Object.keys(metricConfig) as Array<keyof typeof metricConfig>).map((key) => (
                    <Button
                      key={key}
                      size="sm"
                      variant={selectedMetric === key ? 'default' : 'outline'}
                      onClick={() => setSelectedMetric(key)}
                    >
                      {metricConfig[key].label.split(' ')[0]}
                    </Button>
                  ))}
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metricData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={config.dataKey}
                    stroke={config.color}
                    strokeWidth={2}
                    name={config.label}
                    dot={{ fill: config.color, r: 4 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Entries</h3>
            <div className="space-y-3">
              {sortedHistory.slice(-10).reverse().map((entry) => (
                <div key={entry.date} className="flex items-start justify-between p-3 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{format(parseISO(entry.date), 'MMMM d, yyyy')}</div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      {entry.weight && <span>Weight: {entry.weight} lb</span>}
                      {entry.bmi && <span>BMI: {entry.bmi.toFixed(1)}</span>}
                      {entry.waistCircumference && <span>Waist: {entry.waistCircumference} in</span>}
                      {entry.bodyFatPercentage && <span>Body Fat: {entry.bodyFatPercentage}%</span>}
                    </div>
                    {entry.notes && (
                      <div className="text-sm text-muted-foreground mt-1 italic">{entry.notes}</div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteEntry(entry.date)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
