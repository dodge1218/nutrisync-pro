import { useState, useEffect, Suspense, lazy } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from './components/ui/sonner'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { LoadingSpinner } from './components/ui/loading'
import { LoginForm } from './components/auth/LoginForm'
import { useAuth } from './hooks/useAuth'
import { getLast7DaysKeys, getDateKey } from './lib/historyTracking'
import type { FoodLog } from './lib/nutritionEngine'
import type { UserOnboardingProfile, TutorialProgress } from './lib/onboardingEngine'
import { getTutorialSteps } from './lib/onboardingEngine'
import { Page, AppMode } from './types'

// Lazy load page components
const LogFood = lazy(() => import('./components/pages/LogFood'))
const Recommendations = lazy(() => import('./components/pages/Recommendations'))
const Education = lazy(() => import('./components/pages/Education'))
const Settings = lazy(() => import('./components/pages/Settings'))
const Achievements = lazy(() => import('./components/pages/Achievements'))
const MealPlanner = lazy(() => import('./components/pages/MealPlanner'))
const FoodBudget = lazy(() => import('./components/pages/FoodBudget'))
const SleepSync = lazy(() => import('./components/pages/SleepSync'))
const LifeFlow = lazy(() => import('./components/pages/LifeFlow'))
const DisclaimerBanner = lazy(() => import('./components/DisclaimerBanner'))
const WelcomeFlow = lazy(() => import('./components/WelcomeFlow'))
const TutorialOverlay = lazy(() => import('./components/TutorialOverlay'))
const ProfileReminder = lazy(() => import('./components/ProfileReminder'))
const ProfilePopupManager = lazy(() => import('./components/ProfilePopupManager'))

function App() {
  const { user, loading } = useAuth()
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

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <LoginForm />
  }

  if (!onboardingProfile) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <WelcomeFlow onComplete={handleOnboardingComplete} />
      </Suspense>
    )
  }

  return (
    <DashboardLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      currentMode={mode}
      onSwitchMode={switchMode}
    >
      <Suspense fallback={<LoadingSpinner />}>
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
        
        {mode === 'nutriwell' ? (
          <>
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
          </>
        ) : mode === 'sleepsync' ? (
          <SleepSync foodLogs={logs} />
        ) : (
          <LifeFlow foodLogs={logs} />
        )}
      </Suspense>

      <Toaster />
    </DashboardLayout>
  )
}

export default App
