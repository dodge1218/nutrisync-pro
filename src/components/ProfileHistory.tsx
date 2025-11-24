import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  TrendUp, 
  TrendDown, 
  Minus,
  Activity,
  Heart,
  Brain,
  Leaf,
  ChartLine
} from '@phosphor-icons/react'
import {
  calculateProfileTrends,
  calculateNutrientAdequacyTrends,
  getProfileInsights,
  type ProfileSnapshot,
  type NutrientAdequacySnapshot,
  type ProfileTrend
} from '@/lib/profileHistoryEngine'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function ProfileHistory() {
  const [profileSnapshots] = useKV<ProfileSnapshot[]>('profile-history', [])
  const [nutrientSnapshots] = useKV<NutrientAdequacySnapshot[]>('nutrient-adequacy-history', [])
  const [profileTrends, setProfileTrends] = useState<ProfileTrend[]>([])
  const [nutrientTrends, setNutrientTrends] = useState<ProfileTrend[]>([])
  const [insights, setInsights] = useState<string[]>([])
  const [view, setView] = useState<'profile' | 'nutrition'>('profile')

  const snapshots = profileSnapshots || []
  const nutSnapshots = nutrientSnapshots || []

  useEffect(() => {
    if (snapshots.length >= 2) {
      setProfileTrends(calculateProfileTrends(snapshots))
    }
    if (nutSnapshots.length >= 2) {
      setNutrientTrends(calculateNutrientAdequacyTrends(nutSnapshots))
    }
    
    if (snapshots.length >= 2 || nutSnapshots.length >= 2) {
      const pTrends = snapshots.length >= 2 ? calculateProfileTrends(snapshots) : []
      const nTrends = nutSnapshots.length >= 2 ? calculateNutrientAdequacyTrends(nutSnapshots) : []
      setInsights(getProfileInsights(pTrends, nTrends))
    }
  }, [snapshots.length, nutSnapshots.length])

  const getTrendIcon = (direction: string) => {
    if (direction === 'improving') return <TrendUp className="w-5 h-5 text-green-600" />
    if (direction === 'declining') return <TrendDown className="w-5 h-5 text-red-600" />
    return <Minus className="w-5 h-5 text-gray-400" />
  }

  const getTrendColor = (direction: string) => {
    if (direction === 'improving') return 'bg-green-100 text-green-800'
    if (direction === 'declining') return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getConfidenceBadge = (confidence: string) => {
    if (confidence === 'high') return <Badge variant="default" className="bg-green-600">High Confidence</Badge>
    if (confidence === 'medium') return <Badge variant="secondary">Medium</Badge>
    return <Badge variant="outline">Low Data</Badge>
  }

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'weight':
      case 'bmi':
        return <Activity className="w-5 h-5" />
      case 'stress':
        return <Brain className="w-5 h-5" />
      case 'sleep':
        return <Heart className="w-5 h-5" />
      case 'gut-health':
        return <Leaf className="w-5 h-5" />
      default:
        return <ChartLine className="w-5 h-5" />
    }
  }

  const profileChartData = snapshots
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-14)
    .map(s => ({
      date: new Date(s.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: s.weight,
      bmi: s.bmi,
      stress: s.stressLevel
    }))

  const nutrientChartData = nutSnapshots
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-14)
    .map(s => ({
      date: new Date(s.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      adequacy: s.nutrientScores.overallAdequacy,
      gutHealth: s.gutHealthScore,
      protein: s.nutrientScores.protein,
      fiber: s.nutrientScores.fiber
    }))

  if (snapshots.length < 2 && nutSnapshots.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartLine className="w-6 h-6 text-primary" />
            Profile History
          </CardTitle>
          <CardDescription>
            Track your progress over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <ChartLine className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Not enough data yet</p>
            <p className="text-sm mt-2">
              Keep logging and updating your profile to see trends. We'll show your progress after a few updates.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ChartLine className="w-6 h-6 text-primary" />
                Profile History & Trends
              </CardTitle>
              <CardDescription>
                Your health journey over the last {Math.max(snapshots.length, nutSnapshots.length)} updates
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={view === 'profile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('profile')}
              >
                <Activity className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant={view === 'nutrition' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('nutrition')}
              >
                <Leaf className="w-4 h-4 mr-2" />
                Nutrition
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {insights.length > 0 && (
            <div className="mb-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                <Brain className="w-4 h-4 text-accent" />
                Key Insights
              </h4>
              <ul className="space-y-1">
                {insights.map((insight, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">
                    • {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {view === 'profile' && profileChartData.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-4">Profile Metrics Over Time</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={profileChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  {profileChartData.some(d => d.weight) && (
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="oklch(0.42 0.19 160)"
                      strokeWidth={2}
                      name="Weight (kg)"
                      dot={{ r: 4 }}
                    />
                  )}
                  {profileChartData.some(d => d.bmi) && (
                    <Line
                      type="monotone"
                      dataKey="bmi"
                      stroke="oklch(0.70 0.15 150)"
                      strokeWidth={2}
                      name="BMI"
                      dot={{ r: 4 }}
                    />
                  )}
                  {profileChartData.some(d => d.stress) && (
                    <Line
                      type="monotone"
                      dataKey="stress"
                      stroke="oklch(0.60 0.22 25)"
                      strokeWidth={2}
                      name="Stress Level"
                      dot={{ r: 4 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {view === 'nutrition' && nutrientChartData.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium mb-4">Nutrition Metrics Over Time</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={nutrientChartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="adequacy"
                    stroke="oklch(0.42 0.19 160)"
                    strokeWidth={2}
                    name="Overall Adequacy (%)"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gutHealth"
                    stroke="oklch(0.70 0.15 150)"
                    strokeWidth={2}
                    name="Gut Health Score"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="protein"
                    stroke="oklch(0.60 0.22 25)"
                    strokeWidth={2}
                    name="Protein (%DV)"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="fiber"
                    stroke="oklch(0.88 0.05 130)"
                    strokeWidth={2}
                    name="Fiber (%DV)"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {view === 'profile' && profileTrends.map((trend, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${getTrendColor(trend.direction)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getMetricIcon(trend.metric)}
                    <span className="font-semibold capitalize">
                      {trend.metric.replace('-', ' ')}
                    </span>
                  </div>
                  {getTrendIcon(trend.direction)}
                </div>
                <p className="text-sm mb-2">{trend.message}</p>
                {getConfidenceBadge(trend.confidence)}
              </div>
            ))}
            
            {view === 'nutrition' && nutrientTrends.map((trend, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${getTrendColor(trend.direction)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getMetricIcon(trend.metric)}
                    <span className="font-semibold capitalize">
                      {trend.metric.replace('-', ' ')}
                    </span>
                  </div>
                  {getTrendIcon(trend.direction)}
                </div>
                <p className="text-sm mb-2">{trend.message}</p>
                {getConfidenceBadge(trend.confidence)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
