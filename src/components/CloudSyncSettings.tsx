import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { 
  Cloud, 
  CloudArrowDown, 
  CloudArrowUp, 
  CheckCircle, 
  XCircle,
  ArrowsClockwise,
  Database
} from '@phosphor-icons/react'
import {
  getSyncStatus,
  enableCloudSync,
  disableCloudSync,
  performFullSync,
  pullAllFromCloud,
  migrateLocalDataToCloud,
  type SyncStatus
} from '../lib/cloudSync'
import { supabaseConfigured } from '../lib/supabase'
import { toast } from 'sonner'

export default function CloudSyncSettings() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSyncStatus()
  }, [])

  const loadSyncStatus = async () => {
    const status = await getSyncStatus()
    setSyncStatus(status)
  }

  const handleToggleSync = async (enabled: boolean) => {
    if (enabled) {
      await enableCloudSync()
    } else {
      await disableCloudSync()
    }
    await loadSyncStatus()
  }

  const handlePushToCloud = async () => {
    setLoading(true)
    await performFullSync()
    await loadSyncStatus()
    setLoading(false)
  }

  const handlePullFromCloud = async () => {
    setLoading(true)
    await pullAllFromCloud()
    await loadSyncStatus()
    setLoading(false)
  }

  const handleMigrate = async () => {
    setLoading(true)
    await migrateLocalDataToCloud()
    await loadSyncStatus()
    setLoading(false)
  }

  if (!supabaseConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Cloud Sync
          </CardTitle>
          <CardDescription>
            Sync your data across devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <XCircle className="w-4 h-4" />
            <AlertDescription>
              Cloud sync is not available. Supabase is not configured. Please set up your Supabase credentials in the .env file.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const formatLastSync = (timestamp: number | null) => {
    if (!timestamp) return 'Never'
    const date = new Date(timestamp)
    const now = Date.now()
    const diff = now - timestamp
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              Cloud Sync
            </CardTitle>
            <CardDescription>
              Automatically sync your data across devices
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {syncStatus?.isSyncing && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <ArrowsClockwise className="w-3 h-3 animate-spin" />
                Syncing...
              </Badge>
            )}
            {syncStatus?.syncEnabled && !syncStatus.isSyncing && (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Enabled
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="cloud-sync">Enable Cloud Sync</Label>
            <p className="text-xs text-muted-foreground">
              Automatically backup and sync your data to the cloud
            </p>
          </div>
          <Switch
            id="cloud-sync"
            checked={syncStatus?.syncEnabled || false}
            onCheckedChange={handleToggleSync}
            disabled={loading}
          />
        </div>

        {syncStatus?.lastSyncTime && (
          <div className="text-sm text-muted-foreground">
            Last synced: {formatLastSync(syncStatus.lastSyncTime)}
          </div>
        )}

        {syncStatus?.error && (
          <Alert variant="destructive">
            <XCircle className="w-4 h-4" />
            <AlertDescription>{syncStatus.error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3 pt-4 border-t">
          <p className="text-sm font-medium">Manual Sync Actions</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handlePushToCloud}
              disabled={loading || !syncStatus?.syncEnabled}
              className="flex items-center gap-2"
            >
              <CloudArrowUp className="w-4 h-4" />
              Push to Cloud
            </Button>
            
            <Button
              variant="outline"
              onClick={handlePullFromCloud}
              disabled={loading || !syncStatus?.syncEnabled}
              className="flex items-center gap-2"
            >
              <CloudArrowDown className="w-4 h-4" />
              Pull from Cloud
            </Button>
          </div>

          <Button
            variant="secondary"
            onClick={handleMigrate}
            disabled={loading}
            className="w-full flex items-center gap-2"
          >
            <Database className="w-4 h-4" />
            Migrate Local Data to Cloud
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Push: Upload your current local data to the cloud (overwrites cloud data)
            <br />
            Pull: Download cloud data to this device (overwrites local data)
            <br />
            Migrate: Smart migration - only uploads if cloud is empty
          </p>
        </div>

        <Alert>
          <CheckCircle className="w-4 h-4" />
          <AlertDescription>
            When cloud sync is enabled, all changes are automatically saved to the cloud within 2 seconds.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
