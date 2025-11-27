import { useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { 
  ClockAfternoon,
  CheckCircle,
  Target,
  Barbell,
  ListChecks,
  Sun
} from '@phosphor-icons/react'
import { parseTimeString, type UserSleepPreferences } from '../../lib/circadianEngine'
import { 
  initializeAutoTasks, 
  getDefaultAutoTaskConfig, 
  type AutoTask,
  type AutoTaskConfig
} from '../../lib/autoTaskEngine'
import type { FoodLog } from '../../lib/nutritionEngine'
import type { MealTemplate } from '../../data/mealTemplates'
import ExerciseCreator from './ExerciseCreator'
import DailyCheckIn from '../DailyCheckIn'
import CheckInHistory from '../CheckInHistory'
import LifeFlowScheduleTab from './lifeflow/LifeFlowScheduleTab'
import LifeFlowActivitiesTab from './lifeflow/LifeFlowActivitiesTab'
import LifeFlowGoalsTab from './lifeflow/LifeFlowGoalsTab'
import { RecurringActivity, Goal, DaySchedule } from './lifeflow/types'

interface LifeFlowProps {
  foodLogs: FoodLog[]
}

export default function LifeFlow({ foodLogs }: LifeFlowProps) {
  const [sleepPreferences] = useKV<UserSleepPreferences>('sleep-preferences', {
    targetSleepTime: '22:00',
    targetWakeTime: '06:30',
    desiredDigestiveBuffer: 240
  })

  const [recurringActivities, setRecurringActivities] = useKV<RecurringActivity[]>('lifeflow-recurring', [])
  const [autoTasks, setAutoTasks] = useKV<AutoTask[]>('lifeflow-auto-tasks', initializeAutoTasks())
  const [autoTaskConfig, setAutoTaskConfig] = useKV<AutoTaskConfig>('lifeflow-auto-config', getDefaultAutoTaskConfig())
  const [schedules, setSchedules] = useKV<DaySchedule[]>('lifeflow-schedules', [])
  const [goals, setGoals] = useKV<Goal[]>('lifeflow-goals', [])
  const [mealTemplates] = useKV<MealTemplate[]>('meal-templates', [])
  const [cookHistory] = useKV<{ templateId: string; actualMinutes: number; timestamp: string }[]>('cook-history', [])

  const awakeWindow = useMemo(() => {
    if (!sleepPreferences) return { start: '06:30', end: '22:00', duration: 15.5 }
    
    const wakeMinutes = parseTimeString(sleepPreferences.targetWakeTime).totalMinutes
    const sleepMinutes = parseTimeString(sleepPreferences.targetSleepTime).totalMinutes
    
    let duration = sleepMinutes - wakeMinutes
    if (duration < 0) duration += 24 * 60
    
    return {
      start: sleepPreferences.targetWakeTime,
      end: sleepPreferences.targetSleepTime,
      duration: duration / 60
    }
  }, [sleepPreferences])

  const activeGoals = (goals || []).filter(g => g.status === 'active')

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
            LifeFlow
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Time-blocked scheduling powered by your food and sleep patterns
          </p>
        </div>
      </div>

      <Card className="border-sky-500/20 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-background shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
              <Sun className="w-5 h-5 text-sky-500" weight="duotone" />
            </div>
            Your Awake Window
          </CardTitle>
          <CardDescription>
            Based on your sleep schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <div className="text-center p-4 rounded-xl bg-card shadow-sm border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-2">Wake Time</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{awakeWindow.start}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-md border-2 border-sky-400/30">
              <p className="text-xs font-medium text-white/90 mb-2">Available Hours</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{Math.round(awakeWindow.duration * 10) / 10}h</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-card shadow-sm border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-2">Sleep Time</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{awakeWindow.end}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto bg-card/50 p-1 gap-1">
          <TabsTrigger value="schedule" className="flex-col md:flex-row gap-1 py-3 data-[state=active]:bg-sky-500/10 data-[state=active]:text-sky-500">
            <ClockAfternoon className="w-4 h-4" weight="duotone" />
            <span className="text-xs md:text-sm">Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="checkin" className="flex-col md:flex-row gap-1 py-3 data-[state=active]:bg-sky-500/10 data-[state=active]:text-sky-500">
            <CheckCircle className="w-4 h-4" weight="duotone" />
            <span className="text-xs md:text-sm">Check-In</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex-col md:flex-row gap-1 py-3 data-[state=active]:bg-sky-500/10 data-[state=active]:text-sky-500">
            <ListChecks className="w-4 h-4" weight="duotone" />
            <span className="text-xs md:text-sm">Activities</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex-col md:flex-row gap-1 py-3 data-[state=active]:bg-sky-500/10 data-[state=active]:text-sky-500">
            <Target className="w-4 h-4" weight="duotone" />
            <span className="text-xs md:text-sm">Goals</span>
          </TabsTrigger>
          <TabsTrigger value="exercise" className="flex-col md:flex-row gap-1 py-3 data-[state=active]:bg-sky-500/10 data-[state=active]:text-sky-500">
            <Barbell className="w-4 h-4" weight="duotone" />
            <span className="text-xs md:text-sm">Exercise</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <LifeFlowScheduleTab
            schedules={schedules || []}
            setSchedules={setSchedules}
            recurringActivities={recurringActivities || []}
            autoTasks={autoTasks || []}
            autoTaskConfig={autoTaskConfig || getDefaultAutoTaskConfig()}
            sleepPreferences={sleepPreferences || { targetSleepTime: '22:00', targetWakeTime: '06:30', desiredDigestiveBuffer: 240 }}
            mealTemplates={mealTemplates || []}
            cookHistory={cookHistory || []}
            foodLogs={foodLogs}
          />
        </TabsContent>

        <TabsContent value="checkin" className="space-y-4 mt-6">
          <DailyCheckIn
            foodLogs={foodLogs}
            activeGoals={activeGoals}
            nutrientGaps={[]}
            recentStress={undefined}
          />
          <CheckInHistory />
        </TabsContent>

        <TabsContent value="activities">
          <LifeFlowActivitiesTab
            recurringActivities={recurringActivities || []}
            setRecurringActivities={setRecurringActivities}
            autoTasks={autoTasks || []}
            setAutoTasks={setAutoTasks}
            autoTaskConfig={autoTaskConfig || getDefaultAutoTaskConfig()}
            setAutoTaskConfig={setAutoTaskConfig}
          />
        </TabsContent>

        <TabsContent value="goals">
          <LifeFlowGoalsTab
            goals={goals || []}
            setGoals={setGoals}
            recurringActivities={recurringActivities || []}
          />
        </TabsContent>

        <TabsContent value="exercise" className="space-y-4">
          <ExerciseCreator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
