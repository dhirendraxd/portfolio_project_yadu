-- Add comprehensive blog enhancement fields
ALTER TABLE public.blog_posts 
ADD COLUMN IF NOT EXISTS custom_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS featured_image_url TEXT,
ADD COLUMN IF NOT EXISTS featured_image_alt TEXT,
ADD COLUMN IF NOT EXISTS categories TEXT[],
ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS word_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS schema_type TEXT DEFAULT 'BlogPosting',
ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS seo_focus_keyword TEXT,
ADD COLUMN IF NOT EXISTS internal_links TEXT[],
ADD COLUMN IF NOT EXISTS external_links TEXT[];

-- Create blog_categories table for better organization
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#forest',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on blog_categories
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_categories
CREATE POLICY "Blog categories are publicly readable" 
ON public.blog_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can insert blog categories" 
ON public.blog_categories 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update blog categories" 
ON public.blog_categories 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete blog categories" 
ON public.blog_categories 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  spam_score INTEGER DEFAULT 0,
  parent_comment_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on blog_comments
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_comments
CREATE POLICY "Approved comments are publicly readable" 
ON public.blog_comments 
FOR SELECT 
USING (approved = true);

CREATE POLICY "Anyone can insert comments" 
ON public.blog_comments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can update comments" 
ON public.blog_comments 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete comments" 
ON public.blog_comments 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_categories ON public.blog_posts USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_blog_posts_scheduled ON public.blog_posts(scheduled_publish_at) WHERE scheduled_publish_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON public.blog_comments(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_approved ON public.blog_comments(approved) WHERE approved = true;

-- Update blog posts RLS policy to handle scheduled posts
DROP POLICY IF EXISTS "Blog posts are publicly readable" ON public.blog_posts;
CREATE POLICY "Blog posts are publicly readable" 
ON public.blog_posts 
FOR SELECT 
USING (
  published = true 
  AND (scheduled_publish_at IS NULL OR scheduled_publish_at <= now())
);

-- Function to calculate word count and reading time
CREATE OR REPLACE FUNCTION public.calculate_blog_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate word count from content
  NEW.word_count = array_length(string_to_array(regexp_replace(NEW.content, '<[^>]+>', '', 'g'), ' '), 1);
  
  -- Calculate reading time (average 250 words per minute)
  NEW.reading_time = GREATEST(1, ROUND(NEW.word_count::numeric / 250));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic metrics calculation
DROP TRIGGER IF EXISTS calculate_blog_metrics_trigger ON public.blog_posts;
CREATE TRIGGER calculate_blog_metrics_trigger
  BEFORE INSERT OR UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_blog_metrics();

-- Insert some default categories
INSERT INTO public.blog_categories (name, slug, description, color) VALUES 
('Rural Development', 'rural-development', 'Articles about rural development and community engagement', '#forest'),
('Sustainability', 'sustainability', 'Environmental and sustainability topics', '#sage'),
('Research', 'research', 'Research insights and methodologies', '#coral'),
('Policy Analysis', 'policy-analysis', 'Policy reviews and analysis', '#earth-brown')
ON CONFLICT (slug) DO NOTHING;