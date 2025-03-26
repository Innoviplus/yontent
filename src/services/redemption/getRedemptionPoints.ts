
import { supabase } from "@/integrations/supabase/client";

// Since we removed the redemption_requests table, we'll provide a mock implementation
export const getRedeemedPoints = async (userId: string): Promise<number> => {
  try {
    console.log('Getting redeemed points for user:', userId);
    
    // Pretend there are no redeemed points
    return 0;
  } catch (error) {
    console.error("Error getting redeemed points:", error);
    return 0;
  }
};
