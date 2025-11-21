import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { UserPhysicalProfile } from '@/lib/personalizedDVs'
import { calculateBMI, getBMICategory } from '@/lib/personalizedDVs'

interface PhysicalProfileSetupProps {
  initialData?: UserPhysicalProfile
  onSave: (data: UserPhysicalProfile) => void
  onSkip?: () => void
}

export default function PhysicalProfileSetup({ initialData, onSave, onSkip }: PhysicalProfileSetupProps) {
  const [formData, setFormData] = useState<UserPhysicalProfile>(initialData || {
    weightUnit: 'lbs',
    heightUnit: 'in'
  })

  const bmi = calculateBMI(formData)
  const bmiCategory = bmi ? getBMICategory(bmi) : null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.weight && formData.height && formData.age && formData.sex) {
      onSave(formData)
    }
  }

  const isValid = formData.weight && formData.height && formData.age && formData.sex

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Physical Profile</CardTitle>
        <CardDescription>
          Help us calculate your personalized daily nutrient needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <div className="flex gap-2">
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || undefined })}
                  placeholder="150"
                  required
                />
                <Select
                  value={formData.weightUnit}
                  onValueChange={(value: 'kg' | 'lbs') => setFormData({ ...formData, weightUnit: value })}
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
                  value={formData.height || ''}
                  onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || undefined })}
                  placeholder="65"
                  required
                />
                <Select
                  value={formData.heightUnit}
                  onValueChange={(value: 'cm' | 'in') => setFormData({ ...formData, heightUnit: value })}
                >
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age || ''}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || undefined })}
                placeholder="30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex">Sex</Label>
              <Select
                value={formData.sex}
                onValueChange={(value: 'male' | 'female' | 'other') => setFormData({ ...formData, sex: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {bmi && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-medium">BMI: {bmi.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Category: {bmiCategory}</div>
            </div>
          )}

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
