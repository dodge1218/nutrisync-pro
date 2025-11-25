import { Button } from './ui/button'
import { Notepad, CalendarDots, ChartBar, Lightbulb, Book, Trophy, Gear } from '@phosphor-icons/react'
import type { Page } from '../App'

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
    { page: 'food-budget', label: 'Dashboard', icon: <ChartBar weight="bold" /> },
    { page: 'log-food', label: 'Log Food', icon: <Notepad weight="bold" /> },
    { page: 'meal-planner', label: 'Meal Planner', icon: <CalendarDots weight="bold" /> },
    { page: 'recommendations', label: 'Insights', icon: <Lightbulb weight="bold" /> },
    { page: 'education', label: 'Learn', icon: <Book weight="bold" /> },
    { page: 'achievements', label: 'Achievements', icon: <Trophy weight="bold" /> },
    { page: 'settings', label: 'Settings', icon: <Gear weight="bold" /> },
  ]

  return (
    <nav className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-3xl blur-xl"></div>
      <div className="relative flex gap-3 flex-wrap bg-white/90 backdrop-blur-xl p-4 rounded-3xl border border-border/60 shadow-2xl shadow-primary/10">
        {navItems.map(item => (
          <Button
            key={item.page}
            variant={currentPage === item.page ? 'default' : 'ghost'}
            onClick={() => onNavigate(item.page)}
            size="lg"
            className={`gap-2.5 text-sm font-bold px-6 h-12 rounded-2xl transition-all duration-300 ${
              currentPage === item.page 
                ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-xl shadow-primary/40 scale-105' 
                : 'hover:bg-muted text-muted-foreground hover:text-foreground hover:scale-105 hover:shadow-lg'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="hidden sm:inline">{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  )
}
