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
    <nav className="flex gap-2 flex-wrap bg-card p-3 rounded-xl border border-border">
      {navItems.map(item => (
        <Button
          key={item.page}
          variant={currentPage === item.page ? 'default' : 'ghost'}
          onClick={() => onNavigate(item.page)}
          size="default"
          className={`gap-2 text-sm font-medium px-4 h-10 rounded-lg transition-all ${
            currentPage === item.page 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="hidden sm:inline">{item.label}</span>
        </Button>
      ))}
    </nav>
  )
}
