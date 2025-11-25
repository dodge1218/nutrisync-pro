import { Button } from './ui/button'
import { Notepad, CalendarDots, ChartBar, Lightbulb, Book, Trophy, Gear } from '@phosphor-icons/react'
import type { Page } from '../App'

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
    { page: 'food-budget', label: 'Dashboard', icon: <ChartBar weight="duotone" /> },
    { page: 'log-food', label: 'Log Food', icon: <Notepad weight="duotone" /> },
    { page: 'meal-planner', label: 'Meal Planner', icon: <CalendarDots weight="duotone" /> },
    { page: 'recommendations', label: 'Insights', icon: <Lightbulb weight="duotone" /> },
    { page: 'education', label: 'Learn', icon: <Book weight="duotone" /> },
    { page: 'achievements', label: 'Achievements', icon: <Trophy weight="duotone" /> },
    { page: 'settings', label: 'Settings', icon: <Gear weight="duotone" /> },
  ]

  return (
    <nav className="flex gap-2.5 flex-wrap bg-card/40 backdrop-blur-sm p-3 rounded-xl border border-border/50">
      {navItems.map(item => (
        <Button
          key={item.page}
          variant={currentPage === item.page ? 'default' : 'ghost'}
          onClick={() => onNavigate(item.page)}
          size="default"
          className={`gap-2.5 text-sm font-semibold px-5 h-10 rounded-lg transition-all duration-200 ${
            currentPage === item.page 
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' 
              : 'hover:bg-muted/80 text-foreground/80 hover:text-foreground'
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          {item.label}
        </Button>
      ))}
    </nav>
  )
}
