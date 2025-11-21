import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { 
  Barbell, 
  PersonSimpleRun, 
  Heart, 
  TrendUp,
  Check,
  ArrowRight
} from '@phosphor-icons/react'
import { 
  calculateBMI, 
  classifyBMI, 
  calculateTotalDailyEnergyExpenditure,
  type ExerciseProfile 
} from '../lib/exerciseEngine'

interface ExerciseProfileSetupProps {
  onProfileComplete: (profile: ExerciseProfile) => void
  existingProfile?: ExerciseProfile
}

export default function ExerciseProfileSetup({ onProfileComplete, existingProfile }: ExerciseProfileSetupProps) {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<Partial<ExerciseProfile>>(existingProfile || {
    weightUnit: 'lbs',
    heightUnit: 'inches',
    sex: 'male',
    fitnessLevel: 'moderately-active',
    goals: []
  })

  const updateProfile = (updates: Partial<ExerciseProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const bmi = profile.weight && profile.height 
    ? calculateBMI(profile.weight, profile.weightUnit!, profile.height, profile.heightUnit!)
    : null

  const bmiClass = bmi ? classifyBMI(bmi) : null

  const tdee = profile.weight && profile.height && profile.age && profile.sex && profile.fitnessLevel
    ? calculateTotalDailyEnergyExpenditure(profile as ExerciseProfile)
    : null

  const handleComplete = () => {
    if (profile.weight && profile.height && profile.age && profile.sex && profile.fitnessLevel) {
      onProfileComplete(profile as ExerciseProfile)
    }
  }

  const goalOptions = [
    { value: 'lose-weight', label: 'Lose Weight' },
    { value: 'gain-muscle', label: 'Gain Muscle' },
    { value: 'improve-endurance', label: 'Improve Endurance' },
    { value: 'increase-strength', label: 'Increase Strength' },
    { value: 'general-fitness', label: 'General Fitness' },
    { value: 'stress-relief', label: 'Stress Relief' },
    { value: 'flexibility', label: 'Improve Flexibility' },
    { value: 'maintain', label: 'Maintain Current Level' }
  ]

  const toggleGoal = (goal: string) => {
    const currentGoals = profile.goals || []
    if (currentGoals.includes(goal)) {
      updateProfile({ goals: currentGoals.filter(g => g !== goal) })
    } else {
      updateProfile({ goals: [...currentGoals, goal] })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Exercise Profile Setup</h2>
          <p className="text-muted-foreground">Help us calculate accurate calorie burn for your workouts</p>
        </div>
        <Badge variant="secondary">Step {step} of 3</Badge>
      </div>

      <Progress value={(step / 3) * 100} className="h-2" />

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Physical Metrics
            </CardTitle>
            <CardDescription>We need these to calculate your BMI and calorie burn accurately</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <div className="flex gap-2">
                  <Input
                    id="weight"
                    type="number"
                    placeholder="150"
                    value={profile.weight || ''}
                    onChange={(e) => updateProfile({ weight: parseFloat(e.target.value) })}
                  />
                  <Select 
                    value={profile.weightUnit} 
                    onValueChange={(value: 'kg' | 'lbs') => updateProfile({ weightUnit: value })}
                  >
                    <SelectTrigger className="w-24">
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
                    onChange={(e) => updateProfile({ height: parseFloat(e.target.value) })}
                  />
                  <Select 
                    value={profile.heightUnit} 
                    onValueChange={(value: 'cm' | 'inches') => updateProfile({ heightUnit: value })}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inches">in</SelectItem>
                      <SelectItem value="cm">cm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="30"
                  value={profile.age || ''}
                  onChange={(e) => updateProfile({ age: parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sex">Sex</Label>
                <Select 
                  value={profile.sex} 
                  onValueChange={(value: 'male' | 'female' | 'other') => updateProfile({ sex: value })}
                >
                  <SelectTrigger id="sex">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {bmi && bmiClass && (
              <div className="p-4 bg-secondary rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Your BMI</span>
                  <Badge variant="outline" className={bmiClass.color}>
                    {bmiClass.classification}
                  </Badge>
                </div>
                <div className="text-3xl font-bold">{bmi.toFixed(1)}</div>
                <p className="text-sm text-muted-foreground">{bmiClass.description}</p>
              </div>
            )}

            <div className="flex justify-end">
              <Button 
                onClick={() => setStep(2)}
                disabled={!profile.weight || !profile.height || !profile.age || !profile.sex}
              >
                Next
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PersonSimpleRun className="w-5 h-5 text-primary" />
              Activity Level & Goals
            </CardTitle>
            <CardDescription>This helps us personalize your exercise recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fitness-level">Current Fitness Level</Label>
              <Select 
                value={profile.fitnessLevel} 
                onValueChange={(value: ExerciseProfile['fitnessLevel']) => updateProfile({ fitnessLevel: value })}
              >
                <SelectTrigger id="fitness-level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">
                    <div className="flex flex-col items-start">
                      <span>Sedentary</span>
                      <span className="text-xs text-muted-foreground">Little or no exercise</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="lightly-active">
                    <div className="flex flex-col items-start">
                      <span>Lightly Active</span>
                      <span className="text-xs text-muted-foreground">Exercise 1-3 days/week</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="moderately-active">
                    <div className="flex flex-col items-start">
                      <span>Moderately Active</span>
                      <span className="text-xs text-muted-foreground">Exercise 3-5 days/week</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="very-active">
                    <div className="flex flex-col items-start">
                      <span>Very Active</span>
                      <span className="text-xs text-muted-foreground">Exercise 6-7 days/week</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="extremely-active">
                    <div className="flex flex-col items-start">
                      <span>Extremely Active</span>
                      <span className="text-xs text-muted-foreground">Heavy exercise daily + physical job</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Fitness Goals (select all that apply)</Label>
              <div className="grid grid-cols-2 gap-3">
                {goalOptions.map(goal => (
                  <Button
                    key={goal.value}
                    type="button"
                    variant={profile.goals?.includes(goal.value) ? 'default' : 'outline'}
                    onClick={() => toggleGoal(goal.value)}
                    className="justify-start"
                  >
                    {profile.goals?.includes(goal.value) && (
                      <Check className="mr-2 w-4 h-4" />
                    )}
                    {goal.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                onClick={() => setStep(3)}
                disabled={!profile.fitnessLevel || !profile.goals?.length}
              >
                Next
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendUp className="w-5 h-5 text-primary" />
              Summary
            </CardTitle>
            <CardDescription>Review your profile before continuing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-secondary rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Weight</div>
                <div className="text-xl font-semibold">
                  {profile.weight} {profile.weightUnit}
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Height</div>
                <div className="text-xl font-semibold">
                  {profile.height} {profile.heightUnit}
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Age</div>
                <div className="text-xl font-semibold">{profile.age} years</div>
              </div>

              <div className="p-4 bg-secondary rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Sex</div>
                <div className="text-xl font-semibold capitalize">{profile.sex}</div>
              </div>
            </div>

            {bmi && bmiClass && (
              <div className="p-4 bg-primary/10 border-2 border-primary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Body Mass Index (BMI)</span>
                  <Badge className={bmiClass.color}>
                    {bmiClass.classification}
                  </Badge>
                </div>
                <div className="text-4xl font-bold mb-1">{bmi.toFixed(1)}</div>
                <p className="text-sm text-muted-foreground">{bmiClass.description}</p>
              </div>
            )}

            {tdee && (
              <div className="p-4 bg-accent/10 border-2 border-accent rounded-lg">
                <div className="font-medium mb-2">Daily Calorie Needs (TDEE)</div>
                <div className="text-4xl font-bold mb-1">{tdee.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">
                  Based on your {profile.fitnessLevel?.replace('-', ' ')} lifestyle
                </p>
              </div>
            )}

            <div className="p-4 bg-secondary rounded-lg">
              <div className="font-medium mb-2">Your Goals</div>
              <div className="flex flex-wrap gap-2">
                {profile.goals?.map(goal => (
                  <Badge key={goal} variant="outline">
                    {goalOptions.find(g => g.value === goal)?.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button onClick={handleComplete}>
                <Check className="mr-2 w-4 h-4" />
                Complete Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
