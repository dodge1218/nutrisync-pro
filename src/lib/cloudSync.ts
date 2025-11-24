import { supabase, supabaseConfigured } from './supabase'
import { toast } from 'sonner'

export interface SyncStatus {
  isSyncing: boolean
  lastSyncTime: number | null
  syncEnabled: boolean
  error: string | null
}

export interface CloudDataRecord {
  id: string
  user_id: string
  key: string
  value: any
  created_at: string
  updated_at: string
}

const SYNC_DEBOUNCE_MS = 2000
const SYNC_STATUS_KEY = 'cloud-sync-status'

let syncTimeout: NodeJS.Timeout | null = null
let syncInProgress = false

export async function getSyncStatus(): Promise<SyncStatus> {
  if (!supabaseConfigured) {
    return {
      isSyncing: false,
      lastSyncTime: null,
      syncEnabled: false,
      error: 'Supabase not configured'
    }
  }

  try {
    const statusStr = localStorage.getItem(SYNC_STATUS_KEY)
    if (statusStr) {
      return JSON.parse(statusStr)
    }
  } catch (error) {
    console.error('Error reading sync status:', error)
  }

  return {
    isSyncing: false,
    lastSyncTime: null,
    syncEnabled: true,
    error: null
  }
}

export async function setSyncStatus(status: Partial<SyncStatus>): Promise<void> {
  const currentStatus = await getSyncStatus()
  const newStatus = { ...currentStatus, ...status }
  localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(newStatus))
}

export async function syncToCloud(key: string, value: any): Promise<boolean> {
  if (!supabaseConfigured) {
    console.warn('Cloud sync skipped: Supabase not configured')
    return false
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.warn('Cloud sync skipped: User not authenticated')
    return false
  }

  const status = await getSyncStatus()
  if (!status.syncEnabled) {
    console.log('Cloud sync skipped: Sync disabled by user')
    return false
  }

  if (syncTimeout) {
    clearTimeout(syncTimeout)
  }

  return new Promise((resolve) => {
    syncTimeout = setTimeout(async () => {
      try {
        await setSyncStatus({ isSyncing: true, error: null })

        const { error } = await supabase
          .from('user_data')
          .upsert({
            user_id: user.id,
            key,
            value,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,key'
          })

        if (error) throw error

        await setSyncStatus({
          isSyncing: false,
          lastSyncTime: Date.now(),
          error: null
        })

        resolve(true)
      } catch (error) {
        console.error('Cloud sync error:', error)
        await setSyncStatus({
          isSyncing: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        resolve(false)
      }
    }, SYNC_DEBOUNCE_MS)
  })
}

export async function syncFromCloud(key: string): Promise<any | null> {
  if (!supabaseConfigured) {
    return null
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('user_data')
      .select('value')
      .eq('user_id', user.id)
      .eq('key', key)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw error
    }

    return data?.value || null
  } catch (error) {
    console.error('Error fetching from cloud:', error)
    return null
  }
}

export async function syncAllFromCloud(): Promise<Map<string, any>> {
  const dataMap = new Map<string, any>()

  if (!supabaseConfigured) {
    return dataMap
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return dataMap
  }

  try {
    await setSyncStatus({ isSyncing: true, error: null })

    const { data, error } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', user.id)

    if (error) throw error

    if (data) {
      data.forEach((record: CloudDataRecord) => {
        dataMap.set(record.key, record.value)
      })
    }

    await setSyncStatus({
      isSyncing: false,
      lastSyncTime: Date.now(),
      error: null
    })
  } catch (error) {
    console.error('Error syncing all from cloud:', error)
    await setSyncStatus({
      isSyncing: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  return dataMap
}

export async function deleteFromCloud(key: string): Promise<boolean> {
  if (!supabaseConfigured) {
    return false
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return false
  }

  try {
    const { error } = await supabase
      .from('user_data')
      .delete()
      .eq('user_id', user.id)
      .eq('key', key)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting from cloud:', error)
    return false
  }
}

export async function enableCloudSync(): Promise<void> {
  await setSyncStatus({ syncEnabled: true })
  toast.success('Cloud sync enabled')
}

export async function disableCloudSync(): Promise<void> {
  await setSyncStatus({ syncEnabled: false })
  toast.info('Cloud sync disabled')
}

export async function performFullSync(): Promise<void> {
  if (!supabaseConfigured) {
    toast.error('Cloud sync not available: Supabase not configured')
    return
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    toast.error('Please sign in to sync data')
    return
  }

  try {
    await setSyncStatus({ isSyncing: true, error: null })
    toast.info('Syncing data to cloud...')

    const keys = Object.keys(localStorage).filter(key => !key.startsWith('sb-'))

    for (const key of keys) {
      try {
        const value = localStorage.getItem(key)
        if (value) {
          const parsedValue = JSON.parse(value)
          await supabase
            .from('user_data')
            .upsert({
              user_id: user.id,
              key,
              value: parsedValue,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,key'
            })
        }
      } catch (error) {
        console.error(`Error syncing key ${key}:`, error)
      }
    }

    await setSyncStatus({
      isSyncing: false,
      lastSyncTime: Date.now(),
      error: null
    })

    toast.success('Data synced successfully!')
  } catch (error) {
    console.error('Full sync error:', error)
    await setSyncStatus({
      isSyncing: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    toast.error('Failed to sync data')
  }
}

export async function migrateLocalDataToCloud(): Promise<void> {
  if (!supabaseConfigured) {
    toast.error('Cloud sync not available')
    return
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    toast.error('Please sign in to migrate data')
    return
  }

  try {
    toast.info('Migrating local data to cloud...')

    const cloudData = await syncAllFromCloud()
    
    if (cloudData.size === 0) {
      await performFullSync()
      toast.success('Local data migrated to cloud!')
    } else {
      toast.info('Cloud data found. Use "Pull from Cloud" to restore or "Push to Cloud" to overwrite.')
    }
  } catch (error) {
    console.error('Migration error:', error)
    toast.error('Failed to migrate data')
  }
}

export async function pullAllFromCloud(): Promise<void> {
  if (!supabaseConfigured) {
    toast.error('Cloud sync not available')
    return
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    toast.error('Please sign in to pull data')
    return
  }

  try {
    await setSyncStatus({ isSyncing: true, error: null })
    toast.info('Pulling data from cloud...')

    const cloudData = await syncAllFromCloud()

    cloudData.forEach((value, key) => {
      localStorage.setItem(key, JSON.stringify(value))
    })

    await setSyncStatus({
      isSyncing: false,
      lastSyncTime: Date.now(),
      error: null
    })

    toast.success(`Pulled ${cloudData.size} items from cloud. Please refresh the page.`)
    
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  } catch (error) {
    console.error('Pull error:', error)
    await setSyncStatus({
      isSyncing: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    toast.error('Failed to pull data')
  }
}
