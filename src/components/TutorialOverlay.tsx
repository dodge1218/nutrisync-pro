import { useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { X } from '@phosphor-icons/react'
import { AppMode } from '@/App'
import { OnboardingStep } from '@/lib/onboardingEngine'

interface TutorialOverlayProps {
  step: OnboardingStep
  currentStepNum: number
  totalSteps: number
  onNext: () => void
  onPrevious: () => void
  onSkip: () => void
  onClose: () => void
}

export default function TutorialOverlay({
  step,
  currentStepNum,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  onClose,
}: TutorialOverlayProps) {
  useEffect(() => {
    if (step.targetElement) {
      const element = document.querySelector(step.targetElement)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [step.targetElement])

  const getTooltipPosition = () => {
    if (!step.targetElement) {
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }
    }

    const element = document.querySelector(step.targetElement)
    if (!element) {
      return {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }
    }

    const rect = element.getBoundingClientRect()
    const placement = step.placement || 'bottom'

    switch (placement) {
      case 'top':
        return {
          position: 'fixed' as const,
          bottom: `${window.innerHeight - rect.top + 16}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)',
        }
      case 'bottom':
        return {
          position: 'fixed' as const,
          top: `${rect.bottom + 16}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)',
        }
      case 'left':
        return {
          position: 'fixed' as const,
          top: `${rect.top + rect.height / 2}px`,
          right: `${window.innerWidth - rect.left + 16}px`,
          transform: 'translateY(-50%)',
        }
      case 'right':
        return {
          position: 'fixed' as const,
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + 16}px`,
          transform: 'translateY(-50%)',
        }
      case 'center':
      default:
        return {
          position: 'fixed' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }
    }
  }

  const highlightTarget = () => {
    if (!step.targetElement) return null

    const element = document.querySelector(step.targetElement)
    if (!element) return null

    const rect = element.getBoundingClientRect()

    return (
      <div
        className="fixed pointer-events-none z-40 border-4 border-primary rounded-lg animate-pulse"
        style={{
          top: `${rect.top - 4}px`,
          left: `${rect.left - 4}px`,
          width: `${rect.width + 8}px`,
          height: `${rect.height + 8}px`,
        }}
      />
    )
  }

  const tooltipPosition = getTooltipPosition()

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-30" onClick={onSkip} />
      
      {highlightTarget()}

      <Card
        className="z-50 max-w-md shadow-2xl"
        style={tooltipPosition}
      >
        <CardContent className="pt-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-xs text-muted-foreground mb-1">
                Step {currentStepNum + 1} of {totalSteps}
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 -mt-2 -mr-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-6">{step.description}</p>

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-xs"
            >
              Skip tutorial
            </Button>

            <div className="flex gap-2">
              {currentStepNum > 0 && (
                <Button variant="outline" size="sm" onClick={onPrevious}>
                  Back
                </Button>
              )}
              <Button size="sm" onClick={onNext}>
                {currentStepNum === totalSteps - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
