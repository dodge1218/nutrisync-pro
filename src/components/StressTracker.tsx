import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Slider } from './ui/slider'
import { Badge } from './ui/badge'
import { 
  Lightning, 
  Brain, 
  Heart, 
  Bed,
  Sparkle,
  TrendUp,
  Warning,
  CheckCircle
} from '@phosphor-icons/react'
import { toast } from 'sonner'

export interface StressLog {
  id: string
  timestamp: string
  stressLevel: number
  sleepQuality: number
  energyLevel: number
  physicalSymptoms: string[]
  mentalSymptoms: string[]
  notes?: string
}

interface StressTrackerProps {
  compact?: boolean
  onComplete?: () => void
}

const physicalSymptomOptions = [
  'Tension/tight muscles',
  'Headaches',
  'Digestive issues',
  'Fatigue',
  'Racing heart',
  'Shallow breathing'
]

const mentalSymptomOptions = [
  'Anxiety',
  'Brain fog',
  'Irritability',
  'Overwhelm',
  'Racing thoughts',
  'Difficulty focusing'
]

export default function StressTracker({ compact = false, onComplete }: StressTrackerProps) {
  const [stressLogs, setStressLogs] = useKV<StressLog[]>('stress-logs', [])
  const [isExpanded, setIsExpanded] = useState(!compact)

  const [stressLevel, setStressLevel] = useState(5)
  const [sleepQuality, setSleepQuality] = useState(7)
  const [energyLevel, setEnergyLevel] = useState(6)
  const [physicalSymptoms, setPhysicalSymptoms] = useState<string[]>([])
  const [mentalSymptoms, setMentalSymptoms] = useState<string[]>([])
  const [notes, setNotes] = useState('')

  const todayLog = stressLogs?.find(log => 
    log.timestamp.startsWith(new Date().toISOString().split('T')[0])
  )

  const handleSubmit = () => {
    const newLog: StressLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      stressLevel,
      sleepQuality,
      energyLevel,
      physicalSymptoms,
      mentalSymptoms,
      notes
    }

    setStressLogs((current) => {
      const filtered = (current || []).filter(log => 
        !log.timestamp.startsWith(new Date().toISOString().split('T')[0])
      )
      return [...filtered, newLog]
    })

    toast.success('Stress check-in saved')
    setIsExpanded(false)
    onComplete?.()
  }

  const getStressCategory = (level: number) => {
    if (level <= 3) return { label: 'Low Stress', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (level <= 6) return { label: 'Moderate Stress', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    return { label: 'High Stress', color: 'text-red-600', bgColor: 'bg-red-100' }
  }

  const togglePhysicalSymptom = (symptom: string) => {
    setPhysicalSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    )
  }

  const toggleMentalSymptom = (symptom: string) => {
    setMentalSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    )
  }

  if (compact && todayLog && !isExpanded) {
    const stressCategory = getStressCategory(todayLog.stressLevel)
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stressCategory.bgColor}`}>
                <Heart className={`w-5 h-5 ${stressCategory.color}`} weight="fill" />
              </div>
              <div>
                <p className="font-medium">Today's Check-in Complete</p>
                <p className="text-sm text-muted-foreground">{stressCategory.label} • Sleep: {todayLog.sleepQuality}/10</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(true)}>
              Update
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (compact && !isExpanded) {
    return (
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Lightning className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Daily Stress Check-in</p>
                <p className="text-sm text-muted-foreground">Help us personalize your recommendations</p>
              </div>
            </div>
            <Button onClick={() => setIsExpanded(true)}>
              Check In
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const stressCategory = getStressCategory(stressLevel)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightning className="w-5 h-5 text-primary" />
              Daily Stress Check-in
            </CardTitle>
            <CardDescription>
              Track your stress and get personalized nutrition recommendations
            </CardDescription>
          </div>
          {compact && (
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
              Close
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base">How stressed do you feel today?</Label>
            <Badge className={`${stressCategory.bgColor} ${stressCategory.color} border-0`}>
              {stressCategory.label}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-8">Low</span>
            <Slider
              value={[stressLevel]}
              onValueChange={(val) => setStressLevel(val[0])}
              min={1}
              max={10}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-8">High</span>
            <span className="text-2xl font-bold text-primary w-12 text-right">{stressLevel}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base flex items-center gap-2">
            <Bed className="w-4 h-4" />
            How well did you sleep last night?
          </Label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-8">Poor</span>
            <Slider
              value={[sleepQuality]}
              onValueChange={(val) => setSleepQuality(val[0])}
              min={1}
              max={10}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-8">Great</span>
            <span className="text-2xl font-bold text-accent w-12 text-right">{sleepQuality}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base flex items-center gap-2">
            <Sparkle className="w-4 h-4" />
            How is your energy level?
          </Label>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-8">Low</span>
            <Slider
              value={[energyLevel]}
              onValueChange={(val) => setEnergyLevel(val[0])}
              min={1}
              max={10}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-8">High</span>
            <span className="text-2xl font-bold text-secondary w-12 text-right">{energyLevel}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Physical Symptoms (select all that apply)
          </Label>
          <div className="flex flex-wrap gap-2">
            {physicalSymptomOptions.map(symptom => (
              <Button
                key={symptom}
                type="button"
                variant={physicalSymptoms.includes(symptom) ? 'default' : 'outline'}
                size="sm"
                onClick={() => togglePhysicalSymptom(symptom)}
              >
                {symptom}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Mental Symptoms (select all that apply)
          </Label>
          <div className="flex flex-wrap gap-2">
            {mentalSymptomOptions.map(symptom => (
              <Button
                key={symptom}
                type="button"
                variant={mentalSymptoms.includes(symptom) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleMentalSymptom(symptom)}
              >
                {symptom}
              </Button>
            ))}
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full" size="lg">
          <CheckCircle className="w-5 h-5 mr-2" />
          Save Check-in
        </Button>
      </CardContent>
    </Card>
  )
}
