# 🔑 How to Get Your Supabase Anon Key

## 🎯 TL;DR - Quick Answer

**In your Supabase dashboard:**
1. Settings (left sidebar) → API
2. Click **"API Keys"** (in the left menu, below "Data API")
3. Copy the **"anon public"** key (starts with `eyJ`)

**That's it!** That long `eyJ...` token is what you need.

---

## The Issue

You're seeing authentication errors (401 Unauthorized) because the Supabase client needs the correct **anon (public) API key**, which is a JWT token.

## What You Need

From your Supabase project dashboard, you need:

1. ✅ **Project URL**: `https://adpyzjdujbtobhxxdfgh.supabase.co` (you have this!)
2. ❌ **Anon/Public Key**: A long JWT token starting with `eyJ...` (this is what's missing)

## Step-by-Step Instructions

### 1. Go to Your Supabase Project Dashboard

Navigate to: https://app.supabase.com/project/adpyzjdujbtobhxxdfgh

### 2. Navigate to API Keys

**IMPORTANT:** There are TWO sections in Settings → API:
1. **"Data API"** - This shows API settings (exposed schemas, etc.) - ❌ NOT HERE
2. **"API Keys"** - This shows your actual keys - ✅ GO HERE!

**Step-by-step:**
1. Click the **Settings** icon (⚙️) in the left sidebar
2. You'll see "API" section expand showing:
   - Data API
   - **API Keys** ← Click this one!
   - JWT Keys
   - Log Drains
   - Add Ons

### 3. Find Your Keys (on the API Keys page)

On the **API Keys** page, you'll see:

- **Project URL**: `https://adpyzjdujbtobhxxdfgh.supabase.co` ✅
- **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ← **THIS IS WHAT YOU NEED**
- **service_role**: Another long JWT token (don't use this one - it's for backend only)

### 4. Copy the Anon Key

The **anon public** key should be:
- Very long (200+ characters)
- Starts with `eyJ`
- Contains dots (.) separating three parts
- Example format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...lots more characters...`

### 5. Update Your .env File

1. Open `.env` in your project root
2. Replace the empty `VITE_SUPABASE_ANON_KEY=` with your actual key:

```env
VITE_SUPABASE_URL=https://adpyzjdujbtobhxxdfgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...your-actual-key...
```

3. Save the file
4. Restart your dev server

## Important Notes

### ❌ Don't Use These Keys

The keys you provided earlier:
- `sb_publishable_u70KQw5-FrfKvdm3R5cL0g__89z7L7T`
- `sb_secret_uMkV7fphjZ2CsIcS3T5EHQ_Cxpsw8uC`

These appear to be from a different system or formatted incorrectly. They are **not** standard Supabase JWT tokens.

### ✅ Use the Anon Public Key

The correct key is labeled **"anon public"** or just **"anon"** in the Supabase dashboard and looks like a JWT token (three base64-encoded parts separated by dots).

## After You Update

Once you've added the correct anon key:

1. Restart your development server
2. The authentication errors should disappear
3. You'll be able to sign up and log in

## Need Help?

If you're still having trouble finding the key:

1. Screenshot your Supabase API settings page (Settings → API)
2. Make sure you're looking at the **API** section, not Auth or Database
3. The anon key should be clearly labeled and very visible

## Security Reminder

🔒 The anon key is safe to use in your frontend code - it's designed to be public. However:

- Don't commit `.env` to Git (it's already in `.gitignore`)
- When deploying to Vercel, add it as an environment variable in the Vercel dashboard
- Never share your `service_role` key publicly

---

**Once you have the correct anon key, your authentication will work! 🎉**
