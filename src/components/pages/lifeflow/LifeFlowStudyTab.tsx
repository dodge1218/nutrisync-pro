import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Textarea } from '../../ui/textarea'
import { Badge } from '../../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { 
  BookOpen, 
  Brain, 
  Lightning, 
  Plus, 
  Trash, 
  CalendarPlus, 
  CheckCircle, 
  Circle,
  Clock
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { StudyPlan, StudyModule, DaySchedule, ScheduledActivity } from './types'

interface LifeFlowStudyTabProps {
  studyPlans: StudyPlan[]
  setStudyPlans: (plans: StudyPlan[]) => void
  schedules: DaySchedule[]
  setSchedules: (schedules: DaySchedule[]) => void
}

export default function LifeFlowStudyTab({
  studyPlans,
  setStudyPlans,
  schedules,
  setSchedules
}: LifeFlowStudyTabProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [topic, setTopic] = useState('')
  const [syllabusContent, setSyllabusContent] = useState('')
  const [studyType, setStudyType] = useState<'rabbit-hole' | 'serious-learning'>('serious-learning')
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [selectedTime, setSelectedTime] = useState('09:00')
  const [schedulingModule, setSchedulingModule] = useState<{planId: string, module: StudyModule} | null>(null)

  const handleGeneratePlan = async () => {
    if (!topic && !syllabusContent) {
      toast.error('Please provide a topic or syllabus content')
      return
    }

    setIsGenerating(true)
    try {
      const prompt = `Create a study syllabus for "${topic || 'Provided Syllabus'}" designed for ${studyType === 'rabbit-hole' ? 'a deep dive "rabbit hole" exploration' : 'serious, structured quick learning'}.
      
      ${syllabusContent ? `Use the following syllabus content as the source material:\n${syllabusContent}` : ''}

      Break it down into actionable study modules.
      - For "rabbit hole": Focus on interesting connections, deep dives, and exploration.
      - For "serious learning": Focus on core concepts, practical application, and efficiency.
      
      Each module should be 30-90 minutes long.
      
      Return ONLY a valid JSON object with this structure:
      {
        "title": "Course Title",
        "modules": [
          {
            "title": "Module Title",
            "description": "What to read/do/practice",
            "estimatedMinutes": 60
          }
        ]
      }`

      const response = await window.spark.llm(prompt, 'gpt-4o', true)
      const parsed = JSON.parse(response)

      if (parsed.title && Array.isArray(parsed.modules)) {
        const newPlan: StudyPlan = {
          id: `study-${Date.now()}`,
          title: parsed.title,
          type: studyType,
          createdAt: new Date().toISOString(),
          syllabusContent,
          modules: parsed.modules.map((m: any, i: number) => ({
            id: `mod-${Date.now()}-${i}`,
            title: m.title,
            description: m.description,
            estimatedMinutes: m.estimatedMinutes,
            status: 'pending'
          }))
        }

        setStudyPlans([...studyPlans, newPlan])
        toast.success('Study plan generated!')
        setIsCreating(false)
        setTopic('')
        setSyllabusContent('')
      } else {
        toast.error('Failed to parse generated plan')
      }
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Failed to generate study plan')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDeletePlan = (id: string) => {
    setStudyPlans(studyPlans.filter(p => p.id !== id))
    toast.success('Study plan deleted')
  }

  const handleScheduleModule = () => {
    if (!schedulingModule) return

    const { planId, module } = schedulingModule
    
    // Find or create schedule for the date
    const existingScheduleIndex = schedules.findIndex(s => s.date === selectedDate)
    let newSchedules = [...schedules]
    
    const newActivity: ScheduledActivity = {
      id: `study-act-${Date.now()}`,
      name: `${module.title}`,
      startTime: selectedTime,
      endTime: calculateEndTime(selectedTime, module.estimatedMinutes),
      category: 'learning',
      isCompleted: false,
      isRecurring: false,
      studyModuleId: module.id
    }

    if (existingScheduleIndex >= 0) {
      newSchedules[existingScheduleIndex] = {
        ...newSchedules[existingScheduleIndex],
        activities: [...newSchedules[existingScheduleIndex].activities, newActivity].sort((a, b) => a.startTime.localeCompare(b.startTime))
      }
    } else {
      newSchedules.push({
        date: selectedDate,
        activities: [newActivity]
      })
    }

    setSchedules(newSchedules)

    // Update module status
    setStudyPlans(studyPlans.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          modules: p.modules.map(m => m.id === module.id ? { ...m, status: 'scheduled' } : m)
        }
      }
      return p
    }))

    toast.success('Study session scheduled')
    setSchedulingModule(null)
  }

  const calculateEndTime = (start: string, minutes: number) => {
    const [h, m] = start.split(':').map(Number)
    const date = new Date()
    date.setHours(h, m + minutes)
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Study Helper</h2>
          <p className="text-muted-foreground">Create focused syllabi and schedule your learning</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Study Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Study Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Learning Goal</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${studyType === 'rabbit-hole' ? 'border-indigo-500 bg-indigo-50' : 'hover:bg-accent'}`}
                    onClick={() => setStudyType('rabbit-hole')}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Lightning className={`w-5 h-5 ${studyType === 'rabbit-hole' ? 'text-indigo-600' : 'text-muted-foreground'}`} />
                      <span className="font-semibold">Rabbit Hole</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Deep dive exploration, connecting dots, following curiosity.</p>
                  </div>
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${studyType === 'serious-learning' ? 'border-indigo-500 bg-indigo-50' : 'hover:bg-accent'}`}
                    onClick={() => setStudyType('serious-learning')}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className={`w-5 h-5 ${studyType === 'serious-learning' ? 'text-indigo-600' : 'text-muted-foreground'}`} />
                      <span className="font-semibold">Serious Learning</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Structured, efficient, goal-oriented mastery of a topic.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic / Subject</Label>
                <Input 
                  id="topic" 
                  placeholder="e.g., Neuroscience, Python Programming, History of Rome" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="syllabus">Paste Syllabus (Optional)</Label>
                <Textarea 
                  id="syllabus" 
                  placeholder="Paste existing syllabus or course outline here to structure the plan around it..." 
                  className="h-32"
                  value={syllabusContent}
                  onChange={(e) => setSyllabusContent(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button onClick={handleGeneratePlan} disabled={isGenerating} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {isGenerating ? 'Generating...' : 'Generate Plan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {studyPlans.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Study Plans Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create a plan to break down complex topics into manageable study sessions that fit your schedule.
            </p>
            <Button onClick={() => setIsCreating(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Create Your First Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {studyPlans.map(plan => (
            <Card key={plan.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={plan.type === 'rabbit-hole' ? 'secondary' : 'default'} className={plan.type === 'rabbit-hole' ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}>
                        {plan.type === 'rabbit-hole' ? 'Rabbit Hole' : 'Serious Learning'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{plan.title}</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeletePlan(plan.id)}>
                    <Trash className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {plan.modules.map((module, idx) => (
                    <div key={module.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                      <div className="mt-1">
                        {module.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" weight="fill" />
                        ) : module.status === 'scheduled' ? (
                          <CalendarPlus className="w-5 h-5 text-indigo-600" weight="fill" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm">{module.title}</h4>
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {module.estimatedMinutes}m
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{module.description}</p>
                      </div>
                      {module.status === 'pending' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 text-xs"
                              onClick={() => setSchedulingModule({ planId: plan.id, module })}
                            >
                              Schedule
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Schedule Study Session</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Date</Label>
                                <Input 
                                  type="date" 
                                  value={selectedDate} 
                                  onChange={(e) => setSelectedDate(e.target.value)} 
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Start Time</Label>
                                <Input 
                                  type="time" 
                                  value={selectedTime} 
                                  onChange={(e) => setSelectedTime(e.target.value)} 
                                />
                              </div>
                              <div className="bg-muted p-3 rounded-lg text-sm">
                                <p><strong>Module:</strong> {module.title}</p>
                                <p><strong>Duration:</strong> {module.estimatedMinutes} minutes</p>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleScheduleModule}>Confirm Schedule</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
