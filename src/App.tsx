import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from './components/ui/sonner'
import { Button } from './components/ui/button'
import LogFood from './components/pages/LogFood'
import Recommendations from './components/pages/Recommendations'
import Education from './components/pages/Education'
import Settings from './components/pages/Settings'
import Achievements from './components/pages/Achievements'
import MealPlanner from './components/pages/MealPlanner'
import FoodBudget from './components/pages/FoodBudget'
import SleepSync from './components/pages/SleepSync'
import LifeFlow from './components/pages/LifeFlow'
import DisclaimerBanner from './components/DisclaimerBanner'
import Navigation from './components/Navigation'
import WelcomeFlow from './components/WelcomeFlow'
import TutorialOverlay from './components/TutorialOverlay'
import ProfileReminder from './components/ProfileReminder'
import ProfilePopupManager from './components/ProfilePopupManager'
import { LoginForm } from './components/auth/LoginForm'
import { useAuth } from './hooks/useAuth'
import { Moon, Leaf, CalendarBlank, SignOut } from '@phosphor-icons/react'
import type { FoodLog } from './lib/nutritionEngine'
import { getLast7DaysKeys, getDateKey } from './lib/historyTracking'
import type { UserOnboardingProfile, TutorialProgress } from './lib/onboardingEngine'
import { getTutorialSteps } from './lib/onboardingEngine'
import { toast } from 'sonner'

export type Page = 'log-food' | 'meal-planner' | 'food-budget' | 'recommendations' | 'education' | 'achievements' | 'settings' | 'sleepsync' | 'lifeflow'
export type AppMode = 'nutriwell' | 'sleepsync' | 'lifeflow'

