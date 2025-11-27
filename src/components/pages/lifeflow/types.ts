export interface RecurringActivity {
  id: string
  name: string
  category: 'work' | 'exercise' | 'hygiene' | 'cooking' | 'pet-care' | 'meal' | 'custom' | 'learning' | 'social' | 'rest'
  startTime: string
  duration: number
  days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[]
  color?: string
}

export interface Goal {
  id: string
  title: string
  description: string
  targetDate: string
  milestones: GoalMilestone[]
  status: 'active' | 'completed' | 'paused'
  createdAt: string
  category?: string
  color?: string
  estimatedTimePerDay?: number // in minutes
  priority?: 'high' | 'medium' | 'low'
}

export interface Ambition {
  id: string
  title: string
  type: 'achievement' | 'habit' | 'creation' | 'learning'
  description: string
  deadline?: string
  color?: string
  status: 'active' | 'completed' | 'someday'
}

export interface GoalMilestone {
  id: string
  title: string
  type: 'checkbox' | 'numeric' | 'frequency' | 'habit'
  completed: boolean
  completedAt?: string
  target?: number
  unit?: string
  currentProgress?: number
  progressHistory?: Array<{ date: string; value: number }>
}

export interface DaySchedule {
  date: string
  activities: ScheduledActivity[]
}

export interface ScheduledActivity {
  id: string
  name: string
  startTime: string
  endTime: string
  category: string
  isCompleted: boolean
  isRecurring: boolean
  recurringId?: string
  mealTemplateId?: string
  isCookingActivity?: boolean
  studyModuleId?: string
}

export interface StudyModule {
  id: string
  title: string
  description: string
  estimatedMinutes: number
  status: 'pending' | 'scheduled' | 'completed'
}

export interface StudyPlan {
  id: string
  title: string
  type: 'rabbit-hole' | 'serious-learning'
  modules: StudyModule[]
  createdAt: string
  syllabusContent?: string
}
