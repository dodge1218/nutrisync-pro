import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import ProfileSetup from './ProfileSetup'
import LifestyleFactorsSetup, { type LifestyleFactors } from './LifestyleFactorsSetup'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Target, Coffee, ArrowRight } from '@phosphor-icons/react'
import { type UserNutritionProfile } from '../lib/personalizedNutrition'

interface PopupState {
  stage1Complete: boolean
  stage2Complete: boolean
  stage3Complete: boolean
  stage4Complete: boolean
  stage4Triggered: boolean
  stage5Complete: boolean
  stage5Triggered: boolean
  firstLoginTimestamp?: number
  loginCount: number
  pageClickCount: number
  lastStage4Check?: number
  lastStage5Check?: number
}

interface ProfilePopupManagerProps {
  appMode: 'nutriwell' | 'sleepsync' | 'lifeflow'
  onPageClick: () => void
}

export default function ProfilePopupManager({ appMode, onPageClick }: ProfilePopupManagerProps) {
  const [profile] = useKV<UserNutritionProfile | null>('user-nutrition-profile', null)
  const [lifestyleFactors] = useKV<LifestyleFactors | null>('lifestyle-factors', null)
  const [popupState, setPopupState] = useKV<PopupState>('profile-popup-state', {
    stage1Complete: false,
    stage2Complete: false,
    stage3Complete: false,
    stage4Complete: false,
    stage4Triggered: false,
    stage5Complete: false,
    stage5Triggered: false,
    loginCount: 0,
    pageClickCount: 0
  })

  const [activeStage, setActiveStage] = useState<number | null>(null)
  const [showGoalInput, setShowGoalInput] = useState(false)
  const [goalTitle, setGoalTitle] = useState('')
  const [goalDescription, setGoalDescription] = useState('')

  useEffect(() => {
    if (!popupState) return

    setPopupState((current) => {
      if (!current) return {
        stage1Complete: false,
        stage2Complete: false,
        stage3Complete: false,
        stage4Complete: false,
        stage4Triggered: false,
        stage5Complete: false,
        stage5Triggered: false,
        loginCount: 1,
        pageClickCount: 0,
        firstLoginTimestamp: Date.now()
      }
      
      const updated = { ...current }
      
      if (!current.firstLoginTimestamp) {
        updated.firstLoginTimestamp = Date.now()
      }
      
      updated.loginCount = (current.loginCount || 0) + 1
      
      return updated
    })
  }, [])

  useEffect(() => {
    if (!popupState) return

    if (profile && !popupState.stage1Complete) {
      setPopupState((current) => {
        if (!current) return current
        return { ...current, stage1Complete: true }
      })
    }

    if (lifestyleFactors && !popupState.stage4Complete) {
      setPopupState((current) => {
        if (!current) return current
        return { ...current, stage4Complete: true }
      })
    }
  }, [profile, lifestyleFactors, popupState, setPopupState])

  useEffect(() => {
    if (!popupState) return
    
    const state = popupState

    if (!state.stage1Complete) {
      return
    }

    if (appMode === 'sleepsync' && !state.stage2Complete) {
      setActiveStage(2)
      return
    }

    const now = Date.now()
    const daysSinceFirstLogin = state.firstLoginTimestamp 
      ? (now - state.firstLoginTimestamp) / (1000 * 60 * 60 * 24) 
      : 0
    const loginCount = state.loginCount || 0

    if (!state.stage4Triggered && !state.stage4Complete) {
      if (daysSinceFirstLogin >= 7 || loginCount >= 5) {
        if (!state.lastStage4Check || (now - state.lastStage4Check) > 60000) {
          setPopupState((current) => {
            if (!current) return current
            return { 
              ...current, 
              stage4Triggered: true,
              lastStage4Check: now
            }
          })
          setActiveStage(4)
          return
        }
      }
    }

    if (!state.stage5Triggered && !state.stage5Complete && state.pageClickCount >= 7) {
      if (!state.lastStage5Check || (now - state.lastStage5Check) > 60000) {
        setPopupState((current) => {
          if (!current) return current
          return { 
            ...current, 
            stage5Triggered: true,
            lastStage5Check: now
          }
        })
        setActiveStage(5)
        return
      }
    }
  }, [appMode, popupState, setPopupState])

  const handlePageClick = () => {
    if (!popupState) return
    
    setPopupState((current) => {
      if (!current) return current
      return {
        ...current,
        pageClickCount: (current.pageClickCount || 0) + 1
      }
    })
    
    onPageClick()
  }

  useEffect(() => {
    document.addEventListener('click', handlePageClick)
    return () => document.removeEventListener('click', handlePageClick)
  }, [])

  const handleStage1Complete = () => {
    setPopupState((current) => {
      if (!current) return current
      return { ...current, stage1Complete: true }
    })
    setActiveStage(null)
  }

  const handleStage2Complete = () => {
    setPopupState((current) => {
      if (!current) return current
      return { ...current, stage2Complete: true }
    })
    setActiveStage(null)
  }

  const handleStage4Complete = (factors: LifestyleFactors) => {
    setPopupState((current) => {
      if (!current) return current
      return { ...current, stage4Complete: true }
    })
    setActiveStage(null)
  }

  const handleStage5Complete = () => {
    setPopupState((current) => {
      if (!current) return current
      return { ...current, stage5Complete: true }
    })
    setActiveStage(null)
  }

  const handleGoalSubmit = () => {
    if (!goalTitle.trim()) return

    handleStage5Complete()
    setShowGoalInput(false)
    setGoalTitle('')
    setGoalDescription('')
  }

  if (activeStage === 1 || (!profile && !popupState?.stage1Complete)) {
    return (
      <ProfileSetup
        initialProfile={profile || undefined}
        isUpdate={false}
        onComplete={handleStage1Complete}
      />
    )
  }

  if (activeStage === 2) {
    return (
      <Dialog open={true} onOpenChange={() => handleStage2Complete()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Sleep & Timing Setup
            </DialogTitle>
            <DialogDescription>
              Set your sleep schedule to optimize meal timing for better rest
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              SleepSync mode is being enhanced with personalized sleep timing. 
              You can configure this in Settings or when you first use SleepSync mode.
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleStage2Complete}>
              Got it
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (activeStage === 4) {
    return (
      <LifestyleFactorsSetup
        open={true}
        onClose={() => setActiveStage(null)}
        onSave={handleStage4Complete}
        existingFactors={lifestyleFactors || undefined}
      />
    )
  }

  if (activeStage === 5 || showGoalInput) {
    return (
      <Dialog open={true} onOpenChange={() => {
        setShowGoalInput(false)
        handleStage5Complete()
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" weight="fill" />
              What's One Goal You're Working Toward?
            </DialogTitle>
            <DialogDescription>
              Setting a goal helps us provide more personalized recommendations
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="goal-title">Goal</Label>
              <Input
                id="goal-title"
                placeholder="e.g., Run a 5K, lose 10 lbs, improve gut health"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal-description">Details (optional)</Label>
              <Input
                id="goal-description"
                placeholder="Any additional context..."
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
              />
            </div>

            {!popupState?.stage3Complete && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Want to add exercise goals?</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Track workouts, calculate calories burned, and get personalized fitness recommendations
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setActiveStage(null)
                  }}
                >
                  Add Exercise Goals
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-between gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowGoalInput(false)
                handleStage5Complete()
              }}
            >
              Skip for Now
            </Button>
            <Button 
              onClick={handleGoalSubmit}
              disabled={!goalTitle.trim()}
            >
              Save Goal
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return null
}
