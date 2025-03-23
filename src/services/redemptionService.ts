
import { supabase } from "@/integrations/supabase/client";
import { RedemptionRequest } from "@/lib/types";

// Get total redeemed points for a user
export const getRedeemedPoints = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from('redemption_requests')
      .select('points_amount')
      .eq('user_id', userId)
      .eq('status', 'APPROVED');
    
    if (error) throw error;
    
    // Sum up all the redeemed points
    return data?.reduce((sum, item) => sum + item.points_amount, 0) || 0;
  } catch (error) {
    console.error("Error getting redeemed points:", error);
    return 0;
  }
};

// Create a new redemption request
export const createRedemptionRequest = async (
  userId: string,
  pointsAmount: number,
  redemptionType: "CASH" | "GIFT_VOUCHER",
  paymentDetails?: any
): Promise<RedemptionRequest | null> => {
  try {
    const { data, error } = await supabase
      .from('redemption_requests')
      .insert({
        user_id: userId,
        points_amount: pointsAmount,
        redemption_type: redemptionType,
        payment_details: paymentDetails,
        status: 'PENDING'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      userId: data.user_id,
      pointsAmount: data.points_amount,
      redemptionType: data.redemption_type as "CASH" | "GIFT_VOUCHER",
      status: data.status as "PENDING" | "APPROVED" | "REJECTED",
      paymentDetails: data.payment_details,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  } catch (error) {
    console.error("Error creating redemption request:", error);
    return null;
  }
};

// Get all redemption requests for a user
export const getUserRedemptionRequests = async (
  userId: string
): Promise<RedemptionRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('redemption_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      pointsAmount: item.points_amount,
      redemptionType: item.redemption_type as "CASH" | "GIFT_VOUCHER",
      status: item.status as "PENDING" | "APPROVED" | "REJECTED",
      paymentDetails: item.payment_details,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  } catch (error) {
    console.error("Error getting user redemption requests:", error);
    return [];
  }
};

// Get redemption items (rewards)
export const getRedemptionItems = async () => {
  try {
    // For now, we'll return mock data from the components
    // In the future, we'll implement the actual database call
    return [];
  } catch (error) {
    console.error("Error getting redemption items:", error);
    return [];
  }
};
