import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { AuthLayout } from './AuthLayout'
import { supabaseConfigured } from '@/lib/supabase'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info, EnvelopeOpen } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [loginIdentifier, setLoginIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSignupSuccess, setShowSignupSuccess] = useState(false)
  const { signIn, signUp } = useAuth()

  const validateInput = (value: string, type: 'Username' | 'Password') => {
    if (value.length < 8) return `${type} must be at least 8 characters`
    if (!/[A-Z]/.test(value)) return `${type} must contain at least one uppercase letter`
    if (!/[0-9]/.test(value)) return `${type} must contain at least one number`
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await signIn(loginIdentifier, password)
        if (error) {
          toast.error(error.message)
        } else {
          toast.success('Welcome back!')
        }
      } else {
        // Validate Username and Password
        const usernameError = validateInput(username, 'Username')
        if (usernameError) {
          toast.error(usernameError)
          setLoading(false)
          return
        }

        const passwordError = validateInput(password, 'Password')
        if (passwordError) {
          toast.error(passwordError)
          setLoading(false)
          return
        }

        const { error } = await signUp(email, password, username)
        if (error) {
          toast.error(error.message)
        } else {
          setShowSignupSuccess(true)
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={showSignupSuccess} onOpenChange={setShowSignupSuccess}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-fit">
              <EnvelopeOpen className="w-12 h-12 text-primary" weight="duotone" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">Check your inbox!</DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              We've sent a magic link to <strong className="text-foreground">{email}</strong>.
              <br />
              Click it to activate your account and start your wellness journey! 🚀
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-4">
            <Button onClick={() => setShowSignupSuccess(false)} className="w-full sm:w-auto">
              Got it, thanks!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AuthLayout 
        title={isLogin ? 'Welcome Back' : 'Create Account'}
        subtitle={isLogin ? 'Sign in to continue your wellness journey' : 'Start tracking your nutrition today'}
      >
        {!supabaseConfigured && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Supabase authentication is not configured. Please add your Supabase credentials to enable sign-in. See USER-TODO-SUPABASE-SETUP.md for instructions.
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {isLogin ? (
            <div>
              <Label htmlFor="loginIdentifier">Email or Username</Label>
              <Input
                id="loginIdentifier"
                type="text"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="username or email@example.com"
                required
                className="mt-1"
              />
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username (min 8 chars, 1 upper, 1 number)"
                  required
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Min 8 chars, 1 uppercase, 1 number
                </p>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="mt-1"
            />
            {!isLogin && (
              <p className="text-xs text-muted-foreground mt-1">
                Min 8 chars, 1 uppercase, 1 number
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              // Reset fields when switching modes
              setEmail('')
              setUsername('')
              setLoginIdentifier('')
              setPassword('')
            }}
            className="text-sm text-primary hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </AuthLayout>
    </>
  )
}
