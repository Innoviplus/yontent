
-- Grant execute permission on admin_add_point_transaction to authenticated users
GRANT EXECUTE ON FUNCTION public.admin_add_point_transaction TO authenticated;

-- Create index on point_transactions for better performance
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_id ON public.point_transactions(user_id);

-- Update or create RLS policy for point_transactions table to allow admin users to insert
CREATE POLICY IF NOT EXISTS "Admin users can manage point transactions" 
ON public.point_transactions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'ADMIN'
  )
);

-- Enable RLS on point_transactions table if not already enabled
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
