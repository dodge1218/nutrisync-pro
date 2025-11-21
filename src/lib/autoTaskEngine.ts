import { parseTimeString } from './circadianEngine'

export interface AutoTask {
  id: string
  name: string
  category: 'morning' | 'hygiene' | 'hydration' | 'evening' | 'pet-care' | 'household'
  defaultTime?: string
  duration: number
  frequency: 'daily' | 'custom'
  enabled: boolean
  customDays?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[]
  userDeleted: boolean
  deletionCount: number
  relativeToWake?: number
  relativeToSleep?: number
}

export interface AutoTaskConfig {
  enabled: boolean
  categories: {
    morning: boolean
    hygiene: boolean
    hydration: boolean
    evening: boolean
    petCare: boolean
    household: boolean
  }
}

const defaultAutoTasks: Omit<AutoTask, 'id' | 'userDeleted' | 'deletionCount'>[] = [
  {
    name: 'Morning stretch',
    category: 'morning',
    relativeToWake: 10,
    duration: 10,
    frequency: 'daily',
    enabled: true
  },
  {
    name: 'Drink 16oz water',
    category: 'morning',
    relativeToWake: 5,
    duration: 5,
    frequency: 'daily',
    enabled: true
  },
  {
    name: 'Morning sunlight',
    category: 'morning',
    relativeToWake: 20,
    duration: 10,
    frequency: 'daily',
    enabled: true
  },
  {
    name: 'Brush teeth',
    category: 'hygiene',
    relativeToWake: 15,
    duration: 5,
    frequency: 'daily',
    enabled: true
  },
  {
    name: 'Shower',
    category: 'hygiene',
    relativeToWake: 30,
    duration: 15,
    frequency: 'daily',
    enabled: true
  },
  {
    name: 'Floss teeth',
    category: 'hygiene',
    relativeToSleep: -60,
    duration: 3,
    frequency: 'daily',
    enabled: true
  },
  {
    name: 'Drink water (mid-morning)',
    category: 'hydration',
    relativeToWake: 180,
    duration: 2,
    frequency: 'daily',
    enabled: true
  },
  {
    name: 'Drink water (afternoon)',
    category: 'hydration',
    relativeToWake: 360,
    duration: 2,
    frequency: 'daily',
    enabled: true
  },
  {
    name: 'Drink water (evening)',
    category: 'hydration',
    relativeToSleep: -120,
    duration: 2,
    frequency: 'daily',
    enabled: true
  },
  {
    name: 'Evening skincare',
    category: 'evening',
    relativeToSleep: -45,
    duration: 10,
    frequency: 'daily',
    enabled: true
  },
  {
    name: 'Brush teeth (night)',
    category: 'evening',
    relativeToSleep: -30,
    duration: 5,
    frequency: 'daily',
    enabled: true
  },
  {
    name: 'Prep tomorrow',
    category: 'evening',
    relativeToSleep: -60,
    duration: 15,
    frequency: 'daily',
    enabled: true
  },
  {
    name: 'Walk dog',
    category: 'pet-care',
    relativeToWake: 60,
    duration: 20,
    frequency: 'daily',
    enabled: false,
    customDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  },
  {
    name: 'Feed pet',
    category: 'pet-care',
    relativeToWake: 40,
    duration: 5,
    frequency: 'daily',
    enabled: false,
    customDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  },
  {
    name: 'Make bed',
    category: 'household',
    relativeToWake: 45,
    duration: 5,
    frequency: 'daily',
    enabled: true
  },
  {
    name: 'Check email',
    category: 'household',
    relativeToWake: 90,
    duration: 15,
    frequency: 'custom',
    customDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    enabled: true
  },
  {
    name: 'Tidy kitchen',
    category: 'household',
    relativeToSleep: -90,
    duration: 10,
    frequency: 'daily',
    enabled: true
  }
]

export function initializeAutoTasks(): AutoTask[] {
  return defaultAutoTasks.map((task, index) => ({
    ...task,
    id: `auto-task-${index}`,
    userDeleted: false,
    deletionCount: 0
  }))
}

