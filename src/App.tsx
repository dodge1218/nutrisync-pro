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
import CircaFast from './components/pages/CircaFast'
import DisclaimerBanner from './components/DisclaimerBanner'
import Navigation from './components/Navigation'
import { Moon, Leaf } from '@phosphor-icons/react'
import type { FoodLog } from './lib/nutritionEngine'

export type Page = 'dashboard' | 'log-food' | 'meal-planner' | 'food-budget' | 'recommendations' | 'education' | 'achievements' | 'settings' | 'circafast'
export type AppMode = 'nutriwell' | 'circafast'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [appMode, setAppMode] = useKV<AppMode>('app-mode', 'nutriwell')
  const [foodLogs, setFoodLogs] = useKV<FoodLog[]>('food-logs', [])

  const logs = foodLogs || []
  const mode = appMode || 'nutriwell'

  const toggleMode = () => {
    const newMode = mode === 'nutriwell' ? 'circafast' : 'nutriwell'
    setAppMode(newMode)
    setCurrentPage(newMode === 'circafast' ? 'circafast' : 'dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      <DisclaimerBanner />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                {mode === 'nutriwell' ? (
                  <>
                    <Leaf className="w-10 h-10 text-primary" />
                    NutriWell
                  </>
                ) : (
                  <>
                    <Moon className="w-10 h-10 text-primary" />
                    CircaFast
                  </>
                )}
              </h1>
              <p className="text-muted-foreground">
                {mode === 'nutriwell' 
                  ? 'Smart nutrition intelligence for optimal health'
                  : 'Sleep-optimized meal timing for better rest'
                }
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={toggleMode}
              className="flex items-center gap-2"
            >
              {mode === 'nutriwell' ? (
                <>
                  <Moon className="w-5 h-5" />
                  Switch to CircaFast
                </>
              ) : (
                <>
                  <Leaf className="w-5 h-5" />
                  Switch to NutriWell
                </>
              )}
            </Button>
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
        ) : (
          <main className="mt-8">
            <CircaFast foodLogs={logs} />
          </main>
        )}
      </div>

      <Toaster />
    </div>
  )
}

export default App
