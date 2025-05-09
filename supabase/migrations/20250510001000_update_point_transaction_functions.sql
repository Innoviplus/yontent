
-- Update the create_point_transaction function to use the renamed user_id_point column
CREATE OR REPLACE FUNCTION public.create_point_transaction(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT,
  p_description TEXT
) 
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_transaction_id UUID;
  v_result JSONB;
BEGIN
  -- Insert the transaction record with the renamed column
  INSERT INTO point_transactions(
    user_id_point,  -- Updated column name
    amount,
    type, 
    description
  ) VALUES (
    p_user_id,
    p_amount,
    p_type,
    p_description
  )
  RETURNING id INTO v_transaction_id;
  
  -- Return success response with the transaction ID
  v_result := jsonb_build_object(
    'success', true,
    'transaction_id', v_transaction_id
  );
  
  RETURN v_result;
END;
$$;

-- Also update the admin_add_point_transaction function
CREATE OR REPLACE FUNCTION public.admin_add_point_transaction(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT,
  p_description TEXT
) 
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_transaction_id UUID;
  v_result JSONB;
BEGIN
  -- Insert the transaction record with the renamed column
  INSERT INTO point_transactions(
    user_id_point,  -- Updated column name
    amount,
    type, 
    description
  ) VALUES (
    p_user_id,
    p_amount,
    p_type,
    p_description
  )
  RETURNING id INTO v_transaction_id;
  
  -- Return success response with the transaction ID
  v_result := jsonb_build_object(
    'success', true,
    'transaction_id', v_transaction_id
  );
  
  RETURN v_result;
END;
$$;

-- Update the handle_mission_approval function if it exists
CREATE OR REPLACE FUNCTION public.handle_mission_approval(p_participation_id uuid, p_status text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
  v_mission_info RECORD;
  v_user_id UUID;
  v_points_reward INTEGER;
  v_current_points INTEGER;
  v_new_points INTEGER;
  v_mission_type TEXT;
  v_mission_title TEXT;
  v_transaction_id UUID;
  v_result JSONB;
BEGIN
  -- Get participation, user_id and mission info
  SELECT 
    mp.user_id_p,
    m.points_reward,
    m.type,
    m.title
  INTO v_user_id, v_points_reward, v_mission_type, v_mission_title
  FROM mission_participations mp
  JOIN missions m ON mp.mission_id = m.id
  WHERE mp.id = p_participation_id;
  
  IF p_status = 'APPROVED' AND v_points_reward > 0 THEN
    -- Get current user points
    SELECT points INTO v_current_points
    FROM profiles
    WHERE id = v_user_id;
    
    -- Calculate new points total
    v_new_points := COALESCE(v_current_points, 0) + v_points_reward;
    
    -- Update user points
    UPDATE profiles
    SET points = v_new_points
    WHERE id = v_user_id;
    
    -- Create transaction record with the renamed column
    INSERT INTO point_transactions(
      user_id_point,  -- Updated column name
      amount,
      type,
      description
    ) VALUES (
      v_user_id,
      v_points_reward,
      'EARNED',
      'Earned from ' || v_mission_title || ' mission [' || 
      CASE WHEN v_mission_type = 'REVIEW' THEN 'MISSION_REVIEW' ELSE 'RECEIPT_SUBMISSION' END || ']'
    )
    RETURNING id INTO v_transaction_id;
  END IF;
  
  -- Update participation status
  UPDATE mission_participations
  SET status = p_status
  WHERE id = p_participation_id;
  
  -- Return success response
  v_result := jsonb_build_object(
    'success', true,
    'user_id', v_user_id,
    'points_awarded', v_points_reward,
    'new_points_total', v_new_points,
    'transaction_id', v_transaction_id
  );
  
  RETURN v_result;
END;
$$;

-- Ensure execute permissions are granted
GRANT EXECUTE ON FUNCTION public.create_point_transaction TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_add_point_transaction TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_mission_approval TO authenticated;
