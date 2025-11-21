import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Textarea } from './ui/textarea'
import { Card, CardContent } from './ui/card'
import { toast } from 'sonner'
import type { CompleteUserProfile, UserLifestyleProfile } from '@/lib/personalizedDVs'

interface LifestyleFactorsSetupProps {
  open: boolean
  onComplete: () => void
  onDismiss: () => void
  onSnooze: () => void
}

export default function LifestyleFactorsSetup({ open, onComplete, onDismiss, onSnooze }: LifestyleFactorsSetupProps) {
  const [profile, setProfile] = useKV<CompleteUserProfile>('complete-user-profile', {})
  
  const [caffeineIntake, setCaffeineIntake] = useState<string>(
    profile?.lifestyle?.caffeineIntake?.toString() || '0'
  )
  const [alcoholFrequency, setAlcoholFrequency] = useState<string>(
    profile?.lifestyle?.alcoholFrequency || 'none'
  )
  const [smokingStatus, setSmokingStatus] = useState<string>(
    profile?.lifestyle?.smokingStatus || 'none'
  )
  const [stressLevel, setStressLevel] = useState<string>(
    profile?.lifestyle?.stressLevel?.toString() || '5'
  )
  const [medications, setMedications] = useState<string>(
    profile?.lifestyle?.medications || ''
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const lifestyleData: UserLifestyleProfile = {
      caffeineIntake: parseInt(caffeineIntake) || 0,
      alcoholFrequency: alcoholFrequency as UserLifestyleProfile['alcoholFrequency'],
      smokingStatus: smokingStatus as UserLifestyleProfile['smokingStatus'],
      stressLevel: parseInt(stressLevel) || 5,
      medications: medications.trim() || undefined
    }
    
    setProfile((current) => ({
      ...current,
      lifestyle: lifestyleData,
      lastUpdated: Date.now()
    }))
    
    toast.success('Lifestyle factors saved')
    onComplete()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDismiss()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lifestyle Factors</DialogTitle>
          <DialogDescription>
            These factors help us refine your adrenal load calculations and personalized recommendations
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="caffeine">Daily Caffeine Intake</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="caffeine"
                    type="number"
                    value={caffeineIntake}
                    onChange={(e) => setCaffeineIntake(e.target.value)}
                    min="0"
                    max="10"
                    className="max-w-24"
                  />
                  <span className="text-sm text-muted-foreground">cups of coffee/day (or equivalent)</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  1 cup coffee ≈ 95mg caffeine, 1 cup tea ≈ 47mg, 1 energy drink ≈ 80mg
                </p>
              </div>

              <div className="space-y-3">
                <Label>Alcohol Consumption</Label>
                <RadioGroup value={alcoholFrequency} onValueChange={setAlcoholFrequency}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="alcohol-none" />
                    <Label htmlFor="alcohol-none" className="font-normal cursor-pointer">
                      None
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="occasional" id="alcohol-occasional" />
                    <Label htmlFor="alcohol-occasional" className="font-normal cursor-pointer">
                      Occasional (1-2 drinks/month)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="alcohol-moderate" />
                    <Label htmlFor="alcohol-moderate" className="font-normal cursor-pointer">
                      Moderate (1-7 drinks/week)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="frequent" id="alcohol-frequent" />
                    <Label htmlFor="alcohol-frequent" className="font-normal cursor-pointer">
                      Frequent (7+ drinks/week)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Smoking/Nicotine Use</Label>
                <RadioGroup value={smokingStatus} onValueChange={setSmokingStatus}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="smoking-none" />
                    <Label htmlFor="smoking-none" className="font-normal cursor-pointer">
                      Never smoked
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="former" id="smoking-former" />
                    <Label htmlFor="smoking-former" className="font-normal cursor-pointer">
                      Former smoker
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="current" id="smoking-current" />
                    <Label htmlFor="smoking-current" className="font-normal cursor-pointer">
                      Current smoker/vaper
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stress">Baseline Stress Level</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="stress"
                    type="range"
                    value={stressLevel}
                    onChange={(e) => setStressLevel(e.target.value)}
                    min="1"
                    max="10"
                    className="flex-1"
                  />
                  <span className="font-semibold text-lg w-8 text-center">{stressLevel}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low stress</span>
                  <span>High stress</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications">Regular Medications/Supplements (optional)</Label>
                <Textarea
                  id="medications"
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  placeholder="List any medications or supplements you take regularly..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  This helps us provide better recommendations and identify potential nutrient interactions
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted p-4 rounded-lg text-sm">
            <p className="text-muted-foreground">
              These factors influence your adrenal load score and help us recommend stress-reducing nutrients and lifestyle modifications.
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Save & Continue
            </Button>
            <Button type="button" variant="outline" onClick={onSnooze}>
              Remind Me Tomorrow
            </Button>
            <Button type="button" variant="ghost" onClick={onDismiss}>
              Skip
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
