export async function exportDataToJSON() {
  const allKeys = await window.spark.kv.keys()
  const data: Record<string, any> = {}
  
  for (const key of allKeys) {
    try {
      const value = await window.spark.kv.get(key)
      if (value !== undefined) {
        data[key] = value
      }
    } catch (error) {
      console.error(`Error exporting key ${key}:`, error)
    }
  }
  
  return {
    exportDate: new Date().toISOString(),
    version: '1.0.0',
    data
  }
}

export async function exportDataToCSV() {
  const csvFiles: Array<{ filename: string; content: string }> = []
  
  const foodLogs = await window.spark.kv.get<any[]>('food-logs') || []
  if (foodLogs.length > 0) {
    const headers = ['Date', 'Time', 'Food ID', 'Quantity', 'Meal Type', 'Notes']
    const rows = foodLogs.map((log: any) => [
      new Date(log.timestamp).toLocaleDateString(),
      new Date(log.timestamp).toLocaleTimeString(),
      log.foodId || '',
      log.quantity || '',
      log.mealType || '',
      log.notes || ''
    ])
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    
    csvFiles.push({
      filename: `food-logs-${new Date().toISOString().split('T')[0]}.csv`,
      content: csvContent
    })
  }
  
  const stressLogs = await window.spark.kv.get<any[]>('stress-logs') || []
  if (stressLogs.length > 0) {
    const headers = ['Date', 'Stress Level', 'Sleep Quality', 'Energy Level', 'Physical Symptoms', 'Mental Symptoms', 'Notes']
    const rows = stressLogs.map((log: any) => [
      log.timestamp ? new Date(log.timestamp).toLocaleDateString() : '',
      log.stressLevel || '',
      log.sleepQuality || '',
      log.energyLevel || '',
      (log.physicalSymptoms || []).join('; '),
      (log.mentalSymptoms || []).join('; '),
      log.notes || ''
    ])
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    
    csvFiles.push({
      filename: `stress-logs-${new Date().toISOString().split('T')[0]}.csv`,
      content: csvContent
    })
  }
  
  const mealTemplates = await window.spark.kv.get<any[]>('meal-templates') || []
  if (mealTemplates.length > 0) {
    const headers = ['Name', 'Meal Type', 'Ingredients', 'Created By']
    const rows = mealTemplates.map((template: any) => [
      template.name || '',
      template.mealType || '',
      JSON.stringify(template.ingredients || []),
      template.createdBy || 'user'
    ])
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    
    csvFiles.push({
      filename: `meal-templates-${new Date().toISOString().split('T')[0]}.csv`,
      content: csvContent
    })
  }
  
  const exerciseLogs = await window.spark.kv.get<any[]>('exercise-logs') || []
  if (exerciseLogs.length > 0) {
    const headers = ['Date', 'Activity', 'Duration (min)', 'Calories Burned', 'Notes']
    const rows = exerciseLogs.map((log: any) => [
      new Date(log.date).toLocaleDateString(),
      log.activity || '',
      log.duration || '',
      log.caloriesBurned || '',
      log.notes || ''
    ])
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    
    csvFiles.push({
      filename: `exercise-logs-${new Date().toISOString().split('T')[0]}.csv`,
      content: csvContent
    })
  }
  
  return csvFiles
}

export async function deleteAllUserData(userId?: string) {
  const allKeys = await window.spark.kv.keys()
  
  const keysToDelete = allKeys.filter(key => 
    !key.startsWith('system-') && 
    !key.startsWith('app-')
  )
  
  for (const key of keysToDelete) {
    try {
      await window.spark.kv.delete(key)
    } catch (error) {
      console.error(`Error deleting key ${key}:`, error)
    }
  }
  
  if (userId) {
    console.log(`All data for user ${userId} has been deleted from local storage`)
  }
  
  return { success: true, deletedKeys: keysToDelete.length }
}
