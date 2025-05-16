
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Transaction } from '@/types/transactions';

/**
 * Fetches point transactions from the database
 */
export const fetchPointTransactions = async (userId: string) => {
  console.log("Fetching point transactions for user:", userId);
  
  const { data, error } = await supabase
    .from("point_transactions")
    .select("*")
    .eq("user_id_point", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching point transactions:", error);
    throw error;
  }
  
  return data || [];
};

/**
 * Fetches redemption requests with their status and item names
 */
export const fetchRedemptionRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from("redemption_requests")
    .select(`
      *,
      redemption_items(name)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching redemption requests:", error);
    throw error;
  }
  
  return data || [];
};
