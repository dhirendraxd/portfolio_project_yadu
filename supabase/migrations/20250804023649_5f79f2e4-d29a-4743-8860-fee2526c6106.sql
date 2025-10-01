-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete portfolio images" ON storage.objects;

-- Create more permissive policies for the admin panel
CREATE POLICY "Allow portfolio image uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-images');

CREATE POLICY "Allow portfolio image updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-images');

CREATE POLICY "Allow portfolio image deletion"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-images');

-- Keep the existing public read policy
-- (This should already exist from before)