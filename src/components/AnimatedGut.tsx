import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Info } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface AnimatedGutProps {
  gutHealthScore: number
  recentFoodType?: 'good' | 'neutral' | 'bad'
  showDetails?: boolean
}

type GutState = 'happy' | 'neutral' | 'struggling'
type ParticleEffect = 'positive' | 'warning' | 'none'

const getGutState = (score: number): GutState => {
  if (score >= 70) return 'happy'
  if (score >= 40) return 'neutral'
  return 'struggling'
}

const getParticleEffect = (foodType?: 'good' | 'neutral' | 'bad'): ParticleEffect => {
  if (!foodType) return 'none'
  if (foodType === 'good') return 'positive'
  if (foodType === 'bad') return 'warning'
  return 'none'
}

const getGutColor = (state: GutState): string => {
  switch (state) {
    case 'happy':
      return 'oklch(0.70 0.15 150)'
    case 'neutral':
      return 'oklch(0.85 0.05 85)'
    case 'struggling':
      return 'oklch(0.65 0.12 50)'
  }
}

const getGutMessage = (state: GutState): string => {
  switch (state) {
    case 'happy':
      return "Your gut is thriving! Keep up the great work! 😊"
    case 'neutral':
      return "Your gut is doing okay. Add more fiber and fermented foods! 😐"
    case 'struggling':
      return "Your gut needs some TLC. Try adding gut-friendly foods today. 😔"
  }
}

const Particle = ({ type, index }: { type: ParticleEffect; index: number }) => {
  if (type === 'none') return null

  const randomX = (Math.random() - 0.5) * 80
  const randomDelay = Math.random() * 0.5

  if (type === 'positive') {
    return (
      <motion.div
        key={`positive-${index}`}
        className="absolute w-2 h-2 rounded-full"
        style={{
          background: 'oklch(0.70 0.15 150)',
          left: '50%',
          top: '50%',
        }}
        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
        animate={{
          opacity: [0, 0.6, 0],
          scale: [0, 1, 0.5],
          x: randomX,
          y: [-40, -80, -120],
        }}
        transition={{
          duration: 2,
          delay: randomDelay,
          repeat: Infinity,
          repeatDelay: 1.5,
          ease: "easeOut"
        }}
      />
    )
  }

  if (type === 'warning') {
    return (
      <motion.div
        key={`warning-${index}`}
        className="absolute w-1.5 h-1.5 rounded-full"
        style={{
          background: 'oklch(0.60 0.22 25)',
          left: '50%',
          top: '50%',
        }}
        initial={{ opacity: 0, y: 0 }}
        animate={{
          opacity: [0, 0.7, 0],
          y: [0, -20, -40],
        }}
        transition={{
          duration: 1,
          delay: randomDelay,
          repeat: Infinity,
          repeatDelay: 1.5,
        }}
      />
    )
  }

  return null
}

