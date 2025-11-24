import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Alert, AlertDescription } from './ui/alert'
import { Download, Trash, FileArrowDown, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useAuth } from '../hooks/useAuth'
import { exportDataToJSON, exportDataToCSV, deleteAllUserData } from '../lib/dataExport'

export default function DataManagement() {
  const { user, signOut } = useAuth()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleExportJSON = async () => {
    setIsExporting(true)
    try {
      const data = await exportDataToJSON()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `nutriwell-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Data exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      const csvFiles = await exportDataToCSV()
      
      for (const { filename, content } of csvFiles) {
        const blob = new Blob([content], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
      
      toast.success(`Exported ${csvFiles.length} CSV files`)
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data')
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm')
      return
    }

    setIsDeleting(true)
    try {
      await deleteAllUserData(user?.id)
      
      toast.success('All data deleted successfully')
      setDeleteDialogOpen(false)
      
      setTimeout(async () => {
        await signOut()
      }, 1000)
    } catch (error) {
      console.error('Deletion error:', error)
      toast.error('Failed to delete account data')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Warning weight="fill" />
          Data Management & Privacy
        </CardTitle>
        <CardDescription>
          Export your data or permanently delete your account (GDPR compliant)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
            <div>
              <div className="font-medium">Export All Data (JSON)</div>
              <div className="text-sm text-muted-foreground">
                Download complete backup of all your data in JSON format
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportJSON}
              disabled={isExporting}
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export JSON'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
            <div>
              <div className="font-medium">Export Data (CSV)</div>
              <div className="text-sm text-muted-foreground">
                Download food logs, stress logs, and other data as CSV files
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportCSV}
              disabled={isExporting}
            >
              <FileArrowDown className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </Button>
          </div>
        </div>

        <Alert variant="destructive" className="mt-6">
          <Warning className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">Danger Zone</div>
            <div className="text-sm mb-3">
              Deleting your account will permanently remove all your data including food logs, 
              meal templates, stress logs, goals, and profile information. This action cannot be undone.
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete Account & All Data
            </Button>
          </AlertDescription>
        </Alert>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-destructive flex items-center gap-2">
                <Warning weight="fill" />
                Delete Account Permanently?
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. All your data will be permanently deleted from our servers.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <Alert>
                <AlertDescription>
                  <div className="font-medium mb-2">What will be deleted:</div>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>All food logs and meal templates</li>
                    <li>Stress logs and health tracking data</li>
                    <li>Goals, schedules, and check-in history</li>
                    <li>Exercise logs and fitness profiles</li>
                    <li>User profile and preferences</li>
                    <li>Cloud sync data (if enabled)</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div>
                <label className="text-sm font-medium">
                  Type <span className="font-bold text-destructive">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border rounded-md"
                  placeholder="Type DELETE"
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setDeleteDialogOpen(false)
                  setConfirmText('')
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
                disabled={confirmText !== 'DELETE' || isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Everything'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
