
import { supabase } from "@/integrations/supabase/client";
import { RedemptionRequest } from "@/lib/types";

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
      adminNotes: item.admin_notes,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  } catch (error) {
    console.error("Error getting user redemption requests:", error);
    return [];
  }
};
