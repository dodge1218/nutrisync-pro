import { Button } from './ui/button'
import { Notepad, CalendarDots, ChartBar, Lightbulb, Book, Trophy, Gear } from '@phosphor-icons/react'
import type { Page } from '../App'

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
    { page: 'food-budget', label: 'Dashboard', icon: <ChartBar weight="fill" /> },
    { page: 'log-food', label: 'Log Food', icon: <Notepad weight="fill" /> },
    { page: 'meal-planner', label: 'Meal Planner', icon: <CalendarDots weight="fill" /> },
    { page: 'recommendations', label: 'Insights', icon: <Lightbulb weight="fill" /> },
    { page: 'education', label: 'Learn', icon: <Book weight="fill" /> },
    { page: 'achievements', label: 'Achievements', icon: <Trophy weight="fill" /> },
    { page: 'settings', label: 'Settings', icon: <Gear weight="fill" /> },
  ]

  return (
    <nav className="flex gap-3 flex-wrap">
      {navItems.map(item => (
        <Button
          key={item.page}
          variant={currentPage === item.page ? 'default' : 'outline'}
          onClick={() => onNavigate(item.page)}
          size="lg"
          className="gap-2.5 text-base font-semibold px-6 py-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <span className="text-lg">{item.icon}</span>
          {item.label}
        </Button>
      ))}
    </nav>
  )
}
