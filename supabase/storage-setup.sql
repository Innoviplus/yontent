
-- This file contains SQL to set up storage buckets, but it won't be executed automatically.
-- You'll need to run this SQL in the Supabase SQL editor.

-- Create a storage bucket for reward images if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'rewards',
  'Reward Images',
  true,
  5242880, -- 5MB limit
  '{image/png,image/jpeg,image/gif,image/webp}'
)
ON CONFLICT (id) DO NOTHING;

-- Set up a policy to allow public read access to the bucket
CREATE POLICY "Allow public read access for rewards"
ON storage.objects
FOR SELECT
USING (bucket_id = 'rewards');

-- Set up a policy to allow authenticated users to insert new images
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'rewards' AND auth.role() = 'authenticated');

-- Set up a policy to allow users who created an image to update or delete it
CREATE POLICY "Allow users to update their own images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'rewards' AND auth.uid() = owner);

CREATE POLICY "Allow users to delete their own images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'rewards' AND auth.uid() = owner);
