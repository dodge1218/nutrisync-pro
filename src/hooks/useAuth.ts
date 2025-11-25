import { useState, useEffect } from 'react'
import { supabase, supabaseConfigured } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabaseConfigured) {
      const mockUser: User = {
        id: 'local-user',
        email: 'local@example.com',
        created_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: {},
        user_metadata: {},
      }
      setUser(mockUser)
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, username?: string) => {
    if (!supabaseConfigured) {
      return { data: null, error: new Error('Supabase not configured') }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    })
    return { data, error }
  }

  const signIn = async (identifier: string, password: string) => {
    if (!supabaseConfigured) {
      return { data: null, error: new Error('Supabase not configured') }
    }

    let emailToUse = identifier

    // If identifier is not an email, try to resolve it as a username
    if (!identifier.includes('@')) {
      // Use the secure RPC function instead of direct table select
      const { data, error } = await supabase.rpc('get_email_by_username', { 
        username_input: identifier 
      })

      if (error || !data) {
        return { data: null, error: new Error('Invalid username or password') }
      }
      emailToUse = data as string
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    if (!supabaseConfigured) {
      return { error: null }
    }
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  }
}
