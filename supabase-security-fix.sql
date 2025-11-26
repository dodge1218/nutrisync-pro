-- Security Fixes for Supabase Functions
-- Run this in your Supabase SQL Editor to fix the "mutable search_path" warnings

-- 1. Fix handle_new_user security
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, username)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'username')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Fix get_email_by_username security
CREATE OR REPLACE FUNCTION public.get_email_by_username(username_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  found_email TEXT;
BEGIN
  SELECT email INTO found_email
  FROM public.user_profiles
  WHERE username = username_input;
  
  RETURN found_email;
END;
$$;

-- 3. Fix update_updated_at_column security
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

SELECT 'Security patches applied successfully! 🛡️' as status;
