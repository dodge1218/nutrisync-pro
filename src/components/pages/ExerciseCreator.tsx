import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'
import { Barbell, PersonSimpleRun, Heart, Fire, Gear } from '@phosphor-icons/react'
import ExerciseProfileSetup from '../ExerciseProfileSetup'
import ExerciseLogger from '../ExerciseLogger'
import type { ExerciseProfile } from '../../lib/exerciseEngine'
import { calculateBMI, classifyBMI, calculateTotalDailyEnergyExpenditure } from '../../lib/exerciseEngine'

export default function ExerciseCreator() {
  const [exerciseProfile, setExerciseProfile] = useKV<ExerciseProfile | null>('exercise-profile', null)
  const [showProfileSetup, setShowProfileSetup] = useState(false)

  const profile = exerciseProfile

  const handleProfileComplete = (newProfile: ExerciseProfile) => {
    setExerciseProfile(newProfile)
    setShowProfileSetup(false)
  }

  if (!profile || showProfileSetup) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Exercise Creator</h2>
          <p className="text-muted-foreground">
            Track your workouts and calculate accurate calorie burn based on your profile
          </p>
        </div>

        <ExerciseProfileSetup 
          onProfileComplete={handleProfileComplete}
          existingProfile={profile || undefined}
        />
      </div>
    )
  }

  const bmi = calculateBMI(profile.weight, profile.weightUnit, profile.height, profile.heightUnit)
  const bmiClass = classifyBMI(bmi)
  const tdee = calculateTotalDailyEnergyExpenditure(profile)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Exercise Creator</h2>
          <p className="text-muted-foreground">
            Track workouts and calculate calorie burn
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowProfileSetup(true)}>
          <Gear className="mr-2 w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Your BMI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{bmi.toFixed(1)}</span>
            </div>
            <Badge variant="outline" className={`${bmiClass.color} mt-2`}>
              {bmiClass.classification}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Fire className="w-4 h-4 text-orange-600" />
              Daily Calorie Needs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{tdee.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">cal</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on {profile.fitnessLevel?.replace('-', ' ')} lifestyle
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Barbell className="w-4 h-4 text-accent" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Weight:</span> {profile.weight} {profile.weightUnit}
              </p>
              <p>
                <span className="text-muted-foreground">Height:</span> {profile.height} {profile.heightUnit}
              </p>
              <p>
                <span className="text-muted-foreground">Age:</span> {profile.age}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ExerciseLogger profile={profile} />
    </div>
  )
}
