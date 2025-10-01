-- Fix critical security vulnerability: Restrict write operations to authenticated users only
-- Keep read operations public for content visibility

-- Portfolio items: Secure write operations
DROP POLICY IF EXISTS "Allow inserting portfolio items" ON public.portfolio_items;
DROP POLICY IF EXISTS "Allow updating portfolio items" ON public.portfolio_items;
DROP POLICY IF EXISTS "Allow deleting portfolio items" ON public.portfolio_items;

CREATE POLICY "Only authenticated users can insert portfolio items" 
ON public.portfolio_items 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update portfolio items" 
ON public.portfolio_items 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Only authenticated users can delete portfolio items" 
ON public.portfolio_items 
FOR DELETE 
TO authenticated
USING (true);

-- Blog posts: Secure write operations
DROP POLICY IF EXISTS "Allow inserting blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow updating blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow deleting blog posts" ON public.blog_posts;

CREATE POLICY "Only authenticated users can insert blog posts" 
ON public.blog_posts 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update blog posts" 
ON public.blog_posts 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Only authenticated users can delete blog posts" 
ON public.blog_posts 
FOR DELETE 
TO authenticated
USING (true);

-- Testimonials: Secure write operations
DROP POLICY IF EXISTS "Allow inserting testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow updating testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow deleting testimonials" ON public.testimonials;

CREATE POLICY "Only authenticated users can insert testimonials" 
ON public.testimonials 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update testimonials" 
ON public.testimonials 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Only authenticated users can delete testimonials" 
ON public.testimonials 
FOR DELETE 
TO authenticated
USING (true);

-- Impact stats: Secure write operations
DROP POLICY IF EXISTS "Allow inserting impact stats" ON public.impact_stats;
DROP POLICY IF EXISTS "Allow updating impact stats" ON public.impact_stats;
DROP POLICY IF EXISTS "Allow deleting impact stats" ON public.impact_stats;

CREATE POLICY "Only authenticated users can insert impact stats" 
ON public.impact_stats 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update impact stats" 
ON public.impact_stats 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Only authenticated users can delete impact stats" 
ON public.impact_stats 
FOR DELETE 
TO authenticated
USING (true);

-- Social media posts: Secure write operations
DROP POLICY IF EXISTS "Allow inserting social media posts" ON public.social_media_posts;
DROP POLICY IF EXISTS "Allow updating social media posts" ON public.social_media_posts;
DROP POLICY IF EXISTS "Allow deleting social media posts" ON public.social_media_posts;

CREATE POLICY "Only authenticated users can insert social media posts" 
ON public.social_media_posts 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update social media posts" 
ON public.social_media_posts 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Only authenticated users can delete social media posts" 
ON public.social_media_posts 
FOR DELETE 
TO authenticated
USING (true);

-- Site settings: Secure write operations
DROP POLICY IF EXISTS "Allow inserting site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow updating site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow deleting site settings" ON public.site_settings;

CREATE POLICY "Only authenticated users can insert site settings" 
ON public.site_settings 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update site settings" 
ON public.site_settings 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Only authenticated users can delete site settings" 
ON public.site_settings 
FOR DELETE 
TO authenticated
USING (true);