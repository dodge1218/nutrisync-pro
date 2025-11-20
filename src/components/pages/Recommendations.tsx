import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Separator } from '../ui/separator'
import { Lightbulb, Warning, Sparkle, ShoppingCart } from '@phosphor-icons/react'
import { analyzeDailyIntake, type FoodLog } from '../../lib/nutritionEngine'
import { matchProductsToGaps } from '../../lib/affiliate'

interface RecommendationsProps {
  foodLogs: FoodLog[]
}

export default function Recommendations({ foodLogs }: RecommendationsProps) {
  const today = new Date().toISOString().split('T')[0]
  const todaysLogs = foodLogs.filter(log => log.timestamp.startsWith(today))

  const analysis = useMemo(() => {
    if (todaysLogs.length === 0) return null
    return analyzeDailyIntake(todaysLogs, { staples: true })
  }, [todaysLogs])

  const matchedProducts = useMemo(() => {
    if (!analysis) return []
    return matchProductsToGaps(analysis.gaps)
  }, [analysis])

  if (todaysLogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data Yet</CardTitle>
          <CardDescription>
            Log some meals first to see personalized recommendations
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!analysis) return null

  return (
    <div className="space-y-6">
      <Alert className="border-amber-200 bg-amber-50">
        <ShoppingCart className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-900">Product Recommendations Disclaimer</AlertTitle>
        <AlertDescription className="text-amber-800">
          Some recommendations may contain affiliate links. We may earn commissions on purchases.
          Always prioritize food-first solutions and consult your healthcare provider before taking supplements.
        </AlertDescription>
      </Alert>

      {analysis.synergySuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkle className="text-primary" weight="fill" />
              Synergy Suggestions
            </CardTitle>
            <CardDescription>
              Optimize nutrient absorption with these food pairings and timing adjustments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.synergySuggestions.map((suggestion, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start gap-2">
                  <Badge variant={
                    suggestion.priority === 'high' ? 'default' :
                    suggestion.priority === 'medium' ? 'secondary' : 'outline'
                  }>
                    {suggestion.priority}
                  </Badge>
                  <div className="flex-1">
                    <div className="font-medium">{suggestion.title}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {suggestion.description}
                    </p>
                    {suggestion.warmOption && (
                      <Alert className="mt-2 bg-green-50 border-green-200">
                        <Lightbulb className="h-4 w-4 text-green-600" weight="fill" />
                        <AlertDescription className="text-sm text-green-800">
                          <strong>Warm option:</strong> {suggestion.warmOption}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
                {index < analysis.synergySuggestions.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {analysis.timingConflicts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warning className="text-destructive" weight="fill" />
              Timing Conflicts Detected
            </CardTitle>
            <CardDescription>
              These meal timing issues may reduce nutrient absorption
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.timingConflicts.map((conflict, index) => (
              <div key={index} className="space-y-2">
                <div>
                  <Badge variant="destructive" className="mb-2">
                    {conflict.impact} impact
                  </Badge>
                  <p className="text-sm font-medium">{conflict.description}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Affected: {conflict.affectedMeals.join(', ')}
                  </p>
                  <Alert className="mt-2 bg-blue-50 border-blue-200">
                    <AlertDescription className="text-sm text-blue-900">
                      <strong>Suggestion:</strong> {conflict.suggestion}
                    </AlertDescription>
                  </Alert>
                </div>
                {index < analysis.timingConflicts.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Critical & Moderate Gaps</CardTitle>
          <CardDescription>
            Nutrients where you're significantly below daily value
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.gaps
              .filter(gap => gap.severity === 'critical' || gap.severity === 'moderate')
              .slice(0, 8)
              .map((gap, index) => (
                <div key={gap.nutrient} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium capitalize">{gap.nutrient}</div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round(gap.current)} / {gap.target} ({Math.round(gap.percentOfDV)}% of DV)
                    </div>
                  </div>
                  <Badge variant={gap.severity === 'critical' ? 'destructive' : 'secondary'}>
                    {gap.severity}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {matchedProducts.length > 0 && (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="text-primary" />
              Supplement Suggestions (Optional)
            </CardTitle>
            <CardDescription>
              These products may help close your nutrient gaps. Food-first is always better.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {matchedProducts.map(product => (
              <div key={product.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <Badge variant="outline" className="mt-1">{product.category}</Badge>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">{product.price}</div>
                </div>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <div className="flex gap-1 flex-wrap">
                  {product.fillsNutrientGap.map(nutrient => (
                    <Badge key={nutrient} variant="secondary" className="text-xs">
                      {nutrient}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
            <Alert>
              <AlertDescription className="text-xs">
                These are placeholder links. In production, these would link to affiliate partners.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
