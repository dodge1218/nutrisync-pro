# 🚀 Deployment Guide: NutriWell Suite

This guide will walk you through deploying your NutriWell application to Vercel with Supabase authentication.

---

## 📋 Prerequisites

Before you begin, make sure you have:
- A [Supabase](https://supabase.com) account (free tier available)
- A [Vercel](https://vercel.com) account (free tier available)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

---

## Part 1: Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: `nutriwell-production` (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select the region closest to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for your project to be provisioned

### Step 2: Get Your API Credentials

1. In your Supabase project dashboard, click **"Settings"** (gear icon in sidebar)
2. Click **"API"** in the settings menu
3. You'll see two important values:
   - **Project URL** (looks like `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public key** (a long string starting with `eyJ...`)
4. **Copy these values** - you'll need them in Step 4

### Step 3: Set Up Database Tables

1. In your Supabase dashboard, click **"SQL Editor"** in the sidebar
2. Click **"New query"**
3. Copy and paste this SQL script:

``` sql
-- Create users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  is_developer BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create policy: New users can insert their profile
CREATE POLICY "Users can insert own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call function when new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Optional: Mark yourself as a developer (replace with your email)
-- UPDATE public.user_profiles 
-- SET is_developer = true 
-- WHERE email = 'your-email@example.com';
```

4. Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)
5. You should see "Success. No rows returned" - this is correct!

### Step 4: Configure Email Authentication

1. In Supabase dashboard, go to **"Authentication"** → **"Providers"**
2. Make sure **"Email"** is enabled (it should be by default)
3. **Highly Recommended**: Set up a custom SMTP server for reliable email delivery.
   - See our [SMTP Setup Guide](./USER-TODO-SMTP.md) for detailed instructions.
4. Scroll down to **"Email Templates"**
5. Customize the email templates if desired (optional)
6. **Important**: Under **"Auth"** → **"URL Configuration"**, set your site URL:
   - For now, leave it as default
   - After deploying to Vercel, come back and update this to your Vercel URL

---

## Part 2: Vercel Deployment

### Step 5: Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. **Import your Git repository**:
   - Connect your GitHub/GitLab/Bitbucket account if needed
   - Select the repository containing your NutriWell code
4. **Configure your project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)

### Step 6: Add Environment Variables

In the Vercel project configuration screen, scroll to **"Environment Variables"**:

1. Add your first variable:
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: Paste your Supabase Project URL (from Step 2)
   - **Environment**: Select all (Production, Preview, Development)

2. Add your second variable:
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: Paste your Supabase anon public key (from Step 2)
   - **Environment**: Select all (Production, Preview, Development)

3. Click **"Deploy"**

### Step 7: Wait for Deployment

- Vercel will build and deploy your app (takes 1-3 minutes)
- You'll see a success screen with your deployment URL
- Click **"Visit"** to see your live app!

### Step 8: Update Supabase with Your Vercel URL

1. Copy your Vercel deployment URL (e.g., `https://nutriwell.vercel.app`)
2. Go back to Supabase dashboard → **"Authentication"** → **"URL Configuration"**
3. Update **"Site URL"** to your Vercel URL
4. Add your Vercel URL to **"Redirect URLs"** as well
5. Click **"Save"**

---

## Part 3: Verification & Testing

### Step 9: Test Your Deployment

1. Visit your Vercel URL
2. Try creating a new account
3. Check your email for the verification link
4. Verify your email and sign in
5. Test core features:
   - Log a meal
   - View dashboard
   - Check GBDI score

### Step 10: Mark Yourself as Developer (Optional)

If you want to exclude your personal health data from future analytics:

1. Go to Supabase dashboard → **"Table Editor"**
2. Select **"user_profiles"** table
3. Find your user row (by your email)
4. Click to edit, set `is_developer` to `true`
5. Save

---

## 🔧 Framework Settings

Vercel should auto-detect these, but verify in your project settings:

**Build & Development Settings:**
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

**Node.js Version:**
- Use Node.js 18.x or higher (Vercel default is fine)

**Routing Configuration:**
- A `vercel.json` file is included in the project root to handle SPA routing
- This ensures all routes properly redirect to `index.html` for client-side routing
- No additional configuration needed - Vercel will automatically use this file

---

## 🔐 Security Best Practices

### Environment Variables
- ✅ **DO**: Store in Vercel environment variables
- ❌ **DON'T**: Commit `.env` files to Git
- ✅ **DO**: Use different Supabase projects for development and production
- ❌ **DON'T**: Share your `SUPABASE_ANON_KEY` publicly (though it's designed to be client-side, keep it in your app only)

### Supabase Security
- ✅ Enable Row Level Security (RLS) on all tables (we did this in Step 3)
- ✅ Use policies to restrict data access
- ✅ Never expose your `service_role` key in client code
- ✅ Review Supabase auth settings periodically

---

## 🐛 Troubleshooting

### "Invalid API key" error
- **Solution**: Double-check your environment variables in Vercel
- Go to Vercel project → **Settings** → **Environment Variables**
- Make sure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly
- Redeploy after making changes

### Email verification not working
- **Solution**: Check Supabase email settings
- Go to Supabase → **Authentication** → **Email Templates**
- Make sure "Confirm signup" template is enabled
- Check your spam folder
- **Best Fix**: Set up a custom SMTP server (see [SMTP Setup Guide](./USER-TODO-SMTP.md))

### "Failed to fetch" errors
- **Solution**: Check Supabase URL configuration
- Make sure your Vercel URL is added to Supabase redirect URLs
- Verify CORS settings in Supabase (should allow your domain)

### App loads but can't sign in
- **Solution**: Clear browser cache and cookies
- Check browser console for error messages
- Verify Supabase is running (check status.supabase.com)

### Build fails on Vercel
- **Solution**: Check build logs
- Common issues:
  - Missing dependencies → run `npm install` locally first
  - Type errors → fix TypeScript errors locally
  - Environment variables not set → add them in Vercel settings

---

## 📊 Monitoring Your App

### Vercel Analytics
- Go to your Vercel project → **"Analytics"** tab
- Monitor page views, performance, and errors
- Free tier includes basic analytics

### Supabase Monitoring
- Go to Supabase dashboard → **"Database"** → **"Logs"**
- Monitor auth events, API calls, and errors
- Set up alerts for critical issues

---

## 🔄 Updating Your App

When you push changes to your Git repository:
1. Vercel automatically detects the changes
2. Builds and deploys the new version
3. No manual steps needed!

To manually redeploy:
1. Go to Vercel project → **"Deployments"** tab
2. Click the **"..."** menu on any deployment
3. Select **"Redeploy"**

---

## 💰 Pricing & Limits

### Supabase Free Tier
- 500 MB database storage
- 1 GB file storage
- 2 GB bandwidth per month
- 50,000 monthly active users
- Unlimited API requests

**When to upgrade**: If you exceed these limits or need:
- More storage
- Custom domains for auth emails
- Point-in-time recovery (backups)
- Priority support

### Vercel Free Tier
- 100 GB bandwidth per month
- Unlimited deployments
- Automatic HTTPS
- Preview deployments for PRs

**When to upgrade**: If you exceed bandwidth or need:
- Advanced analytics
- Password protection
- Team collaboration features

---

## 🆘 Need Help?

- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)
- **Supabase Discord**: [https://discord.supabase.com](https://discord.supabase.com)
- **GitHub Issues**: Open an issue in your repository for app-specific problems

---

## ✅ Deployment Checklist

Before going live, verify:

- [ ] Supabase project created
- [ ] Database tables and RLS policies set up
- [ ] Supabase API credentials obtained
- [ ] Vercel project created and deployed
- [ ] Environment variables added to Vercel
- [ ] Site URL updated in Supabase
- [ ] Email verification tested
- [ ] Sign up flow tested
- [ ] Sign in flow tested
- [ ] Core features work (food logging, dashboard, etc.)
- [ ] Developer account marked (optional)
- [ ] Custom domain connected (optional)
- [ ] Analytics enabled

---

## 🚀 You're Live!

Congratulations! Your NutriWell app is now deployed and ready for users.

**Next Steps:**
- Share your app URL with friends and family
- Monitor usage through Vercel and Supabase dashboards
- Gather user feedback
- Iterate and improve

**Remember**: This is just the beginning. As you grow, you can:
- Upgrade to paid tiers for more capacity
- Add custom domains
- Implement advanced features
- Scale to thousands of users

Good luck! 🎉