export default function AnimatedGut({ 
  gutHealthScore, 
  recentFoodType,
  showDetails = true 
}: AnimatedGutProps) {
  const [gutState, setGutState] = useState<GutState>(getGutState(gutHealthScore))
  const [particleEffect, setParticleEffect] = useState<ParticleEffect>('none')

  useEffect(() => {
    setGutState(getGutState(gutHealthScore))
  }, [gutHealthScore])

  useEffect(() => {
    if (recentFoodType) {
      const effect = getParticleEffect(recentFoodType)
      setParticleEffect(effect)
      
      setTimeout(() => {
        setParticleEffect('none')
      }, 3000)
    }
  }, [recentFoodType])

  const gutColor = getGutColor(gutState)
  const message = getGutMessage(gutState)

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-background to-muted/30">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Your Gut Health</h3>
            <p className="text-sm text-muted-foreground">Score: {gutHealthScore}/100</p>
          </div>
          {showDetails && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Info className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>How Gut Health Works</DialogTitle>
                  <DialogDescription className="space-y-3 text-left pt-4">
                    <p>
                      Your Gut Health score is based on several factors that support a healthy gut microbiome:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Fiber intake:</strong> Target 25-35g/day for optimal gut health</li>
                      <li><strong>Fermented foods:</strong> Yogurt, kefir, sauerkraut, kimchi (2+ servings/day)</li>
                      <li><strong>Plant diversity:</strong> Aim for 30+ different plant foods per week</li>
                      <li><strong>Polyphenol-rich foods:</strong> Berries, olive oil, tea, dark chocolate</li>
                      <li><strong>Prebiotic foods:</strong> Garlic, onions, asparagus, Jerusalem artichoke</li>
                      <li><strong>Limiting ultra-processed foods:</strong> Keep below 10% of daily calories</li>
                    </ul>
                    <p className="pt-2">
                      <strong>The animated gut reacts to your food choices:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>🟢 <strong>Positive particles:</strong> Gut-supportive foods (fermented, high-fiber, polyphenols)</li>
                      <li>🔴 <strong>Warning particles:</strong> Gut stressors (ultra-processed, low-fiber)</li>
                      <li>😊 <strong>Happy state:</strong> Score 70+ (thriving gut)</li>
                      <li>😐 <strong>Neutral state:</strong> Score 40-69 (needs improvement)</li>
                      <li>😔 <strong>Struggling state:</strong> Score below 40 (needs attention)</li>
                    </ul>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="relative flex justify-center items-center h-48">
          <AnimatePresence mode="wait">
            <motion.div
              key={gutState}
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <svg
                width="180"
                height="180"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  d="M100 30 C130 30, 150 50, 150 80 L150 140 C150 160, 130 170, 110 165 C90 160, 80 150, 80 130 L80 70 C80 50, 60 40, 50 60 L50 120 C50 150, 70 170, 100 170 C130 170, 150 150, 150 120"
                  stroke={gutColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ 
                    pathLength: 1,
                    stroke: gutColor
                  }}
                  transition={{ 
                    pathLength: { duration: 1.5 },
                    stroke: { duration: 0.5 }
                  }}
                />

                <motion.circle
                  cx="90"
                  cy="80"
                  r="6"
                  fill="currentColor"
                  className="text-foreground"
                  animate={
                    gutState === 'happy'
                      ? { scale: [1, 1.1, 1] }
                      : gutState === 'struggling'
                      ? { scale: [1, 0.9, 1] }
                      : {}
                  }
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                <motion.circle
                  cx="130"
                  cy="80"
                  r="6"
                  fill="currentColor"
                  className="text-foreground"
                  animate={
                    gutState === 'happy'
                      ? { scale: [1, 1.1, 1] }
                      : gutState === 'struggling'
                      ? { scale: [1, 0.9, 1] }
                      : {}
                  }
                  transition={{ repeat: Infinity, duration: 2 }}
                />

                {gutState === 'happy' && (
                  <motion.path
                    d="M80 110 Q110 130 140 110"
                    stroke="currentColor"
                    className="text-foreground"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                )}

                {gutState === 'neutral' && (
                  <motion.line
                    x1="80"
                    y1="110"
                    x2="140"
                    y2="110"
                    stroke="currentColor"
                    className="text-foreground"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                )}

                {gutState === 'struggling' && (
                  <motion.path
                    d="M80 120 Q110 100 140 120"
                    stroke="currentColor"
                    className="text-foreground"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                )}
              </svg>

              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${gutColor}20, transparent 70%)`,
                }}
                animate={
                  gutState === 'happy'
                    ? {
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }
                    : gutState === 'struggling'
                    ? {
                        scale: [1, 1.05, 1],
                        opacity: [0.2, 0.3, 0.2],
                      }
                    : {}
                }
                transition={{ repeat: Infinity, duration: 3 }}
              />

              {[...Array(8)].map((_, i) => (
                <Particle key={i} type={particleEffect} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.p
          key={message}
          className="text-center text-sm text-muted-foreground mt-4 px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {message}
        </motion.p>

        <div className="mt-4 flex justify-center gap-2">
          <div className={`h-2 w-12 rounded-full transition-all ${gutHealthScore >= 70 ? 'bg-accent' : 'bg-muted'}`} />
          <div className={`h-2 w-12 rounded-full transition-all ${gutHealthScore >= 40 && gutHealthScore < 70 ? 'bg-secondary' : 'bg-muted'}`} />
          <div className={`h-2 w-12 rounded-full transition-all ${gutHealthScore < 40 ? 'bg-destructive' : 'bg-muted'}`} />
        </div>
      </CardContent>
    </Card>
  )
}
