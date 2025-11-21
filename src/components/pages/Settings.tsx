import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Alert, AlertDescription } from '../ui/alert'
import { Dialog, DialogContent } from '../ui/dialog'
import { User, BellRinging, FileText, Info, PencilSimple, Calendar } from '@phosphor-icons/react'
import ProfileSetup from '../ProfileSetup'
import { 
  type UserNutritionProfile,
  calculatePersonalizedDailyValues,
  getDaysSinceLastUpdate
} from '../../lib/personalizedNutrition'
import { calculateBMI, classifyBMI } from '../../lib/exerciseEngine'

export default function Settings() {
  const [profile] = useKV<UserNutritionProfile | null>('user-nutrition-profile', null)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  
  const daysSinceUpdate = profile ? getDaysSinceLastUpdate(profile.lastProfileUpdate) : null
  const needsUpdate = daysSinceUpdate !== null && daysSinceUpdate >= 7
  
  const bmi = profile ? calculateBMI(profile.weight, profile.weightUnit, profile.height, profile.heightUnit) : null
  const bmiClass = bmi ? classifyBMI(bmi) : null
  
  const personalizedDVs = profile ? calculatePersonalizedDailyValues(profile) : null
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User weight="fill" className="text-primary" />
            Settings & Preferences
          </CardTitle>
          <CardDescription>
            Manage your profile and app preferences
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <User weight="fill" />
                Nutrition Profile
                {needsUpdate && (
                  <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
                    Update Needed
                  </Badge>
                )}
              </CardTitle>
              {profile && (
                <CardDescription className="mt-2">
                  Your personalized daily nutrition targets
                </CardDescription>
              )}
            </div>
            {profile && (
              <Button size="sm" variant="outline" onClick={() => setShowProfileDialog(true)}>
                <PencilSimple className="mr-2" />
                Update Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!profile ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <strong>No profile set up yet.</strong>
                    <p className="text-sm mt-1">Create your profile to get personalized nutrition targets based on your unique needs.</p>
                  </div>
                  <Button size="sm" onClick={() => setShowProfileDialog(true)} className="ml-4">
                    Create Profile
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {needsUpdate && (
                <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                  <Calendar className="h-4 w-4 text-orange-600" />
                  <AlertDescription>
                    It's been <strong>{daysSinceUpdate} days</strong> since your last profile update. 
                    Update your information to ensure accurate nutrition targets.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Physical Stats</div>
                    <div className="font-medium">
                      {profile.age} years old, {profile.sex}
                    </div>
                    <div className="text-sm">
                      {profile.weight} {profile.weightUnit} • {profile.height} {profile.heightUnit}
                    </div>
                    {bmi && bmiClass && (
                      <div className="text-sm">
                        BMI: <span className={bmiClass.color}>{bmi.toFixed(1)}</span> ({bmiClass.classification})
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Activity & Goals</div>
                    <div className="font-medium capitalize">
                      {profile.fitnessLevel.replace('-', ' ')}
                    </div>
                    <div className="text-sm">
                      Goal: {profile.healthGoal?.replace('-', ' ')}
                    </div>
                    {profile.dietaryPattern && (
                      <div className="text-sm capitalize">
                        Diet: {profile.dietaryPattern}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Your Daily Targets</div>
                    {personalizedDVs && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground">Calories</div>
                          <div className="text-xl font-bold text-primary">{personalizedDVs.calories}</div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground">Protein</div>
                          <div className="text-xl font-bold text-primary">{personalizedDVs.protein}g</div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground">Fiber</div>
                          <div className="text-xl font-bold text-primary">{personalizedDVs.fiber}g</div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3">
                          <div className="text-xs text-muted-foreground">Water</div>
                          <div className="text-xl font-bold text-primary">{Math.round(personalizedDVs.hydrationMl / 250)}</div>
                          <div className="text-xs text-muted-foreground">cups</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {profile.lastProfileUpdate && (
                    <div className="text-xs text-muted-foreground">
                      Last updated: {new Date(profile.lastProfileUpdate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BellRinging weight="fill" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Show Supplement Suggestions</div>
              <div className="text-sm text-muted-foreground">Display affiliate product recommendations</div>
            </div>
            <Badge variant="secondary">Off (Default)</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Warm Food Preference</div>
              <div className="text-sm text-muted-foreground">Prioritize cooked/warm options for digestion</div>
            </div>
            <Badge variant="default">Enabled</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Dietary Pattern</div>
              <div className="text-sm text-muted-foreground">Affects recommendations and analysis</div>
            </div>
            <Badge variant="outline">{profile?.dietaryPattern ? profile.dietaryPattern.charAt(0).toUpperCase() + profile.dietaryPattern.slice(1) : 'Omnivore'}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText weight="fill" />
            Legal & Documentation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="font-medium text-sm mb-1">Full Legal Disclaimer</div>
            <p className="text-sm text-muted-foreground">
              View complete terms, limitations, and medical disclaimers
            </p>
            <p className="text-xs text-primary mt-1">📄 See /docs/legal-disclaimer.md in repository</p>
          </div>
          <Separator />
          <div>
            <div className="font-medium text-sm mb-1">Product Requirements (PRD)</div>
            <p className="text-sm text-muted-foreground">
              Review app features, roadmap, and design philosophy
            </p>
            <p className="text-xs text-primary mt-1">📄 See /PRD.md in repository</p>
          </div>
          <Separator />
          <div>
            <div className="font-medium text-sm mb-1">Business Plan</div>
            <p className="text-sm text-muted-foreground">
              Market strategy, monetization, and growth plans
            </p>
            <p className="text-xs text-primary mt-1">📄 See /docs/business-plan.md in repository</p>
          </div>
          <Separator />
          <div>
            <div className="font-medium text-sm mb-1">Wearable Integration Plan</div>
            <p className="text-sm text-muted-foreground">
              Future Apple Watch, Fitbit, and biometric sync (v2.0)
            </p>
            <p className="text-xs text-primary mt-1">📄 See /docs/wearable-integration-plan.md in repository</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">About This App</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            NutriWell is a nutrition intelligence platform designed to help you identify and fix specific
            nutrient gaps through food-first recommendations, synergy insights, and gut health optimization.
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Version: 1.0.0 (MVP)</div>
            <div>Built with: React, TypeScript, Tailwind CSS, shadcn/ui</div>
            <div>Data: Local storage (spark.kv) - your data stays private</div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ProfileSetup 
            initialProfile={profile || undefined}
            isUpdate={!!profile}
            onComplete={() => setShowProfileDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
