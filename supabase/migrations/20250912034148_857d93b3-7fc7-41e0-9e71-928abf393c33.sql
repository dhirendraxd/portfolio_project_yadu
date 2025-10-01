-- Update RLS policy for blog posts to allow admin operations
DROP POLICY IF EXISTS "Only authenticated users can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Only authenticated users can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Only authenticated users can delete blog posts" ON public.blog_posts;

-- Create new policies that allow both authenticated users and service role
CREATE POLICY "Allow admin and authenticated users to insert blog posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL OR auth.role() = 'service_role');

CREATE POLICY "Allow admin and authenticated users to update blog posts" 
ON public.blog_posts 
FOR UPDATE 
USING (auth.uid() IS NOT NULL OR auth.role() = 'service_role');

CREATE POLICY "Allow admin and authenticated users to delete blog posts" 
ON public.blog_posts 
FOR DELETE 
USING (auth.uid() IS NOT NULL OR auth.role() = 'service_role');