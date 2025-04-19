
-- Update the handle_new_user function to properly capture phone number and email
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
    10,  -- Start with 10 points as welcome bonus
    NOW(),
    NOW()
  );

  -- Add a transaction record for the welcome bonus points (only once per user)
  INSERT INTO public.point_transactions (
    user_id,
    amount,
    type,
    description
  )
  VALUES (
    NEW.id,
    10,
    'WELCOME',
    'Welcome Bonus'
  );
  
  RETURN NEW;
END;
$$;

