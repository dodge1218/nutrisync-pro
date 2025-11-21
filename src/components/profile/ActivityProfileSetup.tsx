import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserActivityProfile } from '@/lib/personalizedDVs'

interface ActivityProfileSetupProps {
  initialData?: UserActivityProfile
  onSave: (data: UserActivityProfile) => void
  onSkip?: () => void
}

export default function ActivityProfileSetup({ initialData, onSave, onSkip }: ActivityProfileSetupProps) {
  const [formData, setFormData] = useState<UserActivityProfile>(initialData || {})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.activityLevel && formData.fitnessGoal) {
      onSave(formData)
    }
  }

  const isValid = formData.activityLevel && formData.fitnessGoal

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Activity & Goals</CardTitle>
        <CardDescription>
          Tell us about your activity level and fitness goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>Activity Level</Label>
            <RadioGroup
              value={formData.activityLevel}
              onValueChange={(value) => setFormData({ ...formData, activityLevel: value as any })}
            >
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="sedentary" id="sedentary" />
                <Label htmlFor="sedentary" className="font-normal cursor-pointer flex-1">
                  <div className="font-medium">Sedentary</div>
                  <div className="text-sm text-muted-foreground">Little to no exercise, desk job</div>
                </Label>
              </div>
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="lightly-active" id="lightly-active" />
                <Label htmlFor="lightly-active" className="font-normal cursor-pointer flex-1">
                  <div className="font-medium">Lightly Active</div>
                  <div className="text-sm text-muted-foreground">Light exercise 1-3 days/week</div>
                </Label>
              </div>
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="moderately-active" id="moderately-active" />
                <Label htmlFor="moderately-active" className="font-normal cursor-pointer flex-1">
                  <div className="font-medium">Moderately Active</div>
                  <div className="text-sm text-muted-foreground">Moderate exercise 3-5 days/week</div>
                </Label>
              </div>
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="very-active" id="very-active" />
                <Label htmlFor="very-active" className="font-normal cursor-pointer flex-1">
                  <div className="font-medium">Very Active</div>
                  <div className="text-sm text-muted-foreground">Hard exercise 6-7 days/week</div>
                </Label>
              </div>
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="extremely-active" id="extremely-active" />
                <Label htmlFor="extremely-active" className="font-normal cursor-pointer flex-1">
                  <div className="font-medium">Extremely Active</div>
                  <div className="text-sm text-muted-foreground">Intense daily training or physical job</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label>Fitness Goal</Label>
            <RadioGroup
              value={formData.fitnessGoal}
              onValueChange={(value) => setFormData({ ...formData, fitnessGoal: value as any })}
            >
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="maintain" id="maintain" />
                <Label htmlFor="maintain" className="font-normal cursor-pointer flex-1">
                  <div className="font-medium">Maintain Weight</div>
                  <div className="text-sm text-muted-foreground">Stay at current weight</div>
                </Label>
              </div>
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="lose-weight" id="lose-weight" />
                <Label htmlFor="lose-weight" className="font-normal cursor-pointer flex-1">
                  <div className="font-medium">Lose Weight</div>
                  <div className="text-sm text-muted-foreground">Fat loss with muscle preservation</div>
                </Label>
              </div>
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="gain-muscle" id="gain-muscle" />
                <Label htmlFor="gain-muscle" className="font-normal cursor-pointer flex-1">
                  <div className="font-medium">Gain Muscle</div>
                  <div className="text-sm text-muted-foreground">Build strength and muscle mass</div>
                </Label>
              </div>
              <div className="flex items-start space-x-3 space-y-0">
                <RadioGroupItem value="general-fitness" id="general-fitness" />
                <Label htmlFor="general-fitness" className="font-normal cursor-pointer flex-1">
                  <div className="font-medium">General Fitness</div>
                  <div className="text-sm text-muted-foreground">Overall health and wellness</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-3 justify-end">
            {onSkip && (
              <Button type="button" variant="ghost" onClick={onSkip}>
                Skip for now
              </Button>
            )}
            <Button type="submit" disabled={!isValid}>
              Save & Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
