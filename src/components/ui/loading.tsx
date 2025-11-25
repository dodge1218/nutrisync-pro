import { Leaf } from '@phosphor-icons/react'

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
        <div className="relative bg-card p-6 rounded-2xl shadow-lg border border-border/50 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary animate-pulse" weight="fill" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <h3 className="font-semibold text-lg text-foreground">NutriWell</h3>
            <p className="text-sm text-muted-foreground">Loading your wellness data...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
