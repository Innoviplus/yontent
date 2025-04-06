
-- Check if avatars bucket exists and create it if it doesn't
DO $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'avatars'
  ) INTO bucket_exists;
  
  IF NOT bucket_exists THEN
    INSERT INTO storage.buckets (id, name, public, avif_autodetection)
    VALUES ('avatars', 'avatars', true, false);
    
    -- Create policy to allow anyone to read from avatars bucket
    CREATE POLICY "Public Read Access"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'avatars');
    
    -- Create policy to allow authenticated users to upload to avatars bucket
    CREATE POLICY "Auth Users Upload Access"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);
      
    -- Create policy to allow users to update their own avatar
    CREATE POLICY "Auth Users Update Access"
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'avatars' AND auth.uid() = owner);
      
    -- Create policy to allow users to delete their own avatar
    CREATE POLICY "Auth Users Delete Access"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'avatars' AND auth.uid() = owner);
  END IF;
END $$;
