import { Alert, AlertDescription } from './ui/alert'
import { Info } from '@phosphor-icons/react'

export default function DisclaimerBanner() {
  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-amber-50 border-amber-200">
      <Info className="h-4 w-4 text-amber-600" weight="fill" />
      <AlertDescription className="text-sm text-amber-900">
        <strong>Informational use only. Not medical advice.</strong> This app provides general nutrition insights.
        Always consult your doctor or registered dietitian before making dietary changes, especially if you have medical conditions or take medications.
      </AlertDescription>
    </Alert>
  )
}
