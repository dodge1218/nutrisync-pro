import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { User, Activity, Target, Check, ArrowRight } from '@phosphor-icons/react'
import { 
  calculateBMI, 
  classifyBMI, 
  calculateTotalDailyEnergyExpenditure,
  type ExerciseProfile 
} from '../lib/exerciseEngine'
import { calculatePersonalizedDailyValues, type UserNutritionProfile } from '../lib/personalizedNutrition'
import { useKV } from '@github/spark/hooks'

interface ProfileSetupProps {
  initialProfile?: UserNutritionProfile
  isUpdate: boolean
  onComplete: () => void
}

export default function ProfileSetup({ initialProfile, isUpdate, onComplete }: ProfileSetupProps) {
  const [profile, setProfile] = useKV<UserNutritionProfile | null>('user-nutrition-profile', initialProfile || null)
  const [step, setStep] = useState(1)
  const [tempProfile, setTempProfile] = useState<Partial<UserNutritionProfile>>(initialProfile || {
    weightUnit: 'lbs',
    heightUnit: 'inches',
    sex: 'male',
    fitnessLevel: 'moderately-active',
    goals: [],
    dietaryPattern: 'omnivore',
    healthGoal: 'maintenance'
  })

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { value: 'lightly_active', label: 'Lightly Active', description: '1-3 days/week' },
    { value: 'moderately_active', label: 'Moderately Active', description: '3-5 days/week' },
    { value: 'very_active', label: 'Very Active', description: '6-7 days/week' },
    { value: 'extremely_active', label: 'Extremely Active', description: 'Physical job + training' },
  ]

  const goals = [
    { value: 'maintain', label: 'Maintain Weight', icon: '⚖️' },
    { value: 'lose_weight', label: 'Lose Weight', icon: '📉' },
    { value: 'gain_muscle', label: 'Gain Muscle', icon: '💪' },
    { value: 'general_wellness', label: 'General Wellness', icon: '🌿' },
    { value: 'athletic_performance', label: 'Athletic Performance', icon: '🏃' },
  ]

  const handleSave = () => {
    onSave({
      ...profile,
      lastProfileUpdate: Date.now(),
    })
    onClose()
  }

  const isStage1Complete = profile.weight && profile.height && profile.age && profile.sex && profile.activityLevel && profile.primaryGoal

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" weight="bold" />
            {stage === 1 ? 'Essential Profile Setup' : 'Update Your Profile'}
          </DialogTitle>
          <DialogDescription>
            {stage === 1 
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
                      onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) || undefined })}
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
                      onChange={(e) => setProfile({ ...profile, height: parseFloat(e.target.value) || undefined })}
                    />
                    <Select
                      value={profile.heightUnit}
                      onValueChange={(value: 'cm' | 'in') => setProfile({ ...profile, heightUnit: value })}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">in</SelectItem>
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
                    onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || undefined })}
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
                      onClick={() => setProfile({ ...profile, activityLevel: level.value as any })}
                      className={`p-3 rounded-lg border-2 text-left transition-colors ${
                        profile.activityLevel === level.value
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
                      onClick={() => setProfile({ ...profile, primaryGoal: goal.value as any })}
                      className={`p-4 rounded-lg border-2 text-center transition-colors ${
                        profile.primaryGoal === goal.value
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
            {stage === 1 && !isStage1Complete && 'All fields are required'}
            {stage === 1 && isStage1Complete && 'Ready to save!'}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              {stage === 1 ? 'Skip for now' : 'Cancel'}
            </Button>
            <Button onClick={handleSave} disabled={stage === 1 && !isStage1Complete}>
              Save Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
