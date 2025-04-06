
-- Function to get profile by ID, bypassing RLS
CREATE OR REPLACE FUNCTION public.get_profile_by_id(user_id_input UUID)
RETURNS SETOF profiles
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM profiles WHERE id = user_id_input;
$$;

-- Function to update avatar URL, bypassing RLS
CREATE OR REPLACE FUNCTION public.update_avatar_url(
  user_id_input UUID,
  avatar_url_input TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles 
  SET 
    avatar = avatar_url_input,
    updated_at = now()
  WHERE id = user_id_input;
END;
$$;

-- Function to insert profile with avatar, bypassing RLS
CREATE OR REPLACE FUNCTION public.insert_profile_with_avatar(
  user_id_input UUID,
  avatar_url_input TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (
    id,
    avatar,
    updated_at,
    created_at
  ) VALUES (
    user_id_input,
    avatar_url_input,
    now(),
    now()
  );
END;
$$;

-- Make sure avatars bucket exists
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
    INSERT INTO storage.policies (name, definition, bucket_id)
    VALUES (
      'Public Read Access',
      '(bucket_id = ''avatars''::text)',
      'avatars'
    );
    
    -- Create policy to allow authenticated users to upload to avatars bucket
    INSERT INTO storage.policies (name, definition, bucket_id)
    VALUES (
      'Individual User Upload Access',
      '(bucket_id = ''avatars''::text AND auth.uid() = owner)',
      'avatars'
    );
  END IF;
END $$;
