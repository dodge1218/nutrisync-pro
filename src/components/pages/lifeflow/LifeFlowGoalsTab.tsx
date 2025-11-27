import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Progress } from '../../ui/progress'
import { 
  Target, 
  Plus, 
  CheckCircle, 
  Circle,
  Trophy,
  RocketLaunch,
  BookOpen,
  Barbell
} from '@phosphor-icons/react'
import { Goal, GoalMilestone, RecurringActivity, Ambition } from './types'
import LifeGrid from './LifeGrid'
import { useKV } from '@github/spark/hooks'

interface LifeFlowGoalsTabProps {
  goals: Goal[]
  setGoals: (goals: Goal[]) => void
  recurringActivities: RecurringActivity[]
}

export default function LifeFlowGoalsTab({
  goals,
  setGoals,
  recurringActivities
}: LifeFlowGoalsTabProps) {
  const [ambitions, setAmbitions] = useKV<Ambition[]>('lifeflow-ambitions', [])
  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [isAddingAmbition, setIsAddingAmbition] = useState(false)
  
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: '',
    description: '',
    targetDate: '',
    milestones: [],
    estimatedTimePerDay: 0,
    category: 'learning'
  })
  const [newMilestone, setNewMilestone] = useState('')

  const [newAmbition, setNewAmbition] = useState<Partial<Ambition>>({
    title: '',
    description: '',
    type: 'achievement'
  })

  const activeGoals = (goals || []).filter(g => g.status === 'active')
  const activeAmbitions = (ambitions || []).filter(a => a.status === 'active')

  const handleAddAmbition = () => {
    if (!newAmbition.title) return
    
    const ambition: Ambition = {
      id: Date.now().toString(),
      title: newAmbition.title,
      description: newAmbition.description || '',
      type: newAmbition.type || 'achievement',
      status: 'active'
    }

    setAmbitions([...(ambitions || []), ambition])
    setIsAddingAmbition(false)
    setNewAmbition({ title: '', description: '', type: 'achievement' })
  }

  const handleAddGoal = () => {
    if (!newGoal.title) return

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description || '',
      targetDate: newGoal.targetDate || '',
      milestones: newGoal.milestones || [],
      status: 'active',
      createdAt: new Date().toISOString(),
      estimatedTimePerDay: newGoal.estimatedTimePerDay || 0,
      category: newGoal.category || 'learning'
    }

    setGoals([...(goals || []), goal])
    setIsAddingGoal(false)
    setNewGoal({
      title: '',
      description: '',
      targetDate: '',
      milestones: [],
      estimatedTimePerDay: 0,
      category: 'learning'
    })
  }

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(
      (goals || []).map(goal => {
        if (goal.id === goalId) {
          return {
            ...goal,
            milestones: goal.milestones.map(m => 
              m.id === milestoneId 
                ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : undefined }
                : m
            )
          }
        }
        return goal
      })
    )
  }

  return (
    <div className="space-y-8 mt-6">
      {/* Life Grid Visualization */}
      <LifeGrid recurringActivities={recurringActivities} goals={activeGoals} />

      {/* Ambitions Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-purple-500" weight="duotone" />
              </div>
              Ambitions
            </h3>
            <p className="text-sm text-muted-foreground mt-1">High-level aspirations and long-term dreams</p>
          </div>
          <Button onClick={() => setIsAddingAmbition(true)} variant="outline" className="w-full sm:w-auto border-purple-500/30 text-purple-600 hover:bg-purple-500/5">
            <Plus className="w-4 h-4 mr-2" weight="bold" />
            Add Ambition
          </Button>
        </div>

        {isAddingAmbition && (
          <Card className="border-purple-500/30 shadow-md">
            <CardHeader className="bg-gradient-to-r from-purple-500/5 to-background border-b border-border/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-500" weight="duotone" />
                New Ambition
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <Label>Ambition Title</Label>
                <Input 
                  placeholder="e.g., Become a published author, Run a marathon"
                  value={newAmbition.title}
                  onChange={(e) => setNewAmbition({...newAmbition, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <div className="flex gap-2">
                  {['achievement', 'habit', 'creation', 'learning'].map(type => (
                    <Button
                      key={type}
                      type="button"
                      variant={newAmbition.type === type ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setNewAmbition({...newAmbition, type: type as any})}
                      className={newAmbition.type === type ? 'bg-purple-500 hover:bg-purple-600 text-white' : ''}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleAddAmbition} className="flex-1 bg-purple-500 hover:bg-purple-600 text-white">Add Ambition</Button>
                <Button variant="outline" onClick={() => setIsAddingAmbition(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeAmbitions.map(ambition => (
            <Card key={ambition.id} className="hover:border-purple-500/40 transition-all shadow-sm hover:shadow-md border-border/50 bg-gradient-to-br from-background to-purple-500/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    {ambition.type === 'achievement' && <Trophy className="w-5 h-5 text-purple-500" weight="duotone" />}
                    {ambition.type === 'habit' && <RocketLaunch className="w-5 h-5 text-purple-500" weight="duotone" />}
                    {ambition.type === 'learning' && <BookOpen className="w-5 h-5 text-purple-500" weight="duotone" />}
                    {ambition.type === 'creation' && <Target className="w-5 h-5 text-purple-500" weight="duotone" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground leading-tight">{ambition.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">{ambition.type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {activeAmbitions.length === 0 && !isAddingAmbition && (
            <div className="col-span-full text-center py-8 border border-dashed border-border rounded-xl">
              <p className="text-sm text-muted-foreground">No ambitions set yet. Dream big!</p>
            </div>
          )}
        </div>
      </div>

      {/* Goals Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-sky-500" weight="duotone" />
              </div>
              Active Goals
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Actionable steps to achieve your ambitions</p>
          </div>
          <Button onClick={() => setIsAddingGoal(true)} className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white shadow-md">
            <Plus className="w-4 h-4 mr-2" weight="bold" />
            Add Goal
          </Button>
        </div>

        {isAddingGoal && (
          <Card className="border-sky-500/30 shadow-md">
            <CardHeader className="bg-gradient-to-r from-sky-500/5 to-background border-b border-border/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-sky-500" weight="duotone" />
                New Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <Label htmlFor="goal-title">Goal Title</Label>
                <Input
                  id="goal-title"
                  placeholder="e.g., Run a 5K, Learn to cook, Read 12 books"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  >
                    <option value="learning">Learning</option>
                    <option value="work">Work</option>
                    <option value="exercise">Exercise</option>
                    <option value="creation">Creation</option>
                    <option value="health">Health</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Daily Time (min)</Label>
                  <Input 
                    type="number" 
                    placeholder="e.g. 30"
                    value={newGoal.estimatedTimePerDay}
                    onChange={(e) => setNewGoal({...newGoal, estimatedTimePerDay: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-description">Description</Label>
                <Input
                  id="goal-description"
                  placeholder="Why is this goal important to you?"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-target">Target Date</Label>
                <Input
                  id="goal-target"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Milestones</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a milestone..."
                    value={newMilestone}
                    onChange={(e) => setNewMilestone(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newMilestone) {
                        const milestone: GoalMilestone = {
                          id: Date.now().toString(),
                          title: newMilestone,
                          type: 'checkbox',
                          completed: false
                        }
                        setNewGoal({
                          ...newGoal,
                          milestones: [...(newGoal.milestones || []), milestone]
                        })
                        setNewMilestone('')
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      if (newMilestone) {
                        const milestone: GoalMilestone = {
                          id: Date.now().toString(),
                          title: newMilestone,
                          type: 'checkbox',
                          completed: false
                        }
                        setNewGoal({
                          ...newGoal,
                          milestones: [...(newGoal.milestones || []), milestone]
                        })
                        setNewMilestone('')
                      }
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {newGoal.milestones && newGoal.milestones.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {newGoal.milestones.map(m => (
                      <div key={m.id} className="text-sm flex items-center gap-2 p-2 rounded bg-muted">
                        <Circle className="w-3 h-3" />
                        <span>{m.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleAddGoal} className="flex-1 bg-sky-500 hover:bg-sky-600 text-white shadow-md" size="lg">
                  <Target className="w-4 h-4 mr-2" weight="bold" />
                  Add Goal
                </Button>
                <Button variant="outline" onClick={() => setIsAddingGoal(false)} size="lg">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {activeGoals.map(goal => {
            const completedMilestones = goal.milestones.filter(m => m.completed).length
            const totalMilestones = goal.milestones.length
            const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

            return (
              <Card key={goal.id} className="hover:border-sky-500/40 transition-all shadow-sm hover:shadow-md border-border/50">
                <CardHeader className="bg-gradient-to-r from-sky-500/5 to-background border-b border-border/30">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-lg font-bold">
                        <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                          <Target className="w-5 h-5 text-sky-500" weight="duotone" />
                        </div>
                        <span className="break-words">{goal.title}</span>
                      </CardTitle>
                      <CardDescription className="mt-2 break-words leading-relaxed">{goal.description}</CardDescription>
                      <div className="flex gap-4 mt-3">
                        {goal.targetDate && (
                          <p className="text-xs font-medium text-muted-foreground">
                            Target: {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        )}
                        {goal.estimatedTimePerDay && goal.estimatedTimePerDay > 0 && (
                          <p className="text-xs font-medium text-muted-foreground">
                            Daily: {goal.estimatedTimePerDay} min
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <Progress value={progress} className="w-24 sm:w-32 h-2.5 [&>div]:bg-sky-500" />
                      <span className="text-base font-bold text-sky-500 min-w-[3.5rem] text-right">{progress}%</span>
                    </div>
                  </div>
                </CardHeader>
                {goal.milestones.length > 0 && (
                  <CardContent className="pt-5 pb-5">
                    <div className="space-y-2.5">
                      {goal.milestones.map(milestone => (
                        <div
                          key={milestone.id}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-sky-500/5 transition-colors border border-transparent hover:border-sky-500/20"
                        >
                          <button
                            onClick={() => handleToggleMilestone(goal.id, milestone.id)}
                            className="flex-shrink-0 mt-0.5"
                          >
                            {milestone.completed ? (
                              <CheckCircle className="w-6 h-6 text-green-600" weight="fill" />
                            ) : (
                              <Circle className="w-6 h-6 text-muted-foreground hover:text-sky-500 transition-colors" />
                            )}
                          </button>
                          <span className={`${milestone.completed ? 'line-through text-muted-foreground' : 'text-foreground font-medium'} break-words flex-1`}>
                            {milestone.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
          {activeGoals.length === 0 && !isAddingGoal && (
            <Card className="border-border/50 shadow-sm">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 rounded-2xl bg-sky-500/10 flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-sky-500" weight="duotone" />
                </div>
                <h3 className="text-xl font-bold mb-3">No goals set yet</h3>
                <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                  Set measurable goals with milestones to track your progress over time
                </p>
                <Button onClick={() => setIsAddingGoal(true)} size="lg" className="bg-sky-500 hover:bg-sky-600 text-white shadow-md">
                  <Plus className="w-5 h-5 mr-2" weight="bold" />
                  Set Your First Goal
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
