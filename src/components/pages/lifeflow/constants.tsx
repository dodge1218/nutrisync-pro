import { 
  BriefcaseMetal, 
  Barbell, 
  Shower, 
  CookingPot, 
  Dog, 
  Coffee, 
  Circle,
  BookOpen,
  Users,
  MoonStars
} from '@phosphor-icons/react'

export const activityIcons: Record<string, React.ReactNode> = {
  work: <BriefcaseMetal className="w-4 h-4" />,
  exercise: <Barbell className="w-4 h-4" />,
  hygiene: <Shower className="w-4 h-4" />,
  cooking: <CookingPot className="w-4 h-4" />,
  'pet-care': <Dog className="w-4 h-4" />,
  meal: <Coffee className="w-4 h-4" />,
  learning: <BookOpen className="w-4 h-4" />,
  social: <Users className="w-4 h-4" />,
  rest: <MoonStars className="w-4 h-4" />,
  custom: <Circle className="w-4 h-4" />
}

export const categoryColors: Record<string, string> = {
  work: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
  exercise: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
  hygiene: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
  cooking: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
  'pet-care': 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800',
  meal: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
  learning: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800',
  social: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800',
  rest: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700',
  custom: 'bg-secondary text-secondary-foreground border-border'
}
