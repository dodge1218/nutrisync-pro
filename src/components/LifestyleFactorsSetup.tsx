import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent } from './ui/card'
import { Coffee, Wine, Cigarette, FirstAid, Brain } from '@phosphor-icons/react'

export interface LifestyleFactors {
  caffeineIntakeCups?: number
  caffeineTimingHours?: number
  alcoholDrinksPerWeek?: number
  smokingStatus?: 'never' | 'former' | 'current'
  regularMedications?: string[]
  stressLevelBaseline?: number
  lastUpdated?: number
}

interface LifestyleFactorsSetupProps {
  open: boolean
  onClose: () => void
  onSave: (factors: LifestyleFactors) => void
  existingFactors?: LifestyleFactors
}

export default function LifestyleFactorsSetup({ open, onClose, onSave, existingFactors }: LifestyleFactorsSetupProps) {
  const [factors, setFactors] = useState<LifestyleFactors>(existingFactors || {})
  const [medicationInput, setMedicationInput] = useState('')

  const handleSave = () => {
    onSave({
      ...factors,
      lastUpdated: Date.now(),
    })
    onClose()
  }

  const handleAddMedication = () => {
    if (medicationInput.trim()) {
      setFactors({
        ...factors,
        regularMedications: [...(factors.regularMedications || []), medicationInput.trim()]
      })
      setMedicationInput('')
    }
  }

  const handleRemoveMedication = (index: number) => {
    const updated = [...(factors.regularMedications || [])]
    updated.splice(index, 1)
    setFactors({ ...factors, regularMedications: updated })
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" weight="bold" />
            Lifestyle Factors
          </DialogTitle>
          <DialogDescription>
            Help us provide more accurate recommendations by sharing additional lifestyle factors.
            This information helps refine your adrenal load and stress calculations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Caffeine Intake */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Coffee className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Caffeine Consumption</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="caffeine-cups">Daily Coffee/Tea (cups)</Label>
                  <Input
                    id="caffeine-cups"
                    type="number"
                    min="0"
                    max="10"
                    placeholder="2"
                    value={factors.caffeineIntakeCups || ''}
                    onChange={(e) => setFactors({ ...factors, caffeineIntakeCups: parseFloat(e.target.value) || undefined })}
                  />
                  <p className="text-xs text-muted-foreground">1 cup ≈ 95mg caffeine</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caffeine-timing">Last Caffeine Time (hour)</Label>
                  <Input
                    id="caffeine-timing"
                    type="number"
                    min="0"
                    max="23"
                    placeholder="14"
                    value={factors.caffeineTimingHours || ''}
                    onChange={(e) => setFactors({ ...factors, caffeineTimingHours: parseFloat(e.target.value) || undefined })}
                  />
                  <p className="text-xs text-muted-foreground">24-hour format (14 = 2pm)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alcohol Consumption */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Wine className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Alcohol Consumption</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alcohol">Drinks per Week</Label>
                <Input
                  id="alcohol"
                  type="number"
                  min="0"
                  max="30"
                  placeholder="0"
                  value={factors.alcoholDrinksPerWeek || ''}
                  onChange={(e) => setFactors({ ...factors, alcoholDrinksPerWeek: parseFloat(e.target.value) || undefined })}
                />
                <p className="text-xs text-muted-foreground">1 drink = 12oz beer, 5oz wine, or 1.5oz spirits</p>
              </div>
            </CardContent>
          </Card>

          {/* Smoking Status */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Cigarette className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Smoking/Nicotine Use</h3>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={factors.smokingStatus}
                  onValueChange={(value: 'never' | 'former' | 'current') => setFactors({ ...factors, smokingStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never smoked</SelectItem>
                    <SelectItem value="former">Former smoker</SelectItem>
                    <SelectItem value="current">Current smoker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Regular Medications */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FirstAid className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Regular Medications/Supplements</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medication">Add Medication or Supplement</Label>
                <div className="flex gap-2">
                  <Input
                    id="medication"
                    placeholder="e.g., Vitamin D, Ibuprofen"
                    value={medicationInput}
                    onChange={(e) => setMedicationInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddMedication()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddMedication}>
                    Add
                  </Button>
                </div>

                {factors.regularMedications && factors.regularMedications.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {factors.regularMedications.map((med, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {med}
                        <button
                          onClick={() => handleRemoveMedication(index)}
                          className="ml-2 text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Baseline Stress Level */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Baseline Stress Level</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stress">Overall Stress Level (1-10)</Label>
                <div className="flex gap-4 items-center">
                  <Input
                    id="stress"
                    type="number"
                    min="1"
                    max="10"
                    placeholder="5"
                    value={factors.stressLevelBaseline || ''}
                    onChange={(e) => setFactors({ ...factors, stressLevelBaseline: parseFloat(e.target.value) || undefined })}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">
                    1 = Very relaxed • 10 = Extremely stressed
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>
            Remind me later
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
              onSave({ lastUpdated: Date.now() })
              onClose()
            }}>
              Skip
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
