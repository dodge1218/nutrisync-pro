import { createClient } from '@supabase/supabase-js'

export const supabaseConfigured = false

export const supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
})

export type UserProfile = {
  id: string
  email: string
  created_at: string
  is_developer?: boolean
}
