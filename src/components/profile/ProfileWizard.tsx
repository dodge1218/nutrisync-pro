import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import PhysicalProfileSetup from './PhysicalProfileSetup'
import ActivityProfileSetup from './ActivityProfileSetup'
import type { CompleteUserProfile, UserPhysicalProfile, UserActivityProfile } from '@/lib/personalizedDVs'

type ProfileStage = 'physical' | 'activity' | 'complete'

interface ProfileWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialStage?: ProfileStage
}

export default function ProfileWizard({ open, onOpenChange, initialStage = 'physical' }: ProfileWizardProps) {
  const [profile, setProfile] = useKV<CompleteUserProfile>('complete-user-profile', {})
  const [currentStage, setCurrentStage] = useState<ProfileStage>(initialStage)

  const handlePhysicalProfileSave = (data: UserPhysicalProfile) => {
    setProfile((current) => ({
      ...current,
      physical: data,
      lastUpdated: Date.now(),
      stagesCompleted: [...(current?.stagesCompleted || []), 'physical'].filter((v, i, a) => a.indexOf(v) === i)
    }))
    setCurrentStage('activity')
    toast.success('Physical profile saved')
  }

  const handleActivityProfileSave = (data: UserActivityProfile) => {
    setProfile((current) => ({
      ...current,
      activity: data,
      lastUpdated: Date.now(),
      setupComplete: true,
      stagesCompleted: [...(current?.stagesCompleted || []), 'physical', 'activity'].filter((v, i, a) => a.indexOf(v) === i)
    }))
    setCurrentStage('complete')
    toast.success('Activity profile saved - personalized daily values are now active!')
    setTimeout(() => {
      onOpenChange(false)
    }, 1500)
  }

  const handleSkip = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {currentStage === 'physical' && (
          <>
            <DialogHeader>
              <DialogTitle>Step 1: Physical Profile</DialogTitle>
              <DialogDescription>
                These details help us calculate your personalized nutrient needs
              </DialogDescription>
            </DialogHeader>
            <PhysicalProfileSetup
              initialData={profile?.physical}
              onSave={handlePhysicalProfileSave}
              onSkip={handleSkip}
            />
          </>
        )}

        {currentStage === 'activity' && (
          <>
            <DialogHeader>
              <DialogTitle>Step 2: Activity & Goals</DialogTitle>
              <DialogDescription>
                Tell us about your activity level to optimize your calorie and protein needs
              </DialogDescription>
            </DialogHeader>
            <ActivityProfileSetup
              initialData={profile?.activity}
              onSave={handleActivityProfileSave}
              onSkip={handleSkip}
            />
          </>
        )}

        {currentStage === 'complete' && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">Profile Complete!</h3>
            <p className="text-muted-foreground">
              Your personalized daily values are now active
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
