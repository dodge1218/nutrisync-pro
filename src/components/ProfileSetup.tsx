import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { User, Activity, Target } from '@phosphor-icons/react'
import { type UserNutritionProfile } from '../lib/personalizedNutrition'
import { useKV } from '@github/spark/hooks'

interface ProfileSetupProps {
  initialProfile?: UserNutritionProfile
  isUpdate: boolean
  onComplete: () => void
}

export default function ProfileSetup({ initialProfile, isUpdate, onComplete }: ProfileSetupProps) {
  const [profile, setProfile] = useKV<UserNutritionProfile | null>('user-nutrition-profile', initialProfile || null)
  const [step, setStep] = useState(1)
  
  const ensureProfile = () => {
    if (!profile) {
      setProfile({
        weight: 0,
        height: 0,
        age: 0,
        weightUnit: 'lbs',
        heightUnit: 'inches',
        sex: 'male',
        fitnessLevel: 'moderately-active',
        goals: [],
        dietaryPattern: 'omnivore',
        healthGoal: 'maintenance',
        lastProfileUpdate: Date.now()
      } as UserNutritionProfile)
    }
  }

  if (!profile) {
    ensureProfile()
    return null
  }

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { value: 'lightly-active', label: 'Lightly Active', description: '1-3 days/week' },
    { value: 'moderately-active', label: 'Moderately Active', description: '3-5 days/week' },
    { value: 'very-active', label: 'Very Active', description: '6-7 days/week' },
    { value: 'extremely-active', label: 'Extremely Active', description: 'Physical job + training' },
  ]

  const goals = [
    { value: 'maintain', label: 'Maintain Weight', icon: '⚖️' },
    { value: 'lose_weight', label: 'Lose Weight', icon: '📉' },
    { value: 'gain_muscle', label: 'Gain Muscle', icon: '💪' },
    { value: 'general_wellness', label: 'General Wellness', icon: '🌿' },
    { value: 'athletic_performance', label: 'Athletic Performance', icon: '🏃' },
  ]

  const handleSave = () => {
    setProfile({
      ...profile,
      lastProfileUpdate: Date.now(),
    })
    onComplete()
  }

  const isStage1Complete = profile.weight > 0 && profile.height > 0 && profile.age > 0 && profile.sex && profile.fitnessLevel && profile.healthGoal

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" weight="bold" />
          {step === 1 ? 'Essential Profile Setup' : 'Update Your Profile'}
        </DialogTitle>
        <DialogDescription>
          {step === 1 
            ? 'Help us personalize your daily nutrient needs. This takes less than 2 minutes.'
            : 'Update your profile to keep your personalized recommendations accurate.'
          }
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-4">
        {/* Physical Characteristics */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Physical Characteristics</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <div className="flex gap-2">
                  <Input
                    id="weight"
                    type="number"
                    placeholder="150"
                    value={profile.weight || ''}
                    onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) || 0 })}
                  />
                  <Select
                    value={profile.weightUnit}
                    onValueChange={(value: 'kg' | 'lbs') => setProfile({ ...profile, weightUnit: value })}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lbs">lbs</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <div className="flex gap-2">
                  <Input
                    id="height"
                    type="number"
                    placeholder="68"
                    value={profile.height || ''}
                    onChange={(e) => setProfile({ ...profile, height: parseFloat(e.target.value) || 0 })}
                  />
                  <Select
                    value={profile.heightUnit}
                    onValueChange={(value: 'cm' | 'inches') => setProfile({ ...profile, heightUnit: value })}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inches">in</SelectItem>
                      <SelectItem value="cm">cm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="30"
                  value={profile.age || ''}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sex">Sex</Label>
                <Select
                  value={profile.sex}
                  onValueChange={(value: 'male' | 'female' | 'other') => setProfile({ ...profile, sex: value })}
                >
                  <SelectTrigger id="sex">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Level */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Activity & Goals</h3>
            </div>

            <div className="space-y-2">
              <Label>Activity Level</Label>
              <div className="grid gap-2">
                {activityLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setProfile({ ...profile, fitnessLevel: level.value as any })}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      profile.fitnessLevel === level.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium">{level.label}</div>
                    <div className="text-sm text-muted-foreground">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Primary Health Goal</Label>
              <div className="grid grid-cols-2 gap-2">
                {goals.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => setProfile({ ...profile, healthGoal: goal.value as any })}
                    className={`p-4 rounded-lg border-2 text-center transition-colors ${
                      profile.healthGoal === goal.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{goal.icon}</div>
                    <div className="text-sm font-medium">{goal.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          {step === 1 && !isStage1Complete && 'All fields are required'}
          {step === 1 && isStage1Complete && 'Ready to save!'}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onComplete}>
            {step === 1 ? 'Skip for now' : 'Cancel'}
          </Button>
          <Button onClick={handleSave} disabled={step === 1 && !isStage1Complete}>
            Save Profile
          </Button>
        </div>
      </div>
    </>
  )
}
