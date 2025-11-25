import { AppMode } from '@/App'

export interface OnboardingStep {
  id: string
  title: string
  description: string
  targetElement?: string
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  action?: () => void
}

export interface TutorialProgress {
  mode: AppMode
  currentStep: number
  completed: boolean
  skipped: boolean
  completedAt?: number
}

export interface UserOnboardingProfile {
  age?: number
  dietaryPreference?: 'omnivore' | 'vegetarian' | 'vegan'
  goals: string[]
  disclaimerAccepted: boolean
  startingMode: AppMode
  completedAt: number
}

export const NUTRIWELL_TUTORIAL_STEPS: OnboardingStep[] = [
  {
    id: 'log-first-meal',
    title: 'Log your first meal',
    description: "Let's start by logging what you ate today. Try typing something like '2 eggs, 1 cup oatmeal, 1 banana'",
    targetElement: '#log-food-nav',
    placement: 'bottom',
  },
  {
    id: 'see-nutrient-breakdown',
    title: 'See your nutrient breakdown',
    description: 'Here are your nutrients for today. Color coding shows your gaps: red = needs attention, yellow = approaching, green = optimal',
    targetElement: '#nutrient-grid',
    placement: 'top',
  },
  {
    id: 'get-recommendations',
    title: 'Get personalized recommendations',
    description: 'We analyze your nutrient gaps and suggest foods that close multiple gaps efficiently. Food-first solutions!',
    targetElement: '#recommendations-nav',
    placement: 'bottom',
  },
]

export const SLEEPSYNC_TUTORIAL_STEPS: OnboardingStep[] = [
  {
    id: 'set-sleep-schedule',
    title: 'Set your sleep schedule',
    description: 'Tell us when you typically sleep and wake. This helps us optimize your meal timing for better sleep quality.',
    targetElement: '#sleep-schedule-input',
    placement: 'bottom',
  },
  {
    id: 'log-meals-with-times',
    title: 'Log meals with times',
    description: 'Add meal times to your food logs. We recommend finishing dinner 3-4 hours before sleep for optimal digestion.',
    targetElement: '#meal-time-input',
    placement: 'top',
  },
  {
    id: 'check-sleep-readiness',
    title: 'Check your sleep readiness',
    description: 'This timeline shows your meals relative to bedtime. Earlier dinners = better sleep quality!',
    targetElement: '#sleep-readiness-score',
    placement: 'top',
  },
]

export const LIFEFLOW_TUTORIAL_STEPS: OnboardingStep[] = [
  {
    id: 'add-recurring-activity',
    title: 'Add a recurring activity',
    description: "Let's add something you do regularly, like 'Work, 9am-5pm, Monday-Friday' or 'Morning walk, 7am, 30 minutes'",
    targetElement: '#add-activity-button',
    placement: 'bottom',
  },
  {
    id: 'generate-schedule',
    title: 'Generate your schedule',
    description: 'We auto-fill your meals from NutriWell and add your recurring activities. Your days are now time-blocked!',
    targetElement: '#schedule-view',
    placement: 'top',
  },
  {
    id: 'track-completion',
    title: 'Track completion',
    description: 'Check off activities as you complete them. Progress indicators show how your day is going.',
    targetElement: '#activity-checkbox',
    placement: 'left',
  },
  {
    id: 'set-goal',
    title: 'Set a goal',
    description: 'Break big goals into daily milestones. We suggest goal tasks during your free time blocks.',
    targetElement: '#goals-section',
    placement: 'top',
  },
]

export function getTutorialSteps(mode: AppMode): OnboardingStep[] {
  switch (mode) {
    case 'nutriwell':
      return NUTRIWELL_TUTORIAL_STEPS
    case 'sleepsync':
      return SLEEPSYNC_TUTORIAL_STEPS
    case 'lifeflow':
      return LIFEFLOW_TUTORIAL_STEPS
  }
}

export function getNextStep(
  mode: AppMode,
  currentStep: number
): OnboardingStep | null {
  const steps = getTutorialSteps(mode)
  if (currentStep >= steps.length - 1) return null
  return steps[currentStep + 1]
}

export function getPreviousStep(
  mode: AppMode,
  currentStep: number
): OnboardingStep | null {
  if (currentStep <= 0) return null
  const steps = getTutorialSteps(mode)
  return steps[currentStep - 1]
}

export const GOAL_OPTIONS = [
  'Better gut health',
  'More energy',
  'Nutrient optimization',
  'Better sleep',
  'Productivity & time management',
]

export interface DismissedTooltip {
  id: string
  dismissedAt: number
}

export const CONTEXTUAL_TOOLTIPS: Record<string, string> = {
  'first-meal-planner': 'Save common meals as templates to log them instantly later',
  'first-achievements': 'Log consistently to unlock badges and level up your wellness journey',
  'first-supplement': 'Track vitamins and minerals separately from food for complete nutrition tracking',
  'first-food-budget': 'View your nutrient intake over time like a financial budget',
  'first-gbdi-history': 'Track your gut health trends to see patterns and improvements',
  'first-stress-tracker': 'Regular stress logging helps us provide personalized recommendations',
}
