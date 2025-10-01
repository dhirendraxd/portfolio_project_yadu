-- Create social media posts table
CREATE TABLE public.social_media_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  content TEXT NOT NULL,
  post_url TEXT,
  image_url TEXT,
  posted_at TIMESTAMP WITH TIME ZONE,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.social_media_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Social media posts are publicly readable" 
ON public.social_media_posts 
FOR SELECT 
USING (true);

CREATE POLICY "Allow inserting social media posts" 
ON public.social_media_posts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow updating social media posts" 
ON public.social_media_posts 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow deleting social media posts" 
ON public.social_media_posts 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_social_media_posts_updated_at
BEFORE UPDATE ON public.social_media_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();