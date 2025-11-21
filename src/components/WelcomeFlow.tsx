import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { AppMode } from '@/App'
import { UserOnboardingProfile, GOAL_OPTIONS } from '@/lib/onboardingEngine'
import { Leaf, Moon, CalendarBlank } from '@phosphor-icons/react'

interface WelcomeFlowProps {
  onComplete: (profile: UserOnboardingProfile) => void
}

export default function WelcomeFlow({ onComplete }: WelcomeFlowProps) {
  const [step, setStep] = useState(1)
  const [age, setAge] = useState<string>('')
  const [dietaryPreference, setDietaryPreference] = useState<'omnivore' | 'vegetarian' | 'vegan'>('omnivore')
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [startingMode, setStartingMode] = useState<AppMode>('nutriwell')

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    )
  }

  const handleComplete = () => {
    const profile: UserOnboardingProfile = {
      age: age ? parseInt(age) : undefined,
      dietaryPreference,
      goals: selectedGoals,
      disclaimerAccepted: true,
      startingMode,
      completedAt: Date.now(),
    }
    onComplete(profile)
  }

  if (step === 1) {
    return (
      <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-8 pb-6">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-4 mb-6">
                <Leaf className="w-12 h-12 text-primary" />
                <Moon className="w-12 h-12 text-accent" />
                <CalendarBlank className="w-12 h-12 text-secondary-foreground" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Welcome to NutriWell Suite</h1>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                Track nutrition, optimize sleep timing, and schedule your days for complete wellness
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 border border-border rounded-lg">
                  <Leaf className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">NutriWell</h3>
                  <p className="text-sm text-muted-foreground">
                    Smart nutrition intelligence for optimal health
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <Moon className="w-8 h-8 text-accent mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">SleepSync</h3>
                  <p className="text-sm text-muted-foreground">
                    Meal timing for better rest
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <CalendarBlank className="w-8 h-8 text-secondary-foreground mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">LifeFlow</h3>
                  <p className="text-sm text-muted-foreground">
                    Time-blocked scheduling
                  </p>
                </div>
              </div>
              <Button size="lg" onClick={() => setStep(2)} className="mt-8">
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="pt-8 pb-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Quick Profile</h2>
                <p className="text-sm text-muted-foreground">
                  Help us personalize your experience (optional)
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age (optional)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g., 30"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Dietary Preference</Label>
                  <RadioGroup value={dietaryPreference} onValueChange={(v) => setDietaryPreference(v as any)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="omnivore" id="omnivore" />
                      <Label htmlFor="omnivore" className="font-normal cursor-pointer">Omnivore</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vegetarian" id="vegetarian" />
                      <Label htmlFor="vegetarian" className="font-normal cursor-pointer">Vegetarian</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vegan" id="vegan" />
                      <Label htmlFor="vegan" className="font-normal cursor-pointer">Vegan</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>What brings you here?</Label>
                  <p className="text-xs text-muted-foreground">Select all that apply</p>
                  <div className="space-y-2">
                    {GOAL_OPTIONS.map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <Checkbox
                          id={goal}
                          checked={selectedGoals.includes(goal)}
                          onCheckedChange={() => handleGoalToggle(goal)}
                        />
                        <Label htmlFor={goal} className="font-normal cursor-pointer">
                          {goal}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  Skip
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  Continue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="pt-8 pb-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Choose Your Starting Point</h2>
                <p className="text-sm text-muted-foreground">
                  You can switch modes anytime
                </p>
              </div>

              <RadioGroup value={startingMode} onValueChange={(v) => setStartingMode(v as AppMode)}>
                <div
                  className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    startingMode === 'nutriwell' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setStartingMode('nutriwell')}
                >
                  <RadioGroupItem value="nutriwell" id="nutriwell" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="nutriwell" className="font-semibold cursor-pointer flex items-center gap-2">
                      <Leaf className="w-5 h-5 text-primary" />
                      NutriWell
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track meals, discover nutrient gaps, get personalized recommendations
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    startingMode === 'sleepsync' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setStartingMode('sleepsync')}
                >
                  <RadioGroupItem value="sleepsync" id="sleepsync" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="sleepsync" className="font-semibold cursor-pointer flex items-center gap-2">
                      <Moon className="w-5 h-5 text-accent" />
                      SleepSync
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Optimize meal timing for better sleep quality
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    startingMode === 'lifeflow' ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setStartingMode('lifeflow')}
                >
                  <RadioGroupItem value="lifeflow" id="lifeflow" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="lifeflow" className="font-semibold cursor-pointer flex items-center gap-2">
                      <CalendarBlank className="w-5 h-5 text-secondary-foreground" />
                      LifeFlow
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Build time-blocked schedules with goals and activities
                    </p>
                  </div>
                </div>
              </RadioGroup>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={() => setStep(4)} className="flex-1">
                  Continue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 4) {
    return (
      <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-8 pb-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Important Disclaimer</h2>
              </div>

              <div className="bg-muted p-6 rounded-lg space-y-4">
                <p className="text-foreground leading-relaxed">
                  This application is for <strong>informational and educational purposes only</strong>.
                </p>
                <p className="text-foreground leading-relaxed">
                  This is <strong>not medical advice</strong>. We do not diagnose, treat, or prevent any medical condition.
                </p>
                <p className="text-foreground leading-relaxed">
                  <strong>Always consult a qualified healthcare professional</strong> before making dietary changes, starting supplements, or adjusting your health routine.
                </p>
                <p className="text-sm text-muted-foreground">
                  NutriWell provides general wellness information based on nutritional science. Individual needs vary. If you have medical conditions, allergies, or take medications, professional guidance is essential.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button onClick={handleComplete} className="flex-1">
                  I Understand
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