export function getDefaultAutoTaskConfig(): AutoTaskConfig {
  return {
    enabled: true,
    categories: {
      morning: true,
      hygiene: true,
      hydration: true,
      evening: true,
      petCare: false,
      household: true
    }
  }
}

export function calculateAutoTaskTime(
  task: AutoTask,
  wakeTime: string,
  sleepTime: string
): string | null {
  if (!task.enabled) return null

  const wakeMinutes = parseTimeString(wakeTime).totalMinutes
  const sleepMinutes = parseTimeString(sleepTime).totalMinutes

  let taskMinutes: number

  if (task.relativeToWake !== undefined) {
    taskMinutes = wakeMinutes + task.relativeToWake
  } else if (task.relativeToSleep !== undefined) {
    taskMinutes = sleepMinutes + task.relativeToSleep
  } else if (task.defaultTime) {
    taskMinutes = parseTimeString(task.defaultTime).totalMinutes
  } else {
    return null
  }

  if (taskMinutes < 0) {
    taskMinutes += 24 * 60
  } else if (taskMinutes >= 24 * 60) {
    taskMinutes = taskMinutes % (24 * 60)
  }

  const hour = Math.floor(taskMinutes / 60)
  const minute = taskMinutes % 60

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export function shouldGenerateAutoTask(
  task: AutoTask,
  config: AutoTaskConfig,
  dayOfWeek: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
): boolean {
  if (!config.enabled || !task.enabled) return false

  if (task.userDeleted && task.deletionCount >= 3) {
    return false
  }

  const categoryEnabled = {
    'morning': config.categories.morning,
    'hygiene': config.categories.hygiene,
    'hydration': config.categories.hydration,
    'evening': config.categories.evening,
    'pet-care': config.categories.petCare,
    'household': config.categories.household
  }[task.category]

  if (!categoryEnabled) return false

  if (task.frequency === 'daily') return true
  if (task.frequency === 'custom' && task.customDays) {
    return task.customDays.includes(dayOfWeek)
  }

  return false
}

export function markAutoTaskDeleted(
  tasks: AutoTask[],
  taskId: string
): AutoTask[] {
  return tasks.map(task => {
    if (task.id === taskId) {
      return {
        ...task,
        userDeleted: true,
        deletionCount: task.deletionCount + 1
      }
    }
    return task
  })
}

export function resetAutoTaskDeletion(
  tasks: AutoTask[],
  taskId: string
): AutoTask[] {
  return tasks.map(task => {
    if (task.id === taskId) {
      return {
        ...task,
        userDeleted: false
      }
    }
    return task
  })
}

export function toggleAutoTaskEnabled(
  tasks: AutoTask[],
  taskId: string
): AutoTask[] {
  return tasks.map(task => {
    if (task.id === taskId) {
      return {
        ...task,
        enabled: !task.enabled,
        userDeleted: false
      }
    }
    return task
  })
}

export function generateAutoTaskActivities(
  autoTasks: AutoTask[],
  config: AutoTaskConfig,
  wakeTime: string,
  sleepTime: string,
  dayOfWeek: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun',
  existingActivityNames: string[]
): Array<{
  name: string
  category: string
  startTime: string
  endTime: string
  isAutoTask: boolean
  autoTaskId: string
}> {
  const activities: Array<{
    name: string
    category: string
    startTime: string
    endTime: string
    isAutoTask: boolean
    autoTaskId: string
  }> = []

  for (const task of autoTasks) {
    if (!shouldGenerateAutoTask(task, config, dayOfWeek)) continue

    if (existingActivityNames.some(name => name.toLowerCase() === task.name.toLowerCase())) {
      continue
    }

    const startTime = calculateAutoTaskTime(task, wakeTime, sleepTime)
    if (!startTime) continue

    const startMinutes = parseTimeString(startTime).totalMinutes
    const endMinutes = startMinutes + task.duration
    const endHour = Math.floor(endMinutes / 60) % 24
    const endMin = endMinutes % 60
    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`

    activities.push({
      name: task.name,
      category: task.category,
      startTime,
      endTime,
      isAutoTask: true,
      autoTaskId: task.id
    })
  }

  activities.sort((a, b) => {
    return parseTimeString(a.startTime).totalMinutes - parseTimeString(b.startTime).totalMinutes
  })

  return activities
}
