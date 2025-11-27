import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Badge } from '../../ui/badge'
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs'
import { 
  ListChecks, 
  Sparkle, 
  Plus, 
  Trash 
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import AutoTaskSettings from '../../AutoTaskSettings'
import SmartRoutineBuilder from '../../SmartRoutineBuilder'
import { getDefaultAutoTaskConfig, type AutoTask, type AutoTaskConfig } from '../../../lib/autoTaskEngine'
import { RecurringActivity } from './types'
import { categoryColors, activityIcons } from './constants'

interface LifeFlowActivitiesTabProps {
  autoTaskConfig: AutoTaskConfig
  autoTasks: AutoTask[]
  setAutoTaskConfig: (config: AutoTaskConfig) => void
  toggleAutoTaskEnabled: (tasks: AutoTask[], taskId: string) => AutoTask[]
  setAutoTasks: (tasks: AutoTask[]) => void
  recurringActivities: RecurringActivity[]
  setRecurringActivities: (activities: RecurringActivity[]) => void
}

export default function LifeFlowActivitiesTab({
  autoTaskConfig,
  autoTasks,
  setAutoTaskConfig,
  toggleAutoTaskEnabled,
  setAutoTasks,
  recurringActivities,
  setRecurringActivities
}: LifeFlowActivitiesTabProps) {
  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [isSmartBuilderOpen, setIsSmartBuilderOpen] = useState(false)
  const [durationUnit, setDurationUnit] = useState<'minutes' | 'hours'>('minutes')
  
  const [newActivity, setNewActivity] = useState<Partial<RecurringActivity>>({
    name: '',
    category: 'custom',
    startTime: '09:00',
    duration: 60,
    days: ['mon', 'tue', 'wed', 'thu', 'fri']
  })

  const handleAddActivity = () => {
    if (!newActivity.name || !newActivity.startTime) return

    const activity: RecurringActivity = {
      id: Date.now().toString(),
      name: newActivity.name,
      category: newActivity.category || 'custom',
      startTime: newActivity.startTime,
      duration: newActivity.duration || 60,
      days: newActivity.days || ['mon', 'tue', 'wed', 'thu', 'fri']
    }

    setRecurringActivities([...(recurringActivities || []), activity])
    setIsAddingActivity(false)
    setNewActivity({
      name: '',
      category: 'custom',
      startTime: '09:00',
      duration: 60,
      days: ['mon', 'tue', 'wed', 'thu', 'fri']
    })
  }

  const handleSmartAddActivities = (activities: RecurringActivity[]) => {
    setRecurringActivities([...(recurringActivities || []), ...activities])
    setIsSmartBuilderOpen(false)
    toast.success(`Added ${activities.length} activities to your routine`)
  }

  const handleRemoveActivity = (id: string) => {
    setRecurringActivities((recurringActivities || []).filter(a => a.id !== id))
  }

  return (
    <div className="space-y-6 mt-6">
      <AutoTaskSettings
        config={autoTaskConfig || getDefaultAutoTaskConfig()}
        autoTasks={autoTasks || []}
        onConfigChange={(newConfig) => setAutoTaskConfig(newConfig)}
        onTaskToggle={(taskId) => {
          if (autoTasks) {
            setAutoTasks(toggleAutoTaskEnabled(autoTasks || [], taskId))
          }
        }}
      />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-2">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-sky-500" weight="duotone" />
            </div>
            Recurring Activities
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Activities that repeat on specific days</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            onClick={() => setIsSmartBuilderOpen(true)} 
            variant="outline"
            className="flex-1 sm:flex-none border-sky-500/30 hover:bg-sky-500/5 text-sky-600 dark:text-sky-400"
          >
            <Sparkle className="w-4 h-4 mr-2" weight="fill" />
            AI Builder
          </Button>
          <Button onClick={() => setIsAddingActivity(true)} className="flex-1 sm:flex-none bg-sky-500 hover:bg-sky-600 text-white shadow-md">
            <Plus className="w-4 h-4 mr-2" weight="bold" />
            Add Activity
          </Button>
        </div>
      </div>

      {isSmartBuilderOpen && (
        <div className="mb-6">
          <SmartRoutineBuilder 
            onAddActivities={handleSmartAddActivities}
            onClose={() => setIsSmartBuilderOpen(false)}
          />
        </div>
      )}

      {isAddingActivity && (
        <Card className="border-sky-500/30 shadow-md">
          <CardHeader className="bg-gradient-to-r from-sky-500/5 to-background border-b border-border/50">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-sky-500" weight="duotone" />
              New Recurring Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2">
              <Label htmlFor="activity-name">Activity Name</Label>
              <Input
                id="activity-name"
                placeholder="e.g., Walk the dog, Go to work, Morning workout"
                value={newActivity.name}
                onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activity-category">Category</Label>
                <select
                  id="activity-category"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  value={newActivity.category}
                  onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value as any })}
                >
                  <option value="work">Work</option>
                  <option value="exercise">Exercise</option>
                  <option value="hygiene">Hygiene</option>
                  <option value="cooking">Cooking</option>
                  <option value="pet-care">Pet Care</option>
                  <option value="meal">Meal</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-start">Start Time</Label>
                <Input
                  id="activity-start"
                  type="time"
                  value={newActivity.startTime}
                  onChange={(e) => setNewActivity({ ...newActivity, startTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="activity-duration">Duration</Label>
                <Tabs value={durationUnit} onValueChange={(v) => setDurationUnit(v as any)} className="w-auto">
                  <TabsList className="h-8">
                    <TabsTrigger value="minutes" className="text-xs px-3 h-7">Minutes</TabsTrigger>
                    <TabsTrigger value="hours" className="text-xs px-3 h-7">Hours</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <Input
                id="activity-duration"
                type="number"
                min={durationUnit === 'minutes' ? "5" : "0.25"}
                step={durationUnit === 'minutes' ? "5" : "0.25"}
                value={durationUnit === 'minutes' ? newActivity.duration : (newActivity.duration || 60) / 60}
                onChange={(e) => {
                  const val = parseFloat(e.target.value)
                  const minutes = durationUnit === 'minutes' ? val : val * 60
                  setNewActivity({ ...newActivity, duration: minutes })
                }}
              />
              <p className="text-xs text-muted-foreground">
                {durationUnit === 'minutes' 
                  ? `${newActivity.duration || 60} minutes (${((newActivity.duration || 60) / 60).toFixed(2)} hours)`
                  : `${((newActivity.duration || 60) / 60).toFixed(2)} hours (${newActivity.duration || 60} minutes)`
                }
              </p>
            </div>

            <div className="space-y-2">
              <Label>Repeat on</Label>
              <div className="flex gap-2">
                {[
                  { value: 'mon', label: 'Mon' },
                  { value: 'tue', label: 'Tue' },
                  { value: 'wed', label: 'Wed' },
                  { value: 'thu', label: 'Thu' },
                  { value: 'fri', label: 'Fri' },
                  { value: 'sat', label: 'Sat' },
                  { value: 'sun', label: 'Sun' }
                ].map(day => (
                  <Button
                    key={day.value}
                    type="button"
                    variant={(newActivity.days || []).includes(day.value as any) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      const current = newActivity.days || []
                      const updated = current.includes(day.value as any)
                        ? current.filter(d => d !== day.value)
                        : [...current, day.value as any]
                      setNewActivity({ ...newActivity, days: updated })
                    }}
                    className={(newActivity.days || []).includes(day.value as any) ? 'bg-sky-500 hover:bg-sky-600 text-white' : ''}
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleAddActivity} className="flex-1 bg-sky-500 hover:bg-sky-600 text-white shadow-md" size="lg">
                <Plus className="w-4 h-4 mr-2" weight="bold" />
                Add Activity
              </Button>
              <Button variant="outline" onClick={() => setIsAddingActivity(false)} size="lg">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {(recurringActivities || []).map(activity => (
          <Card key={activity.id} className="hover:border-sky-500/40 transition-all shadow-sm hover:shadow-md border-border/50">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                  <Badge variant="outline" className={`${categoryColors[activity.category]} flex-shrink-0 px-2.5 py-1`}>
                    {activityIcons[activity.category]}
                    <span className="ml-1.5 font-medium">{activity.category}</span>
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate text-base">{activity.name}</p>
                    <p className="text-sm text-muted-foreground mt-1.5 font-medium">
                      {activity.startTime} • {activity.duration} min
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {activity.days.map(day => (
                        <Badge key={day} variant="secondary" className="text-xs font-semibold px-2">
                          {day.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveActivity(activity.id)}
                  className="self-end sm:self-auto hover:bg-destructive/10"
                >
                  <Trash className="w-5 h-5 text-destructive" weight="duotone" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!recurringActivities || recurringActivities.length === 0) && !isAddingActivity && (
          <Card className="border-border/50 shadow-sm">
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-sky-500/10 flex items-center justify-center mx-auto mb-6">
                <ListChecks className="w-10 h-10 text-sky-500" weight="duotone" />
              </div>
              <h3 className="text-xl font-bold mb-3">No recurring activities yet</h3>
              <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                Add activities that repeat weekly, like work hours, exercise routines, or daily tasks
              </p>
              <Button onClick={() => setIsAddingActivity(true)} size="lg" className="bg-sky-500 hover:bg-sky-600 text-white shadow-md">
                <Plus className="w-5 h-5 mr-2" weight="bold" />
                Add Your First Activity
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
