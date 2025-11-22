# 🔐 Supabase Authentication Setup Guide

This document explains how to set up Supabase authentication for your NutriWell application before deployment.

## ⚠️ IMPORTANT: This is Required Before Going Live

Your app now includes a login system that requires Supabase to function. You **must** complete this setup before deploying to production.

---

## Quick Start (5-Minute Setup)

### 1. Create a Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com) and sign up (it's free!)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `nutriwell-prod` (or whatever you want)
   - **Database Password**: Choose a strong password and **save it somewhere safe**
   - **Region**: Select closest to your users (e.g., US West, EU West)
4. Click **"Create new project"** and wait 2-3 minutes

### 2. Get Your API Keys

1. Once your project is ready, go to **Settings** (gear icon) → **API**
2. You'll see two important values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: Starts with `eyJ...` (it's long!)
3. **Keep this tab open** - you'll need these in step 4

### 3. Set Up the Database

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Copy the entire SQL script from `USER-TODO-DEPLOYMENT.md` (Step 3) and paste it
4. Click **"Run"** (or Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned" ✅

### 4. Configure Your Local Environment

1. In your project root, create a file called `.env`:
   ```bash
   touch .env
   ```

2. Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
   ```

3. Replace the placeholders with your actual values from Step 2

4. **IMPORTANT**: Never commit `.env` to Git! It's already in `.gitignore`

### 5. Test Locally

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Open your app - you should see a login screen
3. Try creating an account with your email
4. Check your email for verification link
5. Verify and sign in!

---

## What Got Automated

✅ **Supabase client setup** - Already configured in `/src/lib/supabase.ts`  
✅ **Authentication hooks** - `useAuth()` hook in `/src/hooks/useAuth.ts`  
✅ **Login/Signup UI** - Beautiful auth forms in `/src/components/auth/`  
✅ **Protected routes** - App.tsx now requires authentication  
✅ **Sign out functionality** - Button added to header

---

## Security Features Included

🔐 **Row Level Security (RLS)** - Users can only access their own data  
🔐 **Email verification** - Users must verify email before full access  
🔐 **Secure tokens** - JWT-based authentication  
🔐 **Developer isolation** - Your personal data won't appear in analytics

---

## For Deployment to Vercel

See the full deployment guide in `USER-TODO-DEPLOYMENT.md` for:
- How to add environment variables to Vercel
- Updating Supabase redirect URLs
- Framework settings
- Troubleshooting common issues

---

## How It Works

### Authentication Flow

1. **User signs up** → Email sent → Verify email → Can log in
2. **User logs in** → JWT token stored → Access to app
3. **User logs out** → Token cleared → Redirected to login

### Data Privacy

- Each user's data is isolated in Supabase
- Row Level Security policies ensure users only see their own food logs, meals, etc.
- Developer accounts (yours!) can be marked to exclude from analytics

### Local Storage (spark.kv) vs Supabase

**Current state**: 
- Authentication handled by Supabase
- App data still stored locally in browser (spark.kv)
- Each logged-in user has separate local data per device

**Future enhancement** (not yet implemented):
- Sync data across devices via Supabase database
- Cloud backup of food logs, meal templates, etc.
- See PRD Phase 8 for migration plan

---

## Database Schema

The setup script creates:

```sql
user_profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  is_developer BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Mark Yourself as Developer

If you want to exclude your personal health data from future analytics:

1. Go to Supabase → **Table Editor** → **user_profiles**
2. Find your row (by email)
3. Set `is_developer` to `true`
4. Save

---

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env` file
- Make sure there are no extra spaces or quotes
- Restart your dev server after changing `.env`

### Email verification not working
- Check spam folder
- Go to Supabase → **Authentication** → **Email Templates**
- Make sure "Confirm signup" is enabled

### "Failed to fetch" errors
- Is your Supabase project running? Check [status.supabase.com](https://status.supabase.com)
- Are you connected to the internet?
- Check browser console for more details

### Can't sign in after creating account
- Did you verify your email?
- Try "forgot password" to reset
- Check Supabase dashboard → **Authentication** → **Users** to see if account exists

---

## Free Tier Limits

Supabase free tier includes:
- **500 MB database** storage
- **2 GB bandwidth** per month
- **50,000 monthly active users**
- Unlimited API requests

This is **more than enough** for personal use and even small-scale production!

Upgrade only if you:
- Exceed these limits
- Need advanced features (point-in-time recovery, custom SMTP)
- Want priority support

---

## Next Steps

1. ✅ Complete this setup
2. ✅ Test locally
3. ✅ Deploy to Vercel (see `USER-TODO-DEPLOYMENT.md`)
4. ✅ Share with friends!

---

## Future Enhancements (Not Yet Implemented)

These are planned for future releases:

- **Multi-device sync**: Store data in Supabase instead of local storage
- **Data migration**: One-click upload of existing local data to cloud
- **Social login**: "Sign in with Google" button
- **Password reset**: Email-based password recovery
- **Account deletion**: GDPR-compliant data export and deletion

See `PRD.md` Phase 8 for full specifications.

---

## Questions?

- **Supabase Docs**: [https://supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth)
- **Supabase Discord**: [https://discord.supabase.com](https://discord.supabase.com)
- **GitHub Issues**: Open an issue in your repo for app-specific problems

---

**You're almost ready to go live! 🚀**

Complete this setup, then follow `USER-TODO-DEPLOYMENT.md` for Vercel deployment.
