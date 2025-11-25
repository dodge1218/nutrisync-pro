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
          <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/10 flex items-center justify-center">
              <Barbell className="w-7 h-7 text-orange-500" weight="duotone" />
            </div>
            Exercise Creator
          </h2>
          <p className="text-muted-foreground text-base">
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
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/10 flex items-center justify-center">
              <Barbell className="w-7 h-7 text-orange-500" weight="duotone" />
            </div>
            Exercise Creator
          </h2>
          <p className="text-muted-foreground mt-2 text-base">
            Track workouts and calculate calorie burn
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowProfileSetup(true)}
          className="bg-card hover:bg-accent/10 border-border/50 shadow-sm"
        >
          <Gear className="mr-2 w-4 h-4" weight="duotone" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Heart className="w-4 h-4 text-red-500" weight="fill" />
              Your BMI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">{bmi.toFixed(1)}</span>
            </div>
            <Badge variant="outline" className={`${bmiClass.color} mt-2 border-current bg-current/5`}>
              {bmiClass.classification}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Fire className="w-4 h-4 text-orange-500" weight="fill" />
              Daily Calorie Needs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-orange-500">{tdee.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">cal</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              Based on {profile.fitnessLevel?.replace('-', ' ')} lifestyle
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Barbell className="w-4 h-4 text-accent" weight="duotone" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <p className="flex justify-between border-b border-border/30 pb-1">
                <span className="text-muted-foreground">Weight:</span> 
                <span className="font-medium">{profile.weight} {profile.weightUnit}</span>
              </p>
              <p className="flex justify-between border-b border-border/30 pb-1">
                <span className="text-muted-foreground">Height:</span> 
                <span className="font-medium">{profile.height} {profile.heightUnit}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-muted-foreground">Age:</span> 
                <span className="font-medium">{profile.age}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ExerciseLogger profile={profile} />
    </div>
  )
}

