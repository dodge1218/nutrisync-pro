import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Lightning, CheckCircle, Warning, Fire } from '@phosphor-icons/react'
import type { AdrenalLoadResult } from '../lib/adrenalEngine'

interface AdrenalLoadDisplayProps {
  result: AdrenalLoadResult
  compact?: boolean
}

export default function AdrenalLoadDisplay({ result, compact = false }: AdrenalLoadDisplayProps) {
  const getCategoryColor = (category: string) => {
    if (category === 'low') return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' }
    if (category === 'moderate') return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' }
    return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' }
  }

  const getIcon = () => {
    if (result.category === 'low') return <CheckCircle className="w-6 h-6 text-green-600" weight="fill" />
    if (result.category === 'moderate') return <Warning className="w-6 h-6 text-yellow-600" weight="fill" />
    return <Fire className="w-6 h-6 text-red-600" weight="fill" />
  }

  const colors = getCategoryColor(result.category)

  if (compact) {
    return (
      <Card className={`${colors.bg} border-${colors.border}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getIcon()}
              <div>
                <p className="font-semibold text-foreground">Adrenal Load Score</p>
                <p className={`text-sm ${colors.text}`}>{result.categoryLabel}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground">{result.score}</p>
              <p className="text-xs text-muted-foreground">/ 100</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightning className="w-5 h-5 text-primary" />
              Adrenal Load Score
            </CardTitle>
            <CardDescription>
              Combined dietary and stress burden on your system
            </CardDescription>
          </div>
          <Badge className={`${colors.bg} ${colors.text} border-0`}>
            {result.categoryLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getIcon()}
            <div>
              <p className="text-4xl font-bold text-foreground">{result.score}</p>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>
          </div>
          <div className="flex-1 max-w-md">
            <Progress value={result.score} className="h-3" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Dietary Load</p>
              <p className="text-lg font-bold">{result.dietaryLoad}</p>
            </div>
            <Progress value={result.dietaryLoad} className="h-2" />
            <p className="text-xs text-muted-foreground">Caffeine, sugar, processed foods</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Stress Load</p>
              <p className="text-lg font-bold">{result.stressLoad}</p>
            </div>
            <Progress value={result.stressLoad} className="h-2" />
            <p className="text-xs text-muted-foreground">Sleep, energy, symptoms</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Stress-Supportive Nutrients</h4>
          <div className="space-y-2">
            {result.supportiveNutrients.map((nutrient, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className={nutrient.status === 'low' ? 'text-destructive font-medium' : ''}>
                  {nutrient.nutrient}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {nutrient.current} / {nutrient.target}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={
                      nutrient.status === 'low' ? 'bg-red-100 text-red-700 border-red-300' :
                      nutrient.status === 'high' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                      'bg-green-100 text-green-700 border-green-300'
                    }
                  >
                    {nutrient.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Personalized Recommendations</h4>
          <ul className="space-y-2">
            {result.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
