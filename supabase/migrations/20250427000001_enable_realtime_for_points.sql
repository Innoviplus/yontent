
-- Enable replica identity full for profiles table to capture changes for realtime
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add profiles table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Add point_transactions table to the realtime publication for monitoring new transactions
ALTER TABLE public.point_transactions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.point_transactions;
