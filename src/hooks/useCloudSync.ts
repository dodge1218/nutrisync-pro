import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { 
  getSyncStatus, 
  syncToCloud, 
  syncFromCloud,
  type SyncStatus 
} from '../lib/cloudSync'
import { supabaseConfigured } from '../lib/supabase'

export function useCloudSync<T>(key: string, defaultValue: T) {
  const [value, setValue, deleteValue] = useKV<T>(key, defaultValue)
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)

  useEffect(() => {
    if (supabaseConfigured) {
      getSyncStatus().then(setSyncStatus)
    }
  }, [])

  useEffect(() => {
    if (value !== undefined && value !== null && syncStatus?.syncEnabled) {
      syncToCloud(key, value)
    }
  }, [value, key, syncStatus?.syncEnabled])

  const loadFromCloud = async () => {
    const cloudValue = await syncFromCloud(key)
    if (cloudValue !== null) {
      setValue(cloudValue)
    }
  }

  return {
    value,
    setValue,
    deleteValue,
    syncStatus,
    loadFromCloud
  }
}
