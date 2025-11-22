# 🚨 QUICK FIX: Supabase Authentication Errors

## 🎯 QUICK ANSWER: Where is the anon key?

**You're on the right page in Supabase, but in the wrong section!**

**RIGHT NOW:** You're viewing "API Settings" (showing Data API config)  
**YOU NEED:** Click **"API Keys"** in the LEFT SIDEBAR (below "Data API")

That's where you'll find the `eyJ...` anon public key!

---

## Current Problem

You're seeing these errors:
- `401 (Unauthorized)` when trying to sign up/log in
- `Failed to parse KV key response`

## Root Cause

The Supabase client is missing the correct **anon public API key**. The keys you provided (`sb_publishable_...` and `sb_secret_...`) are not the standard Supabase JWT keys needed for authentication.

---

## ✅ Solution (3 Steps)

### Step 1: Get Your Anon Key from Supabase

**VISUAL GUIDE - FOLLOW THESE EXACT STEPS:**

1. **You're already on the right page!** You're at Settings → API
2. **Look at the LEFT SIDEBAR** - You should see these menu items:
   - ✅ Data API (you're here now - showing "API Settings")
   - 👉 **API Keys** ← CLICK THIS ONE!
   - JWT Keys
   - Log Drains
   - Add Ons

3. **Click "API Keys"** in the left sidebar (under Data API)

4. **You'll see a new page with "Project API keys"** section

5. **Find and copy the "anon public" key**:
   - It's labeled **"anon public"** or **"anon"**
   - It's a LONG token starting with `eyJ`
   - About 200+ characters
   - Has dots (.) separating three parts
   - Example start: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkcHl6amR1amJ0b2JoeHhkZmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTc4MzIwMH0.xxxx...`

6. **Click the copy button** next to the anon key (NOT the service_role key below it)

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

### CURRENT LOCATION (Where you are now):
You're at: **Settings → Data API → (showing API Settings page)**
- This shows "Enable Data API", "Exposed schemas", etc.
- ❌ This is NOT where the keys are!

### WHERE YOU NEED TO GO:
Click **"API Keys"** in the left sidebar (just below "Data API")

### WHAT YOU'LL SEE on the API Keys page:

```
Project API keys

URL
https://adpyzjdujbtobhxxdfgh.supabase.co

anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkcHl6amR1amJ0b2JoeHhkZmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2...  
[Copy button] ← COPY THIS ONE!

service_role
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkcHl6amR1amJ0b2JoeHhkZmdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6M...  
[Copy button] ← DON'T USE THIS ONE!
```

**The anon public key:**
- Starts with `eyJ`
- Is very long (200+ characters)
- This is what you need!

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
