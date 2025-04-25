
import { supabase } from '@/integrations/supabase/client';

// Get all redemption requests for a user
export const getUserRedemptionRequests = async (userId: string, page = 1, limit = 10) => {
  try {
    const { data, error, count } = await supabase
      .from('redemption_requests')
      .select('*, item:item_id(name)', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);
      
    if (error) {
      throw error;
    }
    
    return { 
      requests: data || [], 
      totalCount: count || 0 
    };
  } catch (error) {
    console.error('Error getting user redemption requests:', error);
    return { requests: [], totalCount: 0 };
  }
};
