import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { User, Barbell, Target, Heart, Calendar, Check, Info, ArrowRight } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { 
  calculateBMI, 
  classifyBMI, 
  calculateBasalMetabolicRate,
  calculateTotalDailyEnergyExpenditure,
  type ExerciseProfile 
} from '../lib/exerciseEngine'
import { 
  calculatePersonalizedDailyValues, 
  type UserNutritionProfile 
} from '../lib/personalizedNutrition'

interface ProfileSetupProps {
  onComplete?: () => void
  initialProfile?: UserNutritionProfile
  isUpdate?: boolean
}

export default function ProfileSetup({ onComplete, initialProfile, isUpdate = false }: ProfileSetupProps) {
  const [profile, setProfile] = useKV<UserNutritionProfile | null>('user-nutrition-profile', initialProfile || null)
  
  const [step, setStep] = useState(1)
  const totalSteps = 4
  
  const [formData, setFormData] = useState<Partial<UserNutritionProfile>>({
    weight: initialProfile?.weight || 70,
    weightUnit: initialProfile?.weightUnit || 'kg',
    height: initialProfile?.height || 170,
    heightUnit: initialProfile?.heightUnit || 'cm',
    age: initialProfile?.age || 30,
    sex: initialProfile?.sex || 'male',
    fitnessLevel: initialProfile?.fitnessLevel || 'moderately-active',
    dietaryPattern: initialProfile?.dietaryPattern || 'omnivore',
    healthGoal: initialProfile?.healthGoal || 'maintenance',
    specialConditions: initialProfile?.specialConditions || [],
    goals: initialProfile?.goals || []
  })
  
  const updateField = <K extends keyof UserNutritionProfile>(field: K, value: UserNutritionProfile[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const toggleSpecialCondition = (condition: 'pregnancy' | 'lactation' | 'elderly') => {
    const current = formData.specialConditions || []
    const updated = current.includes(condition)
      ? current.filter(c => c !== condition)
      : [...current, condition]
    updateField('specialConditions', updated)
  }
  
  const currentBMI = formData.weight && formData.height
    ? calculateBMI(
        formData.weight,
        formData.weightUnit || 'kg',
        formData.height,
        formData.heightUnit || 'cm'
      )
    : null
  
  const bmiClassification = currentBMI ? classifyBMI(currentBMI) : null
  
  const handleSave = () => {
    const completeProfile: UserNutritionProfile = {
      weight: formData.weight!,
      weightUnit: formData.weightUnit!,
      height: formData.height!,
      heightUnit: formData.heightUnit!,
      age: formData.age!,
      sex: formData.sex!,
      fitnessLevel: formData.fitnessLevel!,
      dietaryPattern: formData.dietaryPattern,
      healthGoal: formData.healthGoal,
      specialConditions: formData.specialConditions,
      goals: formData.goals || [],
      lastProfileUpdate: Date.now()
    }
    
    setProfile(completeProfile)
    
    const personalizedDVs = calculatePersonalizedDailyValues(completeProfile)
    
    toast.success(isUpdate ? 'Profile Updated!' : 'Profile Created!', {
      description: `Your daily calorie target: ${personalizedDVs.calories} kcal | Protein: ${personalizedDVs.protein}g`
    })
    
    if (onComplete) {
      onComplete()
    }
  }
  
  const canProceed = () => {
    if (step === 1) {
      return formData.weight && formData.height && formData.age && formData.sex
    }
    if (step === 2) {
      return formData.fitnessLevel
    }
    if (step === 3) {
      return formData.dietaryPattern && formData.healthGoal
    }
    return true
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <User weight="fill" className="text-primary" />
                {isUpdate ? 'Update Your Profile' : 'Create Your Nutrition Profile'}
              </CardTitle>
              <CardDescription className="mt-2">
                {isUpdate 
                  ? 'Update your information to get accurate personalized nutrition targets'
                  : 'Help us personalize your daily nutrition targets based on your unique needs'
                }
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              Step {step} of {totalSteps}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Barbell weight="fill" className="text-primary" />
                  <h3 className="text-lg font-semibold">Physical Characteristics</h3>
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    This information helps calculate your personalized calorie and nutrient needs. All data is stored locally and never shared.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age || ''}
                      onChange={(e) => updateField('age', parseInt(e.target.value))}
                      placeholder="30"
                      min="13"
                      max="120"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sex">Biological Sex</Label>
                    <Select value={formData.sex} onValueChange={(val: 'male' | 'female' | 'other') => updateField('sex', val)}>
                      <SelectTrigger id="sex">
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Used for calculating nutrient requirements</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <div className="flex gap-2">
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight || ''}
                        onChange={(e) => updateField('weight', parseFloat(e.target.value))}
                        placeholder="70"
                        step="0.1"
                        className="flex-1"
                      />
                      <Select value={formData.weightUnit} onValueChange={(val: 'kg' | 'lbs') => updateField('weightUnit', val)}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="lbs">lbs</SelectItem>
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
                        onChange={(e) => updateField('height', parseFloat(e.target.value))}
                        placeholder="170"
                        step="0.1"
                        className="flex-1"
                      />
                      <Select value={formData.heightUnit} onValueChange={(val: 'cm' | 'inches') => updateField('heightUnit', val)}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cm">cm</SelectItem>
                          <SelectItem value="inches">inches</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {currentBMI && bmiClassification && (
                  <Card className="bg-muted/30">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Your BMI</p>
                          <p className="text-3xl font-bold">{currentBMI.toFixed(1)}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className={bmiClassification.color}>
                            {bmiClassification.classification}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {bmiClassification.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Barbell weight="fill" className="text-primary" />
                  <h3 className="text-lg font-semibold">Activity Level</h3>
                </div>
                
                <div className="space-y-2">
                  <Label>How active are you on a typical day?</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    This helps calculate your total daily energy expenditure (TDEE)
                  </p>
                  
                  <div className="space-y-3">
                    {[
                      { value: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise, desk job' },
                      { value: 'lightly-active', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
                      { value: 'moderately-active', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
                      { value: 'very-active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
                      { value: 'extremely-active', label: 'Extremely Active', desc: 'Athlete, physical job + training' }
                    ].map(({ value, label, desc }) => (
                      <Card
                        key={value}
                        className={`cursor-pointer transition-all ${
                          formData.fitnessLevel === value
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => updateField('fitnessLevel', value as any)}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formData.fitnessLevel === value ? 'border-primary bg-primary' : 'border-muted-foreground'
                          }`}>
                            {formData.fitnessLevel === value && (
                              <Check className="w-3 h-3 text-white" weight="bold" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{label}</div>
                            <div className="text-sm text-muted-foreground">{desc}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target weight="fill" className="text-primary" />
                  <h3 className="text-lg font-semibold">Goals & Preferences</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dietary-pattern">Dietary Pattern</Label>
                    <Select value={formData.dietaryPattern} onValueChange={(val: any) => updateField('dietaryPattern', val)}>
                      <SelectTrigger id="dietary-pattern">
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="omnivore">Omnivore</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Affects iron, B12, and zinc requirements
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="health-goal">Primary Health Goal</Label>
                    <Select value={formData.healthGoal} onValueChange={(val: any) => updateField('healthGoal', val)}>
                      <SelectTrigger id="health-goal">
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maintenance">Maintain Weight</SelectItem>
                        <SelectItem value="weight-loss">Lose Weight</SelectItem>
                        <SelectItem value="weight-gain">Gain Weight</SelectItem>
                        <SelectItem value="muscle-gain">Build Muscle</SelectItem>
                        <SelectItem value="athletic-performance">Athletic Performance</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Adjusts calorie and protein targets
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Heart weight="fill" className="text-primary" />
                  <h3 className="text-lg font-semibold">Special Considerations (Optional)</h3>
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Select any that apply. These adjust nutrient requirements for your specific needs.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <Checkbox
                      id="pregnancy"
                      checked={formData.specialConditions?.includes('pregnancy')}
                      onCheckedChange={() => toggleSpecialCondition('pregnancy')}
                    />
                    <div className="flex-1">
                      <Label htmlFor="pregnancy" className="font-medium cursor-pointer">
                        Pregnancy
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Increases requirements for iron, folate, calcium, and calories
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <Checkbox
                      id="lactation"
                      checked={formData.specialConditions?.includes('lactation')}
                      onCheckedChange={() => toggleSpecialCondition('lactation')}
                    />
                    <div className="flex-1">
                      <Label htmlFor="lactation" className="font-medium cursor-pointer">
                        Breastfeeding/Lactation
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Increases requirements for calories, protein, vitamins, and hydration
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <Checkbox
                      id="elderly"
                      checked={formData.specialConditions?.includes('elderly')}
                      onCheckedChange={() => toggleSpecialCondition('elderly')}
                    />
                    <div className="flex-1">
                      <Label htmlFor="elderly" className="font-medium cursor-pointer">
                        Over 65 Years Old
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Increases protein and B12 requirements for healthy aging
                      </p>
                    </div>
                  </div>
                </div>
                
                {formData.weight && formData.height && formData.age && formData.sex && formData.fitnessLevel && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg">Your Personalized Targets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const tempProfile: UserNutritionProfile = {
                          weight: formData.weight,
                          weightUnit: formData.weightUnit!,
                          height: formData.height,
                          heightUnit: formData.heightUnit!,
                          age: formData.age,
                          sex: formData.sex,
                          fitnessLevel: formData.fitnessLevel,
                          dietaryPattern: formData.dietaryPattern,
                          healthGoal: formData.healthGoal,
                          specialConditions: formData.specialConditions,
                          goals: []
                        }
                        
                        const dvs = calculatePersonalizedDailyValues(tempProfile)
                        const bmr = calculateBasalMetabolicRate(tempProfile)
                        const tdee = calculateTotalDailyEnergyExpenditure(tempProfile)
                        
                        return (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Daily Calories</p>
                              <p className="text-2xl font-bold text-primary">{dvs.calories}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Protein</p>
                              <p className="text-2xl font-bold text-primary">{dvs.protein}g</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Fiber</p>
                              <p className="text-2xl font-bold text-primary">{dvs.fiber}g</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Hydration</p>
                              <p className="text-2xl font-bold text-primary">{Math.round(dvs.hydrationMl / 250)} cups</p>
                            </div>
                          </div>
                        )
                      })()}
                      <p className="text-xs text-muted-foreground mt-4">
                        All nutrient tracking will be calculated against these personalized values
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            
            <div className="flex justify-between pt-6 border-t">
              {step > 1 ? (
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
              ) : (
                <div />
              )}
              
              {step < totalSteps ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                >
                  Next
                  <ArrowRight className="ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  disabled={!canProceed()}
                  className="bg-primary"
                >
                  <Check className="mr-2" weight="bold" />
                  {isUpdate ? 'Update Profile' : 'Complete Setup'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
