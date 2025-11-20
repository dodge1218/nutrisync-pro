import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from './components/ui/sonner'
import Dashboard from './components/pages/Dashboard'
import LogFood from './components/pages/LogFood'
import Recommendations from './components/pages/Recommendations'
import Education from './components/pages/Education'
import Settings from './components/pages/Settings'
import Achievements from './components/pages/Achievements'
import DisclaimerBanner from './components/DisclaimerBanner'
import Navigation from './components/Navigation'
import type { FoodLog } from './lib/nutritionEngine'

export type Page = 'dashboard' | 'log-food' | 'recommendations' | 'education' | 'achievements' | 'settings'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [foodLogs, setFoodLogs] = useKV<FoodLog[]>('food-logs', [])

  const logs = foodLogs || []

  return (
    <div className="min-h-screen bg-background">
      <DisclaimerBanner />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            NutriWell
          </h1>
          <p className="text-muted-foreground">
            Smart nutrition intelligence for optimal health
          </p>
        </header>

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
      </div>

      <Toaster />
    </div>
  )
}

export default App
