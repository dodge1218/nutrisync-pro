import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Info, Leaf, Apple, Cookie, Drop, Circle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { FoodLog } from '../lib/nutritionEngine'

interface AnimatedGutProps {
  gutHealthScore: number
  foodLogs?: FoodLog[]
  recentFoodType?: 'good' | 'neutral' | 'bad'
  showDetails?: boolean
}

type GutState = 'happy' | 'neutral' | 'struggling'
type ParticleType = 'fiber' | 'polyphenol' | 'fermented' | 'processed' | 'neutral'

interface GutParticle {
  id: string
  type: ParticleType
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

const getGutState = (score: number): GutState => {
  if (score >= 70) return 'happy'
  if (score >= 40) return 'neutral'
  return 'struggling'
}

const getGutColor = (state: GutState): string => {
  switch (state) {
    case 'happy':
      return 'oklch(0.70 0.15 150)' // Greenish
    case 'neutral':
      return 'oklch(0.85 0.05 85)' // Yellowish/Gray
    case 'struggling':
      return 'oklch(0.65 0.12 50)' // Reddish/Orange
  }
}

const getGutMessage = (state: GutState): string => {
  switch (state) {
    case 'happy':
      return "Your microbiome is thriving! Keep feeding it fiber & plants. 🌱"
    case 'neutral':
      return "Your gut is stable. Add more fermented foods to boost diversity! ⚖️"
    case 'struggling':
      return "Your gut needs support. Try reducing sugar and adding fiber. ❤️"
  }
}

// Generate particles based on food logs from the last 3 days
const generateParticlesFromLogs = (logs: FoodLog[]): GutParticle[] => {
  const particles: GutParticle[] = []
  const now = Date.now()
  const threeDaysAgo = now - (72 * 60 * 60 * 1000)
  
  const recentLogs = logs.filter(log => new Date(log.timestamp).getTime() > threeDaysAgo)
  
  // No limit on particles - show every single log
  recentLogs.forEach((log, index) => {
    const food = log.food
    let type: ParticleType = 'neutral'
    
    // Determine particle type based on nutrients/tags
    // Note: This is a simplified heuristic. In a real app, we'd check specific food tags.
    if (food.fiber > 3) type = 'fiber'
    else if (food.name.toLowerCase().includes('berry') || food.name.toLowerCase().includes('tea') || food.name.toLowerCase().includes('chocolate')) type = 'polyphenol'
    else if (food.name.toLowerCase().includes('yogurt') || food.name.toLowerCase().includes('kefir') || food.name.toLowerCase().includes('kimchi')) type = 'fermented'
    else if (food.tags.includes('ultra-processed') || (food.carbs > 30 && food.fiber < 2)) type = 'processed'

    // Calculate "digestion" state (older foods are smaller/faded)
    const ageHours = (now - new Date(log.timestamp).getTime()) / (1000 * 60 * 60)
    const size = Math.max(4, 12 - (ageHours / 72) * 8) // Shrink over 3 days

    particles.push({
      id: `${log.id}-${index}`,
      type,
      x: Math.random() * 140 + 30, // Random X within gut container
      y: Math.random() * 140 + 30, // Random Y within gut container
      size,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 4
    })
  })

  return particles
}

const Particle = ({ p }: { p: GutParticle }) => {
  const colors: Record<ParticleType, string> = {
    fiber: 'oklch(0.75 0.18 145)', // Bright Green
    polyphenol: 'oklch(0.65 0.20 300)', // Purple
    fermented: 'oklch(0.70 0.15 240)', // Blue
    processed: 'oklch(0.60 0.20 25)', // Red/Brown
    neutral: 'oklch(0.90 0.02 90)', // Gray
  }

  const Icon = {
    fiber: Leaf,
    polyphenol: Apple,
    fermented: Drop,
    processed: Cookie,
    neutral: Circle
  }[p.type]

  return (
    <motion.div
      className="absolute"
      style={{
        color: colors[p.type],
      }}
      initial={{ x: p.x, y: p.y, opacity: 0 }}
      animate={{
        x: [p.x, p.x + (Math.random() - 0.5) * 40, p.x],
        y: [p.y, p.y + (Math.random() - 0.5) * 40, p.y],
        opacity: [0.6, 1, 0.6],
        scale: [1, 1.1, 1],
        rotate: [0, 15, -15, 0]
      }}
      transition={{
        duration: p.duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: p.delay
      }}
    >
      <Icon size={p.size} weight="fill" />
    </motion.div>
  )
}

export default function AnimatedGut({ 
  gutHealthScore, 
  foodLogs = [],
  recentFoodType,
  showDetails = true 
}: AnimatedGutProps) {
  const [gutState, setGutState] = useState<GutState>(getGutState(gutHealthScore))
  const [particles, setParticles] = useState<GutParticle[]>([])
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    setGutState(getGutState(gutHealthScore))
  }, [gutHealthScore])

  useEffect(() => {
    if (demoMode) return
    setParticles(generateParticlesFromLogs(foodLogs))
  }, [foodLogs, demoMode])

  const gutColor = getGutColor(gutState)
  const message = getGutMessage(gutState)

  const handleDemoAdd = (type: ParticleType) => {
    setDemoMode(true)
    const newParticle: GutParticle = {
      id: `demo-${Date.now()}`,
      type,
      x: 100, // Start center
      y: 0, // Start top
      size: 16,
      delay: 0,
      duration: 3
    }
    
    setParticles(prev => [...prev, newParticle])
  }

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-background to-muted/30 border-2 border-muted/40">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              Microbiome Status
              {gutState === 'happy' && <span className="text-xl">✨</span>}
            </h3>
            <p className="text-sm text-muted-foreground">Gut Score: {Math.round(gutHealthScore)}/100</p>
          </div>
          <div className="flex gap-1">
             {/* Demo Controls */}
            <Button variant="ghost" size="icon" onClick={() => handleDemoAdd('fiber')} title="Add Fiber">
              <span className="text-green-500 text-xs">●</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDemoAdd('processed')} title="Add Processed">
              <span className="text-red-500 text-xs">●</span>
            </Button>
            
            {showDetails && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Info className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Inside Your Gut</DialogTitle>
                    <DialogDescription className="space-y-3 text-left pt-4">
                      <p>This animation visualizes your food digestion over the last 3 days.</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Leaf weight="fill" className="text-[oklch(0.75_0.18_145)]" />
                          <span>Fiber (Fuel)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Apple weight="fill" className="text-[oklch(0.65_0.20_300)]" />
                          <span>Polyphenols</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Drop weight="fill" className="text-[oklch(0.70_0.15_240)]" />
                          <span>Probiotics</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Cookie weight="fill" className="text-[oklch(0.60_0.20_25)]" />
                          <span>Processed</span>
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div className="relative flex justify-center items-center h-64 bg-background/50 rounded-2xl border border-border/50 shadow-inner overflow-hidden">
          {/* Background Texture */}
          <div className="absolute inset-0 opacity-10" 
               style={{ 
                 backgroundImage: `radial-gradient(${gutColor} 1px, transparent 1px)`, 
                 backgroundSize: '20px 20px' 
               }} 
          />

          <AnimatePresence mode="wait">
            <motion.div
              key="gut-container"
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* Organic Gut Shape Container */}
              <svg
                width="240"
                height="240"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-xl"
              >
                {/* Outer Glow */}
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* The Gut Shape - Morphing based on state */}
                <motion.path
                  d="M100 20 
                     C 150 20, 180 60, 180 100 
                     C 180 150, 150 180, 100 180 
                     C 50 180, 20 150, 20 100 
                     C 20 50, 50 20, 100 20 Z"
                  stroke={gutColor}
                  strokeWidth="3"
                  fill={gutColor}
                  fillOpacity="0.05"
                  animate={{
                    d: gutState === 'happy' 
                      ? "M100 15 C 160 15, 185 60, 185 100 C 185 160, 160 185, 100 185 C 40 185, 15 160, 15 100 C 15 40, 40 15, 100 15 Z"
                      : "M100 25 C 140 25, 170 65, 170 100 C 170 140, 140 175, 100 175 C 60 175, 30 140, 30 100 C 30 60, 60 25, 100 25 Z"
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 4,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Inner pulsing lining */}
                <motion.path
                   d="M100 30 
                     C 140 30, 170 65, 170 100 
                     C 170 140, 140 170, 100 170 
                     C 60 170, 30 140, 30 100 
                     C 30 65, 60 30, 100 30 Z"
                  stroke={gutColor}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  fill="none"
                  opacity="0.5"
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                  }}
                />
              </svg>

              {/* Particles Layer */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                {particles.map((p) => (
                  <Particle key={p.id} p={p} />
                ))}
              </div>

              {/* Status Icon Overlay (Subtle) */}
              <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium border shadow-sm">
                {gutState === 'happy' ? 'Thriving' : gutState === 'neutral' ? 'Balanced' : 'Struggling'}
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          key={message}
          className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-center text-sm text-muted-foreground font-medium">
            {message}
          </p>
        </motion.div>
      </CardContent>
    </Card>
  )
}
