import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Microphone, PaperPlaneRight, Sparkle, Spinner, Plus } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { FoodLog } from '@/lib/nutritionEngine'
import { UserSleepPreferences } from '@/lib/circadianEngine'
import { Goal, DaySchedule, ScheduledActivity } from '@/components/pages/lifeflow/types'

export function SmartEntryDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isListening, setIsListening] = useState(false)

  // Data Stores
  const [foodLogs, setFoodLogs] = useKV<FoodLog[]>('food-logs', [])
  const [sleepPreferences, setSleepPreferences] = useKV<UserSleepPreferences>('sleep-preferences', {
    targetSleepTime: '22:00',
    targetWakeTime: '06:30',
    desiredDigestiveBuffer: 240
  })
  const [goals, setGoals] = useKV<Goal[]>('lifeflow-goals', [])
  const [schedules, setSchedules] = useKV<DaySchedule[]>('lifeflow-schedules', [])

  const handleAnalyze = async () => {
    if (!input.trim()) return
    setIsAnalyzing(true)

    try {
      const prompt = `
        Analyze the following user input and extract structured data to update their health profile.
        User Input: "${input}"
        
        Return a JSON object with the following keys (only if data is present):
        1. "foodLogs": Array of objects { "name": string, "time": string (HH:MM), "quantity": number, "calories": number (estimate) }
        2. "sleep": { "wakeTime": string (HH:MM), "sleepTime": string (HH:MM) }
        3. "activities": Array of objects { "name": string, "startTime": string (HH:MM), "duration": number (minutes), "category": "work"|"exercise"|"learning"|"social"|"rest"|"chore" }
        4. "goals": Array of objects { "title": string, "description": string, "category": "health"|"career"|"learning"|"financial" }
        
        Current Date: ${new Date().toISOString().split('T')[0]}
        
        Example JSON:
        {
          "foodLogs": [{ "name": "Apple", "time": "10:00", "quantity": 1, "calories": 95 }],
          "sleep": { "wakeTime": "07:00", "sleepTime": "23:00" },
          "activities": [{ "name": "Gym", "startTime": "18:00", "duration": 60, "category": "exercise" }],
          "goals": [{ "title": "Run 5k", "description": "Train for a 5k run in 2 months", "category": "health" }]
        }
      `

      let content = ''
      
      if (window.spark && window.spark.llm) {
        const response = await window.spark.llm({
          messages: [{ role: 'user', content: prompt }]
        } as any)
        content = typeof response === 'string' ? response : (response as any).message?.content || JSON.stringify(response)
      } else if (import.meta.env.VITE_OPENAI_API_KEY) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3
          })
        })
        const data = await response.json()
        content = data.choices[0]?.message?.content || ''
      } else {
        // Mock response
        await new Promise(resolve => setTimeout(resolve, 1500))
        content = JSON.stringify({
          foodLogs: [],
          activities: [{ name: "Processed Entry", startTime: "12:00", duration: 30, category: "productivity" }]
        })
        toast.info("Using mock AI (configure API key for real analysis)")
      }

      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0])
        let updatesCount = 0

        // 1. Food Logs
        if (data.foodLogs && Array.isArray(data.foodLogs) && data.foodLogs.length > 0) {
          const newLogs: FoodLog[] = data.foodLogs.map((item: any) => ({
            id: uuidv4(),
            foodId: 'custom',
            food: {
              id: 'custom',
              name: item.name,
              calories: item.calories || 200,
              protein: 0,
              carbs: 0,
              fat: 0,
              servingSize: '1 serving',
              category: 'custom',
              tags: []
            },
            quantity: item.quantity || 1,
            timestamp: new Date(`${new Date().toISOString().split('T')[0]}T${item.time || '12:00'}:00`).toISOString(),
            mealType: 'snack'
          }))
          setFoodLogs([...(foodLogs || []), ...newLogs])
          updatesCount += newLogs.length
        }

        // 2. Sleep
        if (data.sleep) {
          const currentBuffer = sleepPreferences?.desiredDigestiveBuffer ?? 240
          setSleepPreferences({
            targetWakeTime: data.sleep.wakeTime || sleepPreferences?.targetWakeTime || '06:30',
            targetSleepTime: data.sleep.sleepTime || sleepPreferences?.targetSleepTime || '22:00',
            desiredDigestiveBuffer: currentBuffer
          })
          updatesCount++
        }

        // 3. Activities (Add to today's schedule)
        if (data.activities && Array.isArray(data.activities) && data.activities.length > 0) {
          const todayStr = new Date().toISOString().split('T')[0]
          const newActivities: ScheduledActivity[] = data.activities.map((act: any) => ({
            id: uuidv4(),
            name: act.name,
            startTime: act.startTime || '12:00',
            endTime: calculateEndTime(act.startTime || '12:00', act.duration || 30),
            category: act.category || 'custom',
            isCompleted: false,
            isRecurring: false
          }))

          setSchedules(prev => {
            const existingSchedule = prev?.find(s => s.date === todayStr)
            if (existingSchedule) {
              return prev!.map(s => s.date === todayStr ? { ...s, activities: [...s.activities, ...newActivities] } : s)
            } else {
              return [...(prev || []), { date: todayStr, activities: newActivities }]
            }
          })
          updatesCount += newActivities.length
        }

        // 4. Goals
        if (data.goals && Array.isArray(data.goals) && data.goals.length > 0) {
          const newGoals: Goal[] = data.goals.map((g: any) => ({
            id: uuidv4(),
            title: g.title,
            description: g.description,
            targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 90 days
            status: 'active',
            createdAt: new Date().toISOString(),
            category: g.category,
            milestones: []
          }))
          setGoals([...(goals || []), ...newGoals])
          updatesCount += newGoals.length
        }

        if (updatesCount > 0) {
          toast.success(`Successfully processed ${updatesCount} updates!`)
          setInput('')
          setIsOpen(false)
        } else {
          toast.info("No actionable data found in your input.")
        }
      }
    } catch (error) {
      console.error("Analysis failed", error)
      toast.error("Failed to process entry")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [h, m] = startTime.split(':').map(Number)
    const totalMinutes = h * 60 + m + durationMinutes
    const endH = Math.floor(totalMinutes / 60) % 24
    const endM = totalMinutes % 60
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
  }

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false)
    } else {
      setIsListening(true)
      toast.info("Listening... (Speak now)")
      
      if ('webkitSpeechRecognition' in window) {
        const recognition = new (window as any).webkitSpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInput(prev => prev + (prev ? ' ' : '') + transcript)
          setIsListening(false)
        }
        
        recognition.onerror = () => {
          setIsListening(false)
          toast.error("Microphone error")
        }
        
        recognition.start()
      } else {
        setTimeout(() => {
          setIsListening(false)
          toast.warning("Speech recognition not supported in this browser")
        }, 1000)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md border-0">
          <Sparkle className="w-4 h-4 mr-2" weight="fill" />
          Smart Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkle className="w-5 h-5 text-indigo-500" weight="fill" />
            Smart Entry
          </DialogTitle>
          <DialogDescription>
            Describe your day, meals, workouts, or goals. AI will sort it out.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="bg-muted/30 p-4 rounded-xl border border-border/50 space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Try saying: <br/>
              "I ate 2 eggs for breakfast at 8am. Went for a 30 min run at 5pm. My goal is to drink more water."
            </p>
            <div className="relative">
              <Textarea 
                placeholder="Type or speak here..."
                className="min-h-[120px] pr-10 text-sm resize-none bg-white dark:bg-zinc-800 text-black dark:text-white border-zinc-200 dark:border-zinc-700"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className={`absolute right-2 bottom-2 h-8 w-8 ${isListening ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`}
                onClick={toggleListening}
              >
                <Microphone className="w-5 h-5" weight={isListening ? "fill" : "regular"} />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAnalyze} 
              disabled={!input.trim() || isAnalyzing}
              className="bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              {isAnalyzing ? (
                <>
                  <Spinner className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <PaperPlaneRight className="w-4 h-4 mr-2" />
                  Process Entry
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
