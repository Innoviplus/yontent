
-- Create point_transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id_point UUID NOT NULL,
  amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  type TEXT NOT NULL,
  description TEXT NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own transactions
CREATE POLICY IF NOT EXISTS "Users can view their own transactions" 
ON public.point_transactions 
FOR SELECT 
USING (auth.uid() = user_id_point);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_id ON public.point_transactions(user_id_point);

-- Create realtime replication for point transactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.point_transactions;

-- Make sure the table is fully identifiable for realtime
ALTER TABLE public.point_transactions REPLICA IDENTITY FULL;
