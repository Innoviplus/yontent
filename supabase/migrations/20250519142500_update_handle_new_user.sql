
-- Update the handle_new_user function to properly capture phone number and email
-- and explicitly set points to 0
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    username, 
    email,
    phone_number,
    phone_country_code,
    points,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'username', 
    NEW.email,
    NEW.raw_user_meta_data->>'phone_number',
    COALESCE(NEW.raw_user_meta_data->>'phone_country_code', '+'),
    0,  -- Explicitly set points to 0
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$;
