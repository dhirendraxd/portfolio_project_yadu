-- Update RLS policy for blog_posts to allow authenticated users to see all posts
DROP POLICY IF EXISTS "Blog posts are publicly readable" ON blog_posts;

-- Allow public to read published posts
CREATE POLICY "Public can read published blog posts"
ON blog_posts
FOR SELECT
USING (
  (published = true AND (scheduled_publish_at IS NULL OR scheduled_publish_at <= now()))
  OR
  (auth.uid() IS NOT NULL)
);
