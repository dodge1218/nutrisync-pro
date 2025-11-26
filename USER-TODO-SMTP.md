# 📧 SMTP Setup Guide: NutriWell Suite

This guide explains how to set up a custom SMTP server for your NutriWell application.

## ⚠️ Why do I need this?

By default, Supabase uses its own email service to send authentication emails (signup confirmations, password resets). However, this service has strict limits:
- **Rate Limit**: Only ~3 emails per hour
- **Branding**: Emails come from `noreply@supabase.co`
- **Reliability**: Not meant for production apps

To ensure your users always receive their login emails, you **must** set up a custom SMTP provider.

---

## 📋 Prerequisites

- A domain name (e.g., `your-app.com`) - *Required for best deliverability*
- A Supabase project (already set up from the Deployment Guide)
- An account with an Email Service Provider (ESP)

---

## Part 1: Choose an Email Provider

We recommend **Resend** for its simplicity and generous free tier (3,000 emails/mo), but you can use any provider.

### Option A: Resend (Recommended)
1. Go to [Resend.com](https://resend.com) and sign up.
2. Click **"Add Domain"**.
3. Enter your domain (e.g., `nutriwell-app.com`).
4. Follow the instructions to add the DNS records (DKIM, SPF, DMARC) to your domain registrar (GoDaddy, Namecheap, Vercel, etc.).
5. Wait for the domain to be verified (usually minutes, sometimes up to 24h).
6. Go to **"API Keys"** and create a new key. Name it "Supabase SMTP".
   - **Save this key!** You won't see it again.

### Option B: SendGrid / Mailgun / AWS SES
The process is similar:
1. Sign up.
2. Verify your domain via DNS records.
3. Generate an API Key or SMTP credentials.

---

## Part 2: Configure Supabase

1. Log in to your [Supabase Dashboard](https://app.supabase.com).
2. Select your project.
3. Go to **Project Settings** (gear icon) → **Authentication**.
4. Click on **SMTP Settings** (under the "Configuration" section or "Email" tab depending on the UI version).
5. Toggle **"Enable Custom SMTP"** to **ON**.

### Enter SMTP Details (for Resend)

Fill in the fields with the following (or your provider's details):

- **Sender Email**: `onboarding@your-domain.com` (Must match the domain you verified)
- **Sender Name**: `NutriWell Support`
- **Host**: `smtp.resend.com`
- **Port**: `465`
- **Encryption**: `SSL` (or `TLS` if using port 587)
- **Username**: `resend`
- **Password**: `re_123456789...` (Paste your Resend API Key here)

### Enter SMTP Details (General)

If using another provider, find their "SMTP Integration" settings to get these values.

---

## Part 3: Testing & Verification

### Step 1: Send a Test Email
1. In the Supabase SMTP settings panel, look for a **"Test Connection"** or **"Send Test Email"** button (if available).
2. Enter your personal email address.
3. Check your inbox. If it arrives, you're golden! 🌟

### Step 2: Verify in App
1. Go to your live NutriWell app.
2. Try to **Sign Up** with a new email address (or use a "plus" address like `you+test1@gmail.com`).
3. Check if the confirmation email arrives instantly.
4. Check if the "From" address matches your domain (e.g., `onboarding@nutriwell-app.com`).

---

## 🐛 Troubleshooting

### "AuthApiError: Rate limit exceeded"
- **Cause**: You are still using the default Supabase email service.
- **Fix**: Ensure "Enable Custom SMTP" is toggled ON and your credentials are saved.

### Emails going to Spam
- **Cause**: DNS records (SPF/DKIM) are not propagated or incorrect.
- **Fix**: Go back to your Email Provider's dashboard (e.g., Resend) and check the "Domains" tab. Ensure all records have a green "Verified" status.

### "Connection timed out"
- **Cause**: Wrong port or encryption setting.
- **Fix**:
  - Try Port `465` with `SSL`
  - Try Port `587` with `TLS`
  - Try Port `25` (not recommended, often blocked)

---

## 🔒 Security Note

- **Never** commit your SMTP password/API keys to GitHub.
- Supabase stores these securely for you.
- If you need to rotate keys, generate a new one in Resend and update Supabase immediately.
