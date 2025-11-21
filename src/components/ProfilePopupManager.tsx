import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import ProfileWizard from './profile/ProfileWizard'
import LifestyleFactorsSetup from './LifestyleFactorsSetup'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { toast } from 'sonner'
import type { CompleteUserProfile } from '@/lib/personalizedDVs'
type AppMode = 'nutriwell' | 'sleepsync' | 'lifeflow'

interface PopupTrigger {
  stage: 'physical' | 'sleep' | 'exercise' | 'lifestyle' | 'goals'
  triggered: boolean
  triggeredAt?: number
  dismissed: boolean
  snoozedUntil?: number
}

interface AppState {
  mode: AppMode
  loginCount: number
  daysActive: number
  pageClicks: number
  firstLogin?: number
}

export default function ProfilePopupManager({ mode }: { mode: AppMode }) {
  const [profile, setProfile] = useKV<CompleteUserProfile>('complete-user-profile', {})
  const [appState, setAppState] = useKV<AppState>('app-state', {
    mode: 'nutriwell',
    loginCount: 0,
    daysActive: 0,
    pageClicks: 0
  })
  const [triggers, setTriggers] = useKV<Record<string, PopupTrigger>>('profile-triggers', {})
  
  const [showPhysicalSetup, setShowPhysicalSetup] = useState(false)
  const [showSleepSetup, setShowSleepSetup] = useState(false)
  const [showLifestyleSetup, setShowLifestyleSetup] = useState(false)
  const [showGoalSetup, setShowGoalSetup] = useState(false)
  
  const [goalTitle, setGoalTitle] = useState('')
  const [goalDescription, setGoalDescription] = useState('')

  useEffect(() => {
    const now = Date.now()
    const stages = profile?.stagesCompleted || []
    const currentTriggers = triggers || {}

    if (!stages.includes('physical') && !currentTriggers.physical?.dismissed) {
      return
    }

    if (mode === 'sleepsync' && !stages.includes('sleep') && !currentTriggers.sleep?.dismissed) {
      if (!currentTriggers.sleep?.triggered) {
        setTriggers((prev) => ({
          ...prev,
          sleep: { stage: 'sleep', triggered: true, triggeredAt: now, dismissed: false }
        }))
        setShowSleepSetup(true)
      } else if (currentTriggers.sleep.snoozedUntil && now >= currentTriggers.sleep.snoozedUntil) {
        setShowSleepSetup(true)
      }
    }

    if (!stages.includes('lifestyle') && !currentTriggers.lifestyle?.dismissed) {
      const loginThreshold = 5
      const daysThreshold = 7
      const firstLogin = appState?.firstLogin || now
      const daysSinceFirst = (now - firstLogin) / (1000 * 60 * 60 * 24)
      
      if ((appState?.loginCount || 0) >= loginThreshold || daysSinceFirst >= daysThreshold) {
        if (!currentTriggers.lifestyle?.triggered) {
          setTriggers((prev) => ({
            ...prev,
            lifestyle: { stage: 'lifestyle', triggered: true, triggeredAt: now, dismissed: false }
          }))
          setShowLifestyleSetup(true)
        } else if (currentTriggers.lifestyle.snoozedUntil && now >= currentTriggers.lifestyle.snoozedUntil) {
          setShowLifestyleSetup(true)
        }
      }
    }

    if (!stages.includes('goals') && !currentTriggers.goals?.dismissed) {
      if ((appState?.pageClicks || 0) >= 7) {
        if (!currentTriggers.goals?.triggered) {
          setTriggers((prev) => ({
            ...prev,
            goals: { stage: 'goals', triggered: true, triggeredAt: now, dismissed: false }
          }))
          setShowGoalSetup(true)
        } else if (currentTriggers.goals.snoozedUntil && now >= currentTriggers.goals.snoozedUntil) {
          setShowGoalSetup(true)
        }
      }
    }
  }, [mode, appState, profile?.stagesCompleted, triggers])

  const handleSleepSetupSave = (sleepTime: string, wakeTime: string) => {
    setProfile((current) => ({
      ...current,
      sleep: { goalSleepTime: sleepTime, goalWakeTime: wakeTime },
      lastUpdated: Date.now(),
      stagesCompleted: [...(current?.stagesCompleted || []), 'sleep'].filter((v, i, a) => a.indexOf(v) === i)
    }))
    setTriggers((prev) => ({
      ...prev,
      sleep: { ...prev.sleep!, dismissed: true }
    }))
    setShowSleepSetup(false)
    toast.success('Sleep schedule saved')
  }

  const handleLifestyleSetupComplete = () => {
    setProfile((current) => ({
      ...current,
      stagesCompleted: [...(current?.stagesCompleted || []), 'lifestyle'].filter((v, i, a) => a.indexOf(v) === i)
    }))
    setTriggers((prev) => ({
      ...(prev || {}),
      lifestyle: { ...(prev?.lifestyle || { stage: 'lifestyle', triggered: true }), dismissed: true }
    }))
    setShowLifestyleSetup(false)
  }

  const handleGoalSetupSave = () => {
    if (!goalTitle.trim()) {
      toast.error('Please enter a goal title')
      return
    }

    setProfile((current) => ({
      ...current,
      stagesCompleted: [...(current?.stagesCompleted || []), 'goals'].filter((v, i, a) => a.indexOf(v) === i)
    }))
    setTriggers((prev) => ({
      ...(prev || {}),
      goals: { ...(prev?.goals || { stage: 'goals', triggered: true }), dismissed: true }
    }))
    setShowGoalSetup(false)
    toast.success('Goal saved! Add more in LifeFlow.')
  }

  const handleDismissSleep = () => {
    setTriggers((prev) => ({
      ...(prev || {}),
      sleep: { ...(prev?.sleep || { stage: 'sleep', triggered: true }), dismissed: true }
    }))
    setShowSleepSetup(false)
  }

  const handleSnoozeSleep = () => {
    const tomorrow = Date.now() + (24 * 60 * 60 * 1000)
    setTriggers((prev) => ({
      ...(prev || {}),
      sleep: { ...(prev?.sleep || { stage: 'sleep', triggered: true }), snoozedUntil: tomorrow, dismissed: false }
    }))
    setShowSleepSetup(false)
    toast.info('Reminder snoozed until tomorrow')
  }

  const handleDismissLifestyle = () => {
    setTriggers((prev) => ({
      ...(prev || {}),
      lifestyle: { ...(prev?.lifestyle || { stage: 'lifestyle', triggered: true }), dismissed: true }
    }))
    setShowLifestyleSetup(false)
  }

  const handleSnoozeLifestyle = () => {
    const tomorrow = Date.now() + (24 * 60 * 60 * 1000)
    setTriggers((prev) => ({
      ...(prev || {}),
      lifestyle: { ...(prev?.lifestyle || { stage: 'lifestyle', triggered: true }), snoozedUntil: tomorrow, dismissed: false }
    }))
    setShowLifestyleSetup(false)
    toast.info('Reminder snoozed until tomorrow')
  }

  const handleDismissGoal = () => {
    setTriggers((prev) => ({
      ...(prev || {}),
      goals: { ...(prev?.goals || { stage: 'goals', triggered: true }), dismissed: true }
    }))
    setShowGoalSetup(false)
  }

  const handleSnoozeGoal = () => {
    const tomorrow = Date.now() + (24 * 60 * 60 * 1000)
    setTriggers((prev) => ({
      ...(prev || {}),
      goals: { ...(prev?.goals || { stage: 'goals', triggered: true }), snoozedUntil: tomorrow, dismissed: false }
    }))
    setShowGoalSetup(false)
    toast.info('Reminder snoozed until tomorrow')
  }

  return (
    <>
      <Dialog open={showSleepSetup} onOpenChange={setShowSleepSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Your Sleep Schedule</DialogTitle>
            <DialogDescription>
              Help optimize your meal timing by telling us when you typically sleep and wake
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sleep-time">Typical Sleep Time</Label>
              <Input
                id="sleep-time"
                type="time"
                defaultValue={profile?.sleep?.goalSleepTime || '22:00'}
                onChange={(e) => {
                  const wakeTime = profile?.sleep?.goalWakeTime || '07:00'
                  handleSleepSetupSave(e.target.value, wakeTime)
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wake-time">Typical Wake Time</Label>
              <Input
                id="wake-time"
                type="time"
                defaultValue={profile?.sleep?.goalWakeTime || '07:00'}
                onChange={(e) => {
                  const sleepTime = profile?.sleep?.goalSleepTime || '22:00'
                  handleSleepSetupSave(sleepTime, e.target.value)
                }}
              />
            </div>
            <div className="bg-muted p-3 rounded-lg text-sm">
              <p className="text-muted-foreground">
                SleepSync uses your sleep schedule to recommend optimal meal timing for better rest quality.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSnoozeSleep} variant="outline" className="flex-1">
              Remind Me Tomorrow
            </Button>
            <Button onClick={handleDismissSleep} variant="ghost">
              Skip
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {showLifestyleSetup && (
        <LifestyleFactorsSetup
          open={showLifestyleSetup}
          onComplete={handleLifestyleSetupComplete}
          onDismiss={handleDismissLifestyle}
          onSnooze={handleSnoozeLifestyle}
        />
      )}

      <Dialog open={showGoalSetup} onOpenChange={setShowGoalSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What's one goal you're working toward?</DialogTitle>
            <DialogDescription>
              Set a goal and we'll help you schedule time to work on it in LifeFlow
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="goal-title">Goal</Label>
              <Input
                id="goal-title"
                placeholder="E.g., Run a 5K, Learn Spanish, Write a book"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-desc">Why is this important to you? (optional)</Label>
              <Textarea
                id="goal-desc"
                placeholder="Describe why you want to achieve this goal..."
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="bg-muted p-3 rounded-lg text-sm">
              <p className="text-muted-foreground">
                LifeFlow will help you schedule daily time blocks to work toward this goal.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleGoalSetupSave} className="flex-1">
              Save Goal
            </Button>
            <Button onClick={handleSnoozeGoal} variant="outline">
              Remind Me Tomorrow
            </Button>
            <Button onClick={handleDismissGoal} variant="ghost">
              Skip
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
