import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import type { UserPhysicalProfile } from '../../lib/personalizedDVs'
import { calculateBMI, getBMICategory } from '../../lib/personalizedDVs'

interface PhysicalProfileSetupProps {
  initialData?: UserPhysicalProfile
  onSave?: (profile: UserPhysicalProfile) => void
  onComplete?: (profile: UserPhysicalProfile) => void
  onSkip?: () => void
}

export default function PhysicalProfileSetup({ initialData, onSave, onComplete, onSkip }: PhysicalProfileSetupProps) {
  const [weight, setWeight] = useState(initialData?.weight?.toString() || '')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(initialData?.weightUnit || 'lbs')
  const [height, setHeight] = useState(initialData?.height?.toString() || '')
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>(initialData?.heightUnit || 'in')
  const [age, setAge] = useState(initialData?.age?.toString() || '')
  const [sex, setSex] = useState<'male' | 'female' | 'other'>(initialData?.sex || 'female')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const profile: UserPhysicalProfile = {
      weight: parseFloat(weight) || undefined,
      weightUnit,
      height: parseFloat(height) || undefined,
      heightUnit,
      age: parseInt(age) || undefined,
      sex
    }
    
    if (onSave) onSave(profile)
    if (onComplete) onComplete(profile)
  }

  const bmi = calculateBMI({
    weight: parseFloat(weight),
    weightUnit,
    height: parseFloat(height),
    heightUnit
  })

  const bmiCategory = bmi ? getBMICategory(bmi) : null

  const isValid = weight && height && age && sex

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Physical Profile Setup</CardTitle>
        <CardDescription>
          Help us personalize your daily nutrient recommendations based on your body metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <div className="flex gap-2">
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  step="0.1"
                  min="0"
                />
                <Select value={weightUnit} onValueChange={(val) => setWeightUnit(val as 'kg' | 'lbs')}>
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
                  placeholder="Enter height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  step="0.1"
                  min="0"
                />
                <Select value={heightUnit} onValueChange={(val) => setHeightUnit(val as 'cm' | 'in')}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">inches</SelectItem>
                    <SelectItem value="cm">cm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {bmi && (
            <div className="p-4 bg-secondary rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Your BMI:</span>
                <span className="text-lg font-bold">
                  {bmi.toFixed(1)} - {bmiCategory}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="1"
              max="120"
            />
          </div>

          <div className="space-y-3">
            <Label>Biological Sex</Label>
            <RadioGroup value={sex} onValueChange={(val) => setSex(val as 'male' | 'female' | 'other')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="font-normal cursor-pointer">
                  Female
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="font-normal cursor-pointer">
                  Male
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="font-normal cursor-pointer">
                  Other
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="bg-muted p-4 rounded-lg text-sm">
            <p className="text-muted-foreground">
              This information helps us calculate personalized daily values for calories, protein, and micronutrients based on your age, sex, and body metrics.
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={!isValid} className="flex-1">
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
