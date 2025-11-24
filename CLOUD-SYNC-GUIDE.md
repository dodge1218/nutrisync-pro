# Cloud Sync Setup Guide

## Overview

The NutriWell app now includes **cloud data synchronization** powered by Supabase. This feature allows you to:
- 🔄 Automatically sync your data across multiple devices
- ☁️ Backup all your food logs, profiles, and settings to the cloud
- 🔐 Keep your data secure and private
- 📱 Access your data from any browser or device

## Prerequisites

Cloud sync requires a Supabase account and project. If you haven't already set this up:

1. Follow the instructions in `USER-TODO-SUPABASE-SETUP.md`
2. Make sure you've configured your `.env` file with:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Database Setup

### 1. Run the Updated SQL Schema

The cloud sync feature requires an additional table in your Supabase database:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the contents of `supabase-setup.sql`
5. Click **Run** (or press Cmd/Ctrl + Enter)

You should see: `Database setup complete with cloud sync! ✓`

### What This Creates

The SQL script creates:
- `user_data` table - Stores all your app data as key-value pairs
- Row Level Security (RLS) policies - Ensures you can only access your own data
- Automatic timestamp updates - Tracks when data was created/modified
- Indexes - For fast data retrieval

## Using Cloud Sync

### Enabling Cloud Sync

1. Sign in to the app
2. Go to **Settings** page
3. Scroll to the **Cloud Sync** section
4. Toggle **Enable Cloud Sync** to ON

Once enabled, all your data changes will automatically sync to the cloud within 2 seconds.

### First-Time Setup: Migrating Your Data

If you've been using the app before cloud sync was available, your data is currently stored locally in your browser. To move it to the cloud:

**Option 1: Smart Migration (Recommended)**
1. Click **Migrate Local Data to Cloud**
2. This will check if you already have cloud data
3. If your cloud storage is empty, it uploads everything
4. If cloud data exists, it will ask you to choose between Push or Pull

**Option 2: Manual Push**
1. Click **Push to Cloud**
2. This uploads ALL local data to cloud
3. ⚠️ Warning: This overwrites any existing cloud data

**Option 3: Manual Pull**
1. Click **Pull from Cloud**
2. This downloads ALL cloud data to your device
3. ⚠️ Warning: This overwrites your local data
4. The app will refresh automatically

### Sync Across Multiple Devices

**On Device A (original device):**
1. Enable Cloud Sync
2. Click "Push to Cloud" to upload your data

**On Device B (new device):**
1. Sign in with the same account
2. Enable Cloud Sync
3. Click "Pull from Cloud" to download your data
4. App will refresh with your synced data

Going forward, both devices will auto-sync!

### Monitoring Sync Status

The Cloud Sync section shows:
- ✅ **Enabled** badge - Sync is active
- 🔄 **Syncing...** badge - Data is being uploaded
- **Last synced** - Timestamp of your last successful sync
- ⚠️ **Error messages** - If sync fails

## Sync Behavior

### What Gets Synced

Everything stored in the app is synced, including:
- Food logs
- Exercise logs
- Meal plans
- User nutrition profile
- Onboarding data
- Tutorial progress
- Settings preferences
- Achievement data
- History data

### When Sync Happens

- **Automatic**: Every time you make a change (2-second debounce)
- **Manual**: When you click Push/Pull buttons
- **On Enable**: When you first turn on cloud sync

### Offline Support

- Changes are stored locally immediately
- When you come back online, they'll sync automatically
- The app works completely offline - sync is optional

## Troubleshooting

### "Cloud sync not available"

**Cause**: Supabase is not configured

**Solution**:
1. Check your `.env` file has both variables set
2. Restart the development server
3. Refresh the browser

### "Failed to sync data"

**Cause**: Network error or authentication issue

**Solution**:
1. Check your internet connection
2. Try signing out and back in
3. Click "Push to Cloud" manually
4. Check browser console for detailed errors

### Data Not Appearing After Pull

**Cause**: Browser cache issue

**Solution**:
1. The app should auto-refresh after pulling
2. If not, manually refresh the page (F5 or Cmd/Ctrl + R)
3. Check the sync timestamp to confirm pull succeeded

### Sync Seems Slow

**Behavior**: This is normal! Sync uses a 2-second debounce to avoid excessive API calls

**Details**:
- When you make a change, the app waits 2 seconds
- If you make another change within 2 seconds, the timer resets
- Only the final state gets synced (more efficient)

## Privacy & Security

### Your Data Is Private

- Row Level Security ensures you can ONLY see your own data
- Other users cannot access your information
- Even the app developer cannot see your data without your password

### What's Stored

- All data is stored as JSON in the `user_data` table
- Each record has: `user_id`, `key`, `value`, `timestamps`
- Example: `food-logs`, `user-nutrition-profile`, etc.

### Deleting Your Data

Currently manual (in Supabase dashboard):
1. Go to Supabase → Table Editor → `user_data`
2. Filter by your user ID
3. Delete rows

**Coming Soon**: One-click account deletion in Settings

## Advanced Usage

### Viewing Your Cloud Data

1. Go to Supabase dashboard
2. Navigate to **Table Editor** → `user_data`
3. You'll see all your synced keys and values
4. Click on a row to view the JSON data

### Disabling Sync Temporarily

1. Go to Settings → Cloud Sync
2. Toggle **Enable Cloud Sync** to OFF
3. App continues to work locally
4. Re-enable whenever you want to resume syncing

### Resolving Conflicts

If you've made different changes on two devices while offline:

**Recommended Approach**:
1. On Device A: Click "Push to Cloud"
2. On Device B: Click "Pull from Cloud"
3. Device B now has Device A's data
4. Going forward, they'll stay in sync

## FAQ

**Q: Do I need cloud sync?**
A: No! The app works great with local storage. Cloud sync is optional and adds multi-device support.

**Q: Will this slow down the app?**
A: No. Sync happens in the background and doesn't block the UI. You won't notice any difference.

**Q: What if I don't trust cloud storage?**
A: That's fine! Just don't enable cloud sync. Your data stays 100% local in your browser.

**Q: Can I export my data?**
A: Not yet, but it's planned! For now, you can view it in the Supabase dashboard.

**Q: Is this really automatic?**
A: Yes! Once enabled, you never need to think about it. Just use the app normally.

## Support

If you encounter issues:

1. Check the error message in the Cloud Sync section
2. Review this guide's Troubleshooting section
3. Check browser console (F12) for detailed errors
4. Verify your Supabase setup is correct

---

**Last Updated**: January 2025  
**Version**: 1.0 (Initial cloud sync release)
