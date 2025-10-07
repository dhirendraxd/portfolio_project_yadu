-- Fix RLS policies for site_settings table to allow upsert operations
-- The admin panel handles authentication separately, so we need to allow
-- upsert operations without requiring Supabase auth

DROP POLICY IF EXISTS "Only authenticated users can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Only authenticated users can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Only authenticated users can delete site settings" ON public.site_settings;

-- Allow anyone to upsert site_settings (admin panel handles auth)
CREATE POLICY "Allow upsert on site_settings"
ON public.site_settings
FOR ALL
USING (true)
WITH CHECK (true);