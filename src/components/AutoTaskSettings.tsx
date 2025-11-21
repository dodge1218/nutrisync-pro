import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Badge } from './ui/badge'
import { Sparkle, Sun, Shower, Drop, Moon, Dog, HouseLine } from '@phosphor-icons/react'
import type { AutoTask, AutoTaskConfig } from '../lib/autoTaskEngine'

interface AutoTaskSettingsProps {
  config: AutoTaskConfig
  autoTasks: AutoTask[]
  onConfigChange: (config: AutoTaskConfig) => void
  onTaskToggle: (taskId: string) => void
}

const categoryIcons: Record<string, React.ReactNode> = {
  morning: <Sun className="w-4 h-4" />,
  hygiene: <Shower className="w-4 h-4" />,
  hydration: <Drop className="w-4 h-4" />,
  evening: <Moon className="w-4 h-4" />,
  'pet-care': <Dog className="w-4 h-4" />,
  household: <HouseLine className="w-4 h-4" />
}

export default function AutoTaskSettings({
  config,
  autoTasks,
  onConfigChange,
  onTaskToggle
}: AutoTaskSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const categoryCounts = autoTasks.reduce((acc, task) => {
    if (task.enabled && !task.userDeleted) {
      acc[task.category] = (acc[task.category] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const totalEnabledTasks = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0)

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkle className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Auto-Task Generation</CardTitle>
              <CardDescription>
                Automatically add daily routines to your schedule
              </CardDescription>
            </div>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(checked) => 
              onConfigChange({ ...config, enabled: checked })
            }
          />
        </div>
      </CardHeader>

      {config.enabled && (
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {totalEnabledTasks} auto-tasks will be added to your schedule
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Hide details' : 'Show details'}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Task Categories</Label>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-2">
                    {categoryIcons.morning}
                    <div>
                      <div className="text-sm font-medium">Morning Routine</div>
                      <div className="text-xs text-muted-foreground">
                        {categoryCounts.morning || 0} tasks
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={config.categories.morning}
                    onCheckedChange={(checked) =>
                      onConfigChange({
                        ...config,
                        categories: { ...config.categories, morning: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-2">
                    {categoryIcons.hygiene}
                    <div>
                      <div className="text-sm font-medium">Hygiene Tasks</div>
                      <div className="text-xs text-muted-foreground">
                        {categoryCounts.hygiene || 0} tasks
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={config.categories.hygiene}
                    onCheckedChange={(checked) =>
                      onConfigChange({
                        ...config,
                        categories: { ...config.categories, hygiene: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-2">
                    {categoryIcons.hydration}
                    <div>
                      <div className="text-sm font-medium">Hydration Reminders</div>
                      <div className="text-xs text-muted-foreground">
                        {categoryCounts.hydration || 0} tasks
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={config.categories.hydration}
                    onCheckedChange={(checked) =>
                      onConfigChange({
                        ...config,
                        categories: { ...config.categories, hydration: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-2">
                    {categoryIcons.evening}
                    <div>
                      <div className="text-sm font-medium">Evening Routine</div>
                      <div className="text-xs text-muted-foreground">
                        {categoryCounts.evening || 0} tasks
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={config.categories.evening}
                    onCheckedChange={(checked) =>
                      onConfigChange({
                        ...config,
                        categories: { ...config.categories, evening: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-2">
                    {categoryIcons['pet-care']}
                    <div>
                      <div className="text-sm font-medium">Pet Care</div>
                      <div className="text-xs text-muted-foreground">
                        {categoryCounts['pet-care'] || 0} tasks
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={config.categories.petCare}
                    onCheckedChange={(checked) =>
                      onConfigChange({
                        ...config,
                        categories: { ...config.categories, petCare: checked }
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-2">
                    {categoryIcons.household}
                    <div>
                      <div className="text-sm font-medium">Household Tasks</div>
                      <div className="text-xs text-muted-foreground">
                        {categoryCounts.household || 0} tasks
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={config.categories.household}
                    onCheckedChange={(checked) =>
                      onConfigChange({
                        ...config,
                        categories: { ...config.categories, household: checked }
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="space-y-3 pt-4 border-t">
                <Label className="text-sm font-medium">Individual Tasks</Label>
                <div className="space-y-2">
                  {autoTasks
                    .filter(task => !task.userDeleted || task.deletionCount < 3)
                    .map(task => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-2 rounded-lg border bg-card/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{task.name}</span>
                          {task.userDeleted && (
                            <Badge variant="secondary" className="text-xs">
                              Hidden after {task.deletionCount} removal{task.deletionCount > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        <Switch
                          checked={task.enabled}
                          onCheckedChange={() => onTaskToggle(task.id)}
                          disabled={task.deletionCount >= 3}
                        />
                      </div>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tasks removed from your schedule 3+ times will be permanently hidden
                </p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
