-- Drop existing policies for blog-images
DROP POLICY IF EXISTS "Blog images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;

-- Create new storage policies for blog images with better authentication
CREATE POLICY "Anyone can view blog images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can update their blog images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'blog-images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can delete their blog images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'blog-images' 
  AND auth.uid() IS NOT NULL
);