# 🚨 QUICK FIX: Supabase Authentication Errors

## Current Problem

You're seeing these errors:
- `401 (Unauthorized)` when trying to sign up/log in
- `Failed to parse KV key response`

## Root Cause

The Supabase client is missing the correct **anon public API key**. The keys you provided (`sb_publishable_...` and `sb_secret_...`) are not the standard Supabase JWT keys needed for authentication.

---

## ✅ Solution (3 Steps)

### Step 1: Get Your Anon Key from Supabase

1. Go to: https://app.supabase.com/project/adpyzjdujbtobhxxdfgh/settings/api
2. Find the section labeled **Project API keys**
3. Copy the **anon public** key (NOT service_role)
   - It's a long JWT token starting with `eyJ`
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkcHl6amR1amJ0b2JoeHhkZmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTc4MzIwMH0.xxxx...`

### Step 2: Update Your .env File

1. Open `.env` in your project root
2. Paste the anon key:

```env
VITE_SUPABASE_URL=https://adpyzjdujbtobhxxdfgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...paste-your-actual-key-here
```

3. Save the file

### Step 3: Set Up the Database

1. Go to: https://app.supabase.com/project/adpyzjdujbtobhxxdfgh/sql/new
2. Copy the entire contents of `supabase-setup.sql` (in this directory)
3. Paste it into the SQL editor
4. Click **"Run"** or press Cmd/Ctrl + Enter
5. You should see "Database setup complete! ✓"

### Step 4: Restart Your Dev Server

```bash
# Stop your current dev server (Ctrl+C)
# Then restart it:
npm run dev
```

---

## ✨ After These Steps

- Authentication errors should be gone
- You can create an account and log in
- Your data will be isolated per user

---

## 🔍 Still Having Issues?

### Double-check Your Anon Key

The anon key should:
- ✅ Start with `eyJ`
- ✅ Be 200+ characters long
- ✅ Have dots (.) separating three parts
- ✅ Come from the **anon public** field (not service_role)
- ❌ NOT be the `sb_publishable_...` or `sb_secret_...` keys

### Verify Your Supabase Project

1. Check that your project is active: https://app.supabase.com
2. Confirm the URL matches: `https://adpyzjdujbtobhxxdfgh.supabase.co`
3. Make sure you ran the SQL setup script

### Common Mistakes

❌ **Using the service_role key** - This is a backend-only key, don't use it in your frontend  
❌ **Extra spaces in .env** - No spaces around the `=` sign  
❌ **Quotes in .env** - Don't wrap the key in quotes  
❌ **Not restarting dev server** - Changes to `.env` require a restart

---

## 📸 What to Look For in Supabase Dashboard

When you go to Settings → API, you should see:

```
Project API keys

URL
https://adpyzjdujbtobhxxdfgh.supabase.co

anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkcHl6amR1amJ0b2JoeHhkZmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2...  [COPY THIS ONE]

service_role
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkcHl6amR1amJ0b2JoeHhkZmdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6M...  [DON'T USE THIS ONE]
```

Copy the **anon public** key!

---

## 🎯 Summary

1. Get anon key from Supabase dashboard (Settings → API)
2. Add it to `.env` file
3. Run `supabase-setup.sql` in SQL editor
4. Restart dev server
5. Done! 🎉

---

For more detailed instructions, see:
- `GET-SUPABASE-KEY.md` - Detailed key retrieval guide
- `USER-TODO-SUPABASE-SETUP.md` - Full setup documentation
- `USER-TODO-DEPLOYMENT.md` - Deployment guide
