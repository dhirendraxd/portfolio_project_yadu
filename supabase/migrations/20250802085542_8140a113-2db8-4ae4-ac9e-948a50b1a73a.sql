-- Add RLS policies to allow CMS operations on portfolio_items table
-- For now, we'll allow anonymous users to perform all operations
-- This can be restricted later when authentication is implemented

-- Allow inserting portfolio items
CREATE POLICY "Allow inserting portfolio items" 
ON public.portfolio_items 
FOR INSERT 
WITH CHECK (true);

-- Allow updating portfolio items  
CREATE POLICY "Allow updating portfolio items" 
ON public.portfolio_items 
FOR UPDATE 
USING (true);

-- Allow deleting portfolio items
CREATE POLICY "Allow deleting portfolio items" 
ON public.portfolio_items 
FOR DELETE 
USING (true);

-- Also add similar policies for other CMS tables for future use

-- Blog posts policies
CREATE POLICY "Allow inserting blog posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow updating blog posts" 
ON public.blog_posts 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow deleting blog posts" 
ON public.blog_posts 
FOR DELETE 
USING (true);

-- Impact stats policies  
CREATE POLICY "Allow inserting impact stats" 
ON public.impact_stats 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow updating impact stats" 
ON public.impact_stats 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow deleting impact stats" 
ON public.impact_stats 
FOR DELETE 
USING (true);

-- Testimonials policies
CREATE POLICY "Allow inserting testimonials" 
ON public.testimonials 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow updating testimonials" 
ON public.testimonials 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow deleting testimonials" 
ON public.testimonials 
FOR DELETE 
USING (true);

-- Site settings policies
CREATE POLICY "Allow inserting site settings" 
ON public.site_settings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow updating site settings" 
ON public.site_settings 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow deleting site settings" 
ON public.site_settings 
FOR DELETE 
USING (true);