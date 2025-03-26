
import { supabase } from "@/integrations/supabase/client";

// Get total redeemed points for a user
export const getRedeemedPoints = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('redemption_requests')
      .select('points_amount')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Sum up all the redeemed points
    return data?.reduce((sum, item) => sum + item.points_amount, 0) || 0;
  } catch (error) {
    console.error("Error getting redeemed points:", error);
    return 0;
  }
};
