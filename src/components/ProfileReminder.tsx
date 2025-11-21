import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Badge } from './ui/badge'
import { Calendar, X, ArrowRight, CheckCircle } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  shouldPromptProfileUpdate, 
  getDaysSinceLastUpdate,
  type UserNutritionProfile 
} from '../lib/personalizedNutrition'

interface ProfileReminderProps {
  onUpdateClick: () => void
}

export default function ProfileReminder({ onUpdateClick }: ProfileReminderProps) {
  const [profile] = useKV<UserNutritionProfile | null>('user-nutrition-profile', null)
  const [dismissed, setDismissed] = useKV<number | null>('profile-reminder-dismissed', null)
  const [showDialog, setShowDialog] = useState(false)
  
  const shouldShowReminder = profile && shouldPromptProfileUpdate(profile.lastProfileUpdate)
  const daysSinceUpdate = profile ? getDaysSinceLastUpdate(profile.lastProfileUpdate) : 0
  
  const isDismissedRecently = dismissed && (Date.now() - dismissed < 24 * 60 * 60 * 1000)
  
  useEffect(() => {
    if (shouldShowReminder && !isDismissedRecently) {
      const timer = setTimeout(() => {
        setShowDialog(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [shouldShowReminder, isDismissedRecently])
  
  const handleDismiss = () => {
    setDismissed(Date.now())
    setShowDialog(false)
  }
  
  const handleUpdate = () => {
    setShowDialog(false)
    onUpdateClick()
  }
  
  if (!shouldShowReminder || isDismissedRecently) {
    return null
  }
  
  return (
    <>
      <AnimatePresence>
        {!showDialog && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
              <Calendar className="h-4 w-4 text-orange-600" />
              <AlertDescription className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="font-medium">Profile Update Recommended</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    It's been {daysSinceUpdate} days since your last profile update. Keep your nutrition targets accurate!
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" onClick={handleDismiss}>
                    Later
                  </Button>
                  <Button size="sm" onClick={() => setShowDialog(true)}>
                    Update Now
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Calendar weight="fill" className="text-primary" />
              Time to Re-evaluate Your Profile
            </DialogTitle>
            <DialogDescription className="text-base mt-3">
              It's been <strong>{daysSinceUpdate} days</strong> since you last updated your profile. 
              Let's make sure your nutrition targets are still accurate.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Check-In Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Has your weight changed?</p>
                    <p className="text-xs text-muted-foreground">Even small changes affect your calorie needs</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Has your activity level changed?</p>
                    <p className="text-xs text-muted-foreground">New exercise routine? More sedentary?</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Are you working toward a new goal?</p>
                    <p className="text-xs text-muted-foreground">Weight loss, muscle gain, performance?</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Any new health considerations?</p>
                    <p className="text-xs text-muted-foreground">Pregnancy, training, dietary changes?</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Alert>
              <AlertDescription className="text-sm">
                <strong>Why this matters:</strong> Your personalized daily values for calories, protein, vitamins, 
                and minerals are calculated from your profile. Keeping it updated ensures accurate tracking and recommendations.
              </AlertDescription>
            </Alert>
          </div>
          
          <div className="flex justify-between gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleDismiss} className="flex-1">
              <X className="mr-2" />
              Skip for Now
            </Button>
            <Button onClick={handleUpdate} className="flex-1 bg-primary">
              Update Profile
              <ArrowRight className="ml-2" />
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            You can always update your profile from Settings
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}
