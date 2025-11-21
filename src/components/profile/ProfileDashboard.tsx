import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User, PencilSimple, CalendarBlank, Activity } from '@phosphor-icons/react'
import { useState } from 'react'
import ProfileWizard from './ProfileWizard'
import type { CompleteUserProfile } from '@/lib/personalizedDVs'
import { calculateBMI, getBMICategory, calculateTDEE, calculatePersonalizedDVs } from '@/lib/personalizedDVs'

export default function ProfileDashboard() {
  const [profile] = useKV<CompleteUserProfile>('complete-user-profile', {})
  const [showWizard, setShowWizard] = useState(false)

  const hasProfile = profile?.physical && profile?.activity
  const daysSinceUpdate = profile?.lastUpdated 
    ? Math.floor((Date.now() - profile.lastUpdated) / (1000 * 60 * 60 * 24))
    : null
  const needsUpdate = daysSinceUpdate !== null && daysSinceUpdate >= 7

  const bmi = profile?.physical ? calculateBMI(profile.physical) : null
  const bmiCategory = bmi ? getBMICategory(bmi) : null
  const tdee = profile?.physical && profile?.activity ? calculateTDEE(profile.physical, profile.activity) : null
  const personalizedDVs = hasProfile ? calculatePersonalizedDVs(profile!) : null

  if (!hasProfile) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User weight="fill" className="text-primary" />
              Personalized Nutrition Profile
            </CardTitle>
            <CardDescription>
              Get customized daily nutrient recommendations based on your age, weight, activity level, and goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                Complete your profile to get personalized daily values calculated specifically for you
              </AlertDescription>
            </Alert>
            <Button onClick={() => setShowWizard(true)} className="mt-4">
              <User className="mr-2" />
              Set Up Profile
            </Button>
          </CardContent>
        </Card>

        <ProfileWizard
          open={showWizard}
          onOpenChange={setShowWizard}
        />
      </>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User weight="fill" className="text-primary" />
                Your Nutrition Profile
              </CardTitle>
              <CardDescription>
                Personalized daily values based on your profile
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowWizard(true)}>
              <PencilSimple className="mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {needsUpdate && (
            <Alert>
              <CalendarBlank className="h-4 w-4" />
              <AlertDescription>
                It's been {daysSinceUpdate} days since you updated your profile. Consider reviewing your information to keep recommendations accurate.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Weight</div>
              <div className="text-lg font-semibold">
                {profile.physical?.weight} {profile.physical?.weightUnit}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Height</div>
              <div className="text-lg font-semibold">
                {profile.physical?.height} {profile.physical?.heightUnit}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Age</div>
              <div className="text-lg font-semibold">{profile.physical?.age}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Sex</div>
              <div className="text-lg font-semibold capitalize">{profile.physical?.sex}</div>
            </div>
          </div>

          {bmi && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Body Mass Index (BMI)</div>
                <Badge variant={bmiCategory === 'Normal' ? 'default' : 'secondary'}>
                  {bmiCategory}
                </Badge>
              </div>
              <div className="text-2xl font-bold">{bmi.toFixed(1)}</div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Activity weight="fill" className="text-primary" />
              Activity & Goals
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Activity Level</div>
                <div className="text-sm font-medium capitalize">
                  {profile.activity?.activityLevel?.replace(/-/g, ' ')}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Fitness Goal</div>
                <div className="text-sm font-medium capitalize">
                  {profile.activity?.fitnessGoal?.replace(/-/g, ' ')}
                </div>
              </div>
            </div>
          </div>

          {personalizedDVs && tdee && (
            <div className="border-t pt-4 space-y-3">
              <div className="text-sm font-medium">Your Personalized Daily Values</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Daily Calories</div>
                  <div className="text-lg font-semibold">{Math.round(personalizedDVs.calories)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Protein</div>
                  <div className="text-lg font-semibold">{personalizedDVs.protein}g</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Fiber</div>
                  <div className="text-lg font-semibold">{personalizedDVs.fiber}g</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                All nutrient recommendations throughout the app are now personalized to your profile
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <ProfileWizard
        open={showWizard}
        onOpenChange={setShowWizard}
      />
    </>
  )
}
