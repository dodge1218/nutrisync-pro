import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from './components/ui/sonner'
import { Button } from './components/ui/button'
import Dashboard from './components/pages/Dashboard'
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
import { Moon, Leaf, CalendarBlank } from '@phosphor-icons/react'
import type { FoodLog } from './lib/nutritionEngine'

export type Page = 'dashboard' | 'log-food' | 'meal-planner' | 'food-budget' | 'recommendations' | 'education' | 'achievements' | 'settings' | 'sleepsync' | 'lifeflow'
export type AppMode = 'nutriwell' | 'sleepsync' | 'lifeflow'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [appMode, setAppMode] = useKV<AppMode>('app-mode', 'nutriwell')
  const [foodLogs, setFoodLogs] = useKV<FoodLog[]>('food-logs', [])

  const logs = foodLogs || []
  const mode = appMode || 'nutriwell'

  const switchMode = (targetMode: AppMode) => {
    setAppMode(targetMode)
    if (targetMode === 'nutriwell') {
      setCurrentPage('dashboard')
    } else if (targetMode === 'sleepsync') {
      setCurrentPage('sleepsync')
    } else if (targetMode === 'lifeflow') {
      setCurrentPage('lifeflow')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DisclaimerBanner />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                {mode === 'nutriwell' ? (
                  <>
                    <Leaf className="w-10 h-10 text-primary" />
                    NutriWell
                  </>
                ) : mode === 'sleepsync' ? (
                  <>
                    <Moon className="w-10 h-10 text-primary" />
                    SleepSync
                  </>
                ) : (
                  <>
                    <CalendarBlank className="w-10 h-10 text-primary" />
                    LifeFlow
                  </>
                )}
              </h1>
              <p className="text-muted-foreground">
                {mode === 'nutriwell' 
                  ? 'Smart nutrition intelligence for optimal health'
                  : mode === 'sleepsync'
                  ? 'Sleep-optimized meal timing for better rest'
                  : 'Time-blocked scheduling for your goals'
                }
              </p>
            </div>
            <div className="flex gap-2">
              {mode !== 'nutriwell' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchMode('nutriwell')}
                  className="flex items-center gap-2"
                >
                  <Leaf className="w-4 h-4" />
                  NutriWell
                </Button>
              )}
              {mode !== 'sleepsync' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchMode('sleepsync')}
                  className="flex items-center gap-2"
                >
                  <Moon className="w-4 h-4" />
                  SleepSync
                </Button>
              )}
              {mode !== 'lifeflow' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchMode('lifeflow')}
                  className="flex items-center gap-2"
                >
                  <CalendarBlank className="w-4 h-4" />
                  LifeFlow
                </Button>
              )}
            </div>
          </div>
        </header>

        {mode === 'nutriwell' ? (
          <>
            <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

            <main className="mt-8">
              {currentPage === 'dashboard' && (
                <Dashboard foodLogs={logs} />
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
              {currentPage === 'food-budget' && (
                <FoodBudget foodLogs={logs} />
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
