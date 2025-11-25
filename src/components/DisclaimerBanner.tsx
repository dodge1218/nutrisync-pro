import { Alert, AlertDescription } from './ui/alert'
import { Info } from '@phosphor-icons/react'

export default function DisclaimerBanner() {
  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-amber-500/10 border-amber-400/30 backdrop-blur-sm">
      <Info className="h-5 w-5 text-amber-600" weight="duotone" />
      <AlertDescription className="text-sm text-amber-900/90 font-medium">
        <strong className="font-semibold">Informational use only. Not medical advice.</strong> This app provides general nutrition insights.
        Always consult your doctor or registered dietitian before making dietary changes, especially if you have medical conditions or take medications.
      </AlertDescription>
    </Alert>
  )
}
