-- Add new fields to social_media_posts table
ALTER TABLE public.social_media_posts 
ADD COLUMN post_title text,
ADD COLUMN mentions text[];

-- Add comments for the new columns
COMMENT ON COLUMN public.social_media_posts.post_title IS 'Title or name for the social media post';
COMMENT ON COLUMN public.social_media_posts.mentions IS 'Array of mentioned users/organizations in the post';