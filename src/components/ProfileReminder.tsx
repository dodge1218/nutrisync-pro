import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { toast } from 'sonner'
import { shouldShowReEvaluationReminder, type CompleteUserProfile } from '@/lib/personalizedDVs'
import { Calendar, TrendUp, Activity, Coffee } from '@phosphor-icons/react'

export default function ProfileReminder() {
  const [profile, setProfile] = useKV<CompleteUserProfile>('complete-user-profile', {})
  const [showReminder, setShowReminder] = useState(false)
  const [snoozedUntil, setSnoozedUntil] = useKV<number | null>('profile-reminder-snoozed', null)

  useEffect(() => {
    if (!profile) return
    
    const now = Date.now()
    
    if (snoozedUntil && now < snoozedUntil) {
      return
    }
    
    if (shouldShowReEvaluationReminder(profile)) {
      setShowReminder(true)
    }
  }, [profile, snoozedUntil])

  const handleUpdateProfile = () => {
    setProfile((current) => ({
      ...current,
      lastUpdated: Date.now()
    }))
    setShowReminder(false)
    toast.success('Profile marked as up-to-date')
  }

  const handleSnooze = () => {
    const tomorrow = Date.now() + (24 * 60 * 60 * 1000)
    setSnoozedUntil(tomorrow)
    setShowReminder(false)
    toast.info('Reminder snoozed until tomorrow')
  }

  const handleSkipWeek = () => {
    const nextWeek = Date.now() + (7 * 24 * 60 * 60 * 1000)
    setSnoozedUntil(nextWeek)
    setShowReminder(false)
    toast.info('Reminder snoozed for 1 week')
  }

  if (!showReminder) return null

  const daysSinceUpdate = profile?.lastUpdated 
    ? Math.floor((Date.now() - profile.lastUpdated) / (1000 * 60 * 60 * 24))
    : Infinity

  return (
    <Dialog open={showReminder} onOpenChange={setShowReminder}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Profile Check-In Time
          </DialogTitle>
          <DialogDescription>
            It's been {daysSinceUpdate} days since you last updated your profile. Let's make sure your personalized daily values are still accurate.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Check-In Questions</CardTitle>
              <CardDescription>Have any of these changed?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <TrendUp className="w-5 h-5 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Weight or body composition</p>
                  <p className="text-sm text-muted-foreground">
                    Affects calorie and protein needs
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Activity level or exercise habits</p>
                  <p className="text-sm text-muted-foreground">
                    Changes daily calorie requirements
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Coffee className="w-5 h-5 mt-0.5 text-primary" />
                <div>
                  <p className="font-medium">Stress levels or lifestyle factors</p>
                  <p className="text-sm text-muted-foreground">
                    Influences nutrient recommendations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted p-4 rounded-lg text-sm">
            <p className="text-muted-foreground">
              Your personalized daily values ensure accurate nutrient tracking. Regular updates help maintain the best recommendations for your current situation.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={handleUpdateProfile} className="w-full">
            All Good - Profile is Up to Date
          </Button>
          <div className="flex gap-2">
            <Button onClick={handleSnooze} variant="outline" className="flex-1">
              Remind Me Tomorrow
            </Button>
            <Button onClick={handleSkipWeek} variant="ghost" className="flex-1">
              Skip This Week
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
