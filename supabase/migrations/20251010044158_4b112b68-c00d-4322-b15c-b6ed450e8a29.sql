-- Phase 1: Create Role-Based Authentication System

-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- 3. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- 5. Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Phase 2: Secure site_settings table

-- 6. Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow upsert on site_settings" ON public.site_settings;

-- 7. Create restrictive policies for site_settings
CREATE POLICY "Public can read non-sensitive settings"
ON public.site_settings
FOR SELECT
USING (
  key IN ('site_title', 'contact_email')
);

CREATE POLICY "Only admins can modify settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 8. Remove admin credentials from site_settings if they exist
DELETE FROM public.site_settings 
WHERE key IN ('admin_username', 'admin_password');

-- Phase 3: Fix blog_comments RLS policies

-- 9. Drop existing overly permissive policies
DROP POLICY IF EXISTS "Only authenticated users can update comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Only authenticated users can delete comments" ON public.blog_comments;

-- 10. Add author tracking column
ALTER TABLE public.blog_comments 
ADD COLUMN IF NOT EXISTS author_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 11. Create proper comment policies
CREATE POLICY "Users can update their own comments or admins can update any"
ON public.blog_comments
FOR UPDATE
TO authenticated
USING (
  auth.uid() = author_user_id OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Users can delete their own comments or admins can delete any"
ON public.blog_comments
FOR DELETE
TO authenticated
USING (
  auth.uid() = author_user_id OR public.has_role(auth.uid(), 'admin')
);

-- 12. Protect email addresses in comments
CREATE POLICY "Only admins can see comment author emails"
ON public.blog_comments
FOR SELECT
USING (
  approved = true AND (
    public.has_role(auth.uid(), 'admin') OR 
    author_email IS NULL
  )
);

-- Phase 4: Secure other tables with admin role checks

-- 13. Update blog_posts policies to use has_role
DROP POLICY IF EXISTS "Allow admin and authenticated users to delete blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow admin and authenticated users to insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow admin and authenticated users to update blog posts" ON public.blog_posts;

CREATE POLICY "Only admins can delete blog posts"
ON public.blog_posts
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert blog posts"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update blog posts"
ON public.blog_posts
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 14. Update portfolio_items policies
DROP POLICY IF EXISTS "Only authenticated users can delete portfolio items" ON public.portfolio_items;
DROP POLICY IF EXISTS "Only authenticated users can insert portfolio items" ON public.portfolio_items;
DROP POLICY IF EXISTS "Only authenticated users can update portfolio items" ON public.portfolio_items;

CREATE POLICY "Only admins can delete portfolio items"
ON public.portfolio_items
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert portfolio items"
ON public.portfolio_items
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update portfolio items"
ON public.portfolio_items
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 15. Update testimonials policies
DROP POLICY IF EXISTS "Only authenticated users can delete testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Only authenticated users can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Only authenticated users can update testimonials" ON public.testimonials;

CREATE POLICY "Only admins can delete testimonials"
ON public.testimonials
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert testimonials"
ON public.testimonials
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update testimonials"
ON public.testimonials
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 16. Update social_media_posts policies
DROP POLICY IF EXISTS "Only authenticated users can delete social media posts" ON public.social_media_posts;
DROP POLICY IF EXISTS "Only authenticated users can insert social media posts" ON public.social_media_posts;
DROP POLICY IF EXISTS "Only authenticated users can update social media posts" ON public.social_media_posts;

CREATE POLICY "Only admins can delete social media posts"
ON public.social_media_posts
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert social media posts"
ON public.social_media_posts
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update social media posts"
ON public.social_media_posts
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 17. Update impact_stats policies
DROP POLICY IF EXISTS "Only authenticated users can delete impact stats" ON public.impact_stats;
DROP POLICY IF EXISTS "Only authenticated users can insert impact stats" ON public.impact_stats;
DROP POLICY IF EXISTS "Only authenticated users can update impact stats" ON public.impact_stats;

CREATE POLICY "Only admins can delete impact stats"
ON public.impact_stats
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert impact stats"
ON public.impact_stats
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update impact stats"
ON public.impact_stats
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 18. Update blog_categories policies
DROP POLICY IF EXISTS "Only authenticated users can delete blog categories" ON public.blog_categories;
DROP POLICY IF EXISTS "Only authenticated users can insert blog categories" ON public.blog_categories;
DROP POLICY IF EXISTS "Only authenticated users can update blog categories" ON public.blog_categories;

CREATE POLICY "Only admins can delete blog categories"
ON public.blog_categories
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert blog categories"
ON public.blog_categories
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update blog categories"
ON public.blog_categories
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));