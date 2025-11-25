import { ReactNode } from 'react'
import { Leaf } from '@phosphor-icons/react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 animate-gradient"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">NutriWell</h1>
          </div>
          
          <div className="mb-6 space-y-2">
            <p className="text-lg text-foreground/90 font-medium">
              Track nutrition. Optimize sleep. Plan your life.
            </p>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Three intelligent tools that work together to help you feel better, sleep deeper, and get more done.
            </p>
          </div>
          
          <h2 className="text-2xl font-semibold text-foreground mb-2">{title}</h2>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>
        
        <div className="bg-card rounded-lg shadow-lg p-8 border border-border backdrop-blur-sm">
          {children}
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
