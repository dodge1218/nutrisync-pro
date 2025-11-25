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
      
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <header className="mb-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-5xl font-bold text-foreground mb-3 flex items-center gap-4">
                {mode === 'nutriwell' ? (
                  <>
                    <div className="p-3 bg-primary/10 rounded-2xl">
                      <Leaf className="w-12 h-12 text-primary" weight="fill" />
                    </div>
                    NutriWell
                  </>
                ) : mode === 'sleepsync' ? (
                  <>
                    <div className="p-3 bg-secondary/10 rounded-2xl">
                      <Moon className="w-12 h-12 text-secondary" weight="fill" />
                    </div>
                    SleepSync
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-accent/10 rounded-2xl">
                      <CalendarBlank className="w-12 h-12 text-accent" weight="fill" />
                    </div>
                    LifeFlow
                  </>
                )}
              </h1>
              <p className="text-lg text-muted-foreground ml-[88px]">
                {mode === 'nutriwell' 
                  ? 'Smart nutrition intelligence for optimal health'
                  : mode === 'sleepsync'
                  ? 'Sleep-optimized meal timing for better rest'
                  : 'Time-blocked scheduling for your goals'
                }
              </p>
            </div>
            <div className="flex gap-3 items-center flex-wrap justify-end">
              {mode !== 'nutriwell' && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => switchMode('nutriwell')}
                  className="flex items-center gap-2.5 font-semibold shadow-sm hover:shadow-md transition-shadow"
                >
                  <Leaf className="w-5 h-5" weight="fill" />
                  NutriWell
                </Button>
              )}
              {mode !== 'sleepsync' && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => switchMode('sleepsync')}
                  className="flex items-center gap-2.5 font-semibold shadow-sm hover:shadow-md transition-shadow"
                >
                  <Moon className="w-5 h-5" weight="fill" />
                  SleepSync
                </Button>
              )}
              {mode !== 'lifeflow' && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => switchMode('lifeflow')}
                  className="flex items-center gap-2.5 font-semibold shadow-sm hover:shadow-md transition-shadow"
                >
                  <CalendarBlank className="w-5 h-5" weight="fill" />
                  LifeFlow
                </Button>
              )}
              <Button
                variant="ghost"
                size="lg"
                onClick={handleSignOut}
                className="flex items-center gap-2"
                title="Sign Out"
              >
                <SignOut className="w-5 h-5" />
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
