import { useState } from 'react'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import type { UserActivityProfile } from '../../lib/personalizedDVs'

interface ActivityProfileSetupProps {
  initialData?: UserActivityProfile
  onSave?: (profile: UserActivityProfile) => void
  onComplete?: (profile: UserActivityProfile) => void
  onSkip?: () => void
}

export default function ActivityProfileSetup({ initialData, onSave, onComplete, onSkip }: ActivityProfileSetupProps) {
  const [activityLevel, setActivityLevel] = useState<string>(initialData?.activityLevel || 'sedentary')
  const [fitnessGoal, setFitnessGoal] = useState<string>(initialData?.fitnessGoal || 'maintain')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const profile: UserActivityProfile = {
      activityLevel: activityLevel as UserActivityProfile['activityLevel'],
      fitnessGoal: fitnessGoal as UserActivityProfile['fitnessGoal']
    }
    
    if (onSave) onSave(profile)
    if (onComplete) onComplete(profile)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Activity & Goals</CardTitle>
        <CardDescription>
          Tell us about your activity level and fitness goals to personalize your calorie and protein needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>What's your current activity level?</Label>
            <RadioGroup value={activityLevel} onValueChange={setActivityLevel}>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="sedentary" id="sedentary" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="sedentary" className="font-medium cursor-pointer">
                    Sedentary
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Little to no exercise, desk job
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="lightly-active" id="lightly-active" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="lightly-active" className="font-medium cursor-pointer">
                    Lightly Active
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Light exercise 1-3 days/week
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="moderately-active" id="moderately-active" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="moderately-active" className="font-medium cursor-pointer">
                    Moderately Active
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Moderate exercise 3-5 days/week
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="very-active" id="very-active" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="very-active" className="font-medium cursor-pointer">
                    Very Active
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Hard exercise 6-7 days/week
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="extremely-active" id="extremely-active" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="extremely-active" className="font-medium cursor-pointer">
                    Extremely Active
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Very hard exercise, physical job, training twice a day
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label>What's your primary fitness goal?</Label>
            <RadioGroup value={fitnessGoal} onValueChange={setFitnessGoal}>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="maintain" id="maintain" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="maintain" className="font-medium cursor-pointer">
                    Maintain Weight
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Stay at current weight and fitness level
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="lose-weight" id="lose-weight" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="lose-weight" className="font-medium cursor-pointer">
                    Lose Weight
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Gradual, healthy weight loss
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="gain-muscle" id="gain-muscle" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="gain-muscle" className="font-medium cursor-pointer">
                    Build Muscle
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Increase muscle mass and strength
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer">
                <RadioGroupItem value="general-fitness" id="general-fitness" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="general-fitness" className="font-medium cursor-pointer">
                    General Fitness
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Overall health and wellness
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="bg-muted p-4 rounded-lg text-sm">
            <p className="text-muted-foreground">
              Your activity level and goals help us calculate your daily calorie needs (TDEE) and optimize protein recommendations for your lifestyle.
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Continue
            </Button>
            {onSkip && (
              <Button type="button" variant="outline" onClick={onSkip}>
                Skip for now
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
