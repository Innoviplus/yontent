
-- Function to award welcome points when a user updates their profile for the first time
CREATE OR REPLACE FUNCTION public.award_welcome_points_on_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  has_welcome_points BOOLEAN;
BEGIN
  -- Only run when a profile is updated (not when created)
  -- Check if this is a real update with changed data (not just timestamps)
  IF TG_OP = 'UPDATE' AND (
     NEW.first_name IS NOT NULL OR 
     NEW.last_name IS NOT NULL OR 
     NEW.bio IS NOT NULL OR
     NEW.gender IS NOT NULL
  ) THEN
    
    -- Check if the user has already received welcome points
    SELECT EXISTS (
      SELECT 1 FROM point_transactions
      WHERE user_id_point = NEW.id
      AND type = 'WELCOME'
    ) INTO has_welcome_points;
    
    -- Only award points if user hasn't received welcome points yet
    IF NOT has_welcome_points THEN
      -- Update profile points
      NEW.points := COALESCE(NEW.points, 0) + 100;
      
      -- Insert welcome points transaction
      INSERT INTO point_transactions (
        user_id_point,
        amount,
        type,
        description
      ) VALUES (
        NEW.id,
        100,
        'WELCOME',
        'Welcome Bonus for completing your profile information'
      );
      
      RAISE NOTICE 'Welcome points (100) awarded to user %', NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create a trigger to run the award_welcome_points_on_update function
DROP TRIGGER IF EXISTS award_welcome_points_on_profile_update ON profiles;
CREATE TRIGGER award_welcome_points_on_profile_update
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.award_welcome_points_on_update();

-- Create a function to check and award welcome points for a specific user
CREATE OR REPLACE FUNCTION public.check_and_award_welcome_points(user_id_param UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  profile_exists BOOLEAN;
  has_welcome_points BOOLEAN;
  has_profile_info BOOLEAN;
  v_result JSONB;
BEGIN
  -- Check if profile exists
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = user_id_param
  ) INTO profile_exists;
  
  IF NOT profile_exists THEN
    v_result := jsonb_build_object(
      'success', false,
      'message', 'Profile not found'
    );
    RETURN v_result;
  END IF;
  
  -- Check if user already has welcome points
  SELECT EXISTS (
    SELECT 1 FROM point_transactions
    WHERE user_id_point = user_id_param
    AND type = 'WELCOME'
  ) INTO has_welcome_points;
  
  IF has_welcome_points THEN
    v_result := jsonb_build_object(
      'success', false,
      'message', 'Welcome points already awarded'
    );
    RETURN v_result;
  END IF;
  
  -- Check if profile has enough information to qualify for points
  SELECT 
    (first_name IS NOT NULL OR 
     last_name IS NOT NULL OR 
     bio IS NOT NULL OR 
     gender IS NOT NULL)
  INTO has_profile_info
  FROM profiles
  WHERE id = user_id_param;
  
  IF NOT has_profile_info THEN
    v_result := jsonb_build_object(
      'success', false,
      'message', 'Profile needs more information before points can be awarded'
    );
    RETURN v_result;
  END IF;
  
  -- Award points
  UPDATE profiles
  SET points = COALESCE(points, 0) + 100
  WHERE id = user_id_param;
  
  -- Create transaction record
  INSERT INTO point_transactions (
    user_id_point,
    amount,
    type,
    description
  ) VALUES (
    user_id_param,
    100,
    'WELCOME',
    'Welcome Bonus for completing your profile information'
  );
  
  v_result := jsonb_build_object(
    'success', true,
    'message', 'Welcome points awarded successfully',
    'points_awarded', 100
  );
  
  RETURN v_result;
END;
$$;
