import { Button } from './ui/button'
import { House, Notepad, Lightbulb, Book, Trophy, Gear } from '@phosphor-icons/react'
import type { Page } from '../App'

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
    { page: 'dashboard', label: 'Dashboard', icon: <House weight="fill" /> },
    { page: 'log-food', label: 'Log Food', icon: <Notepad weight="fill" /> },
    { page: 'recommendations', label: 'Insights', icon: <Lightbulb weight="fill" /> },
    { page: 'education', label: 'Learn', icon: <Book weight="fill" /> },
    { page: 'achievements', label: 'Achievements', icon: <Trophy weight="fill" /> },
    { page: 'settings', label: 'Settings', icon: <Gear weight="fill" /> },
  ]

  return (
    <nav className="flex gap-2 flex-wrap">
      {navItems.map(item => (
        <Button
          key={item.page}
          variant={currentPage === item.page ? 'default' : 'outline'}
          onClick={() => onNavigate(item.page)}
          className="gap-2"
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
    </nav>
  )
}
