import { Alert, AlertDescription } from './ui/alert'
import { Info } from '@phosphor-icons/react'

export default function DisclaimerBanner() {
  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-accent/10 border-accent/20">
      <Info className="h-4 w-4 text-accent" weight="duotone" />
      <AlertDescription className="text-xs text-accent-foreground/80">
        <strong className="font-semibold">Informational use only. Not medical advice.</strong> This app provides general nutrition insights.
        Always consult your doctor before making dietary changes.
      </AlertDescription>
    </Alert>
  )
}
