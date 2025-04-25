
-- Create an admin function to add point transactions (bypassing RLS)
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
  -- Insert the transaction record
  INSERT INTO public.point_transactions(
    user_id,
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.admin_add_point_transaction TO authenticated;

-- Add comment to explain function purpose
COMMENT ON FUNCTION public.admin_add_point_transaction IS 'Admin function to add point transactions, bypassing RLS policies';
