
-- Update the create_point_transaction function to use the correct user_id_point column
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
    user_id_point,  -- Using the renamed column
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
    user_id_point,  -- Using the renamed column
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

-- Make sure execute permissions are granted
GRANT EXECUTE ON FUNCTION public.create_point_transaction TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_add_point_transaction TO authenticated;