function App() {
  const { user, loading, signOut } = useAuth()
  const [currentPage, setCurrentPage] = useState<Page>('food-budget')
  const [appMode, setAppMode] = useKV<AppMode>('app-mode', 'nutriwell')
  const [foodLogs, setFoodLogs] = useKV<FoodLog[]>('food-logs', [])
  const [onboardingProfile, setOnboardingProfile] = useKV<UserOnboardingProfile | null>('onboarding-profile', null)
  const [tutorialProgress, setTutorialProgress] = useKV<TutorialProgress | null>('tutorial-progress', null)
  const [showTutorial, setShowTutorial] = useState(false)

  const logs = foodLogs || []
  const mode = appMode || 'nutriwell'

  useEffect(() => {
    const last7DaysKeys = getLast7DaysKeys()
    const oldLogsExist = logs.some(log => {
      const logDate = new Date(log.timestamp)
      const logKey = getDateKey(logDate)
      return !last7DaysKeys.includes(logKey)
    })

    if (oldLogsExist) {
      const filteredLogs = logs.filter(log => {
        const logDate = new Date(log.timestamp)
        const logKey = getDateKey(logDate)
        return last7DaysKeys.includes(logKey)
      })
      setFoodLogs(filteredLogs)
    }
  }, [])

  const switchMode = (targetMode: AppMode) => {
    setAppMode(targetMode)
    if (targetMode === 'nutriwell') {
      setCurrentPage('food-budget')
    } else if (targetMode === 'sleepsync') {
      setCurrentPage('sleepsync')
    } else if (targetMode === 'lifeflow') {
      setCurrentPage('lifeflow')
    }
  }

  const handleOnboardingComplete = (profile: UserOnboardingProfile) => {
    setOnboardingProfile(profile)
    setAppMode(profile.startingMode)
    if (profile.startingMode === 'nutriwell') {
      setCurrentPage('food-budget')
      setTutorialProgress({ mode: 'nutriwell', currentStep: 0, completed: false, skipped: false })
      setShowTutorial(true)
    } else if (profile.startingMode === 'sleepsync') {
      setCurrentPage('sleepsync')
    } else if (profile.startingMode === 'lifeflow') {
      setCurrentPage('lifeflow')
    }
  }

  const handleTutorialNext = () => {
    if (!tutorialProgress) return
    const steps = getTutorialSteps(tutorialProgress.mode)
    if (tutorialProgress.currentStep < steps.length - 1) {
      setTutorialProgress({
        ...tutorialProgress,
        currentStep: tutorialProgress.currentStep + 1,
      })
    } else {
      setTutorialProgress({
        ...tutorialProgress,
        completed: true,
      })
      setShowTutorial(false)
    }
  }

  const handleTutorialPrevious = () => {
    if (!tutorialProgress) return
    if (tutorialProgress.currentStep > 0) {
      setTutorialProgress({
        ...tutorialProgress,
        currentStep: tutorialProgress.currentStep - 1,
      })
    }
  }

  const handleTutorialSkip = () => {
    if (!tutorialProgress) return
    setTutorialProgress({
      ...tutorialProgress,
      skipped: true,
    })
    setShowTutorial(false)
  }

  const handleTutorialClose = () => {
    setShowTutorial(false)
  }

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error('Failed to sign out')
    } else {
      toast.success('Signed out successfully')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Leaf className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  if (!onboardingProfile) {
    return <WelcomeFlow onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileReminder />
      <ProfilePopupManager mode={mode} />
      
      {showTutorial && tutorialProgress && (
        <TutorialOverlay
          step={getTutorialSteps(tutorialProgress.mode)[tutorialProgress.currentStep]}
          currentStepNum={tutorialProgress.currentStep}
          totalSteps={getTutorialSteps(tutorialProgress.mode).length}
          onNext={handleTutorialNext}
          onPrevious={handleTutorialPrevious}
          onSkip={handleTutorialSkip}
          onClose={handleTutorialClose}
        />
      )}
      
      <DisclaimerBanner />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-10">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              {mode === 'nutriwell' ? (
                <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl shadow-sm border border-primary/20">
                  <Leaf className="w-10 h-10 text-primary" weight="fill" />
                </div>
              ) : mode === 'sleepsync' ? (
                <div className="p-3 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl shadow-sm border border-secondary/20">
                  <Moon className="w-10 h-10 text-secondary" weight="fill" />
                </div>
              ) : (
                <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl shadow-sm border border-accent/20">
                  <CalendarBlank className="w-10 h-10 text-accent" weight="fill" />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold text-foreground tracking-tight">
                  {mode === 'nutriwell' ? 'NutriWell' : mode === 'sleepsync' ? 'SleepSync' : 'LifeFlow'}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5 font-medium">
                  {mode === 'nutriwell' 
                    ? 'Smart nutrition intelligence'
                    : mode === 'sleepsync'
                    ? 'Sleep-optimized meal timing'
                    : 'Time-blocked scheduling'
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center flex-wrap justify-end">
              {mode !== 'nutriwell' && (
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => switchMode('nutriwell')}
                  className="flex items-center gap-2 font-semibold shadow-sm hover:shadow-md transition-all"
                >
                  <Leaf className="w-4 h-4" weight="fill" />
                  NutriWell
                </Button>
              )}
              {mode !== 'sleepsync' && (
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => switchMode('sleepsync')}
                  className="flex items-center gap-2 font-semibold shadow-sm hover:shadow-md transition-all"
                >
                  <Moon className="w-4 h-4" weight="fill" />
                  SleepSync
                </Button>
              )}
              {mode !== 'lifeflow' && (
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => switchMode('lifeflow')}
                  className="flex items-center gap-2 font-semibold shadow-sm hover:shadow-md transition-all"
                >
                  <CalendarBlank className="w-4 h-4" weight="fill" />
                  LifeFlow
                </Button>
              )}
              <Button
                variant="ghost"
                size="default"
                onClick={handleSignOut}
                className="flex items-center gap-2 hover:bg-muted/80 transition-all"
                title="Sign Out"
              >
                <SignOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {mode === 'nutriwell' ? (
          <>
            <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

            <main className="mt-8">
              {currentPage === 'food-budget' && (
                <FoodBudget foodLogs={logs} />
              )}
              {currentPage === 'log-food' && (
                <LogFood 
                  foodLogs={logs} 
                  setFoodLogs={setFoodLogs}
                  onNavigate={setCurrentPage}
                />
              )}
              {currentPage === 'meal-planner' && (
                <MealPlanner 
                  foodLogs={logs} 
                  setFoodLogs={setFoodLogs}
                  onNavigate={setCurrentPage}
                />
              )}
              {currentPage === 'recommendations' && (
                <Recommendations foodLogs={logs} />
              )}
              {currentPage === 'education' && (
                <Education />
              )}
              {currentPage === 'achievements' && (
                <Achievements foodLogs={logs} />
              )}
              {currentPage === 'settings' && (
                <Settings />
              )}
            </main>
          </>
        ) : mode === 'sleepsync' ? (
          <main className="mt-8">
            <SleepSync foodLogs={logs} />
          </main>
        ) : (
          <main className="mt-8">
            <LifeFlow foodLogs={logs} />
          </main>
        )}
      </div>

      <Toaster />
    </div>
  )
}

export default App
