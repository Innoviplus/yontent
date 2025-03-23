
import { supabase } from "@/integrations/supabase/client";
import { RedemptionRequest } from "@/lib/types";

export const getRedeemedPoints = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from("redemption_requests")
      .select("points_amount")
      .eq("user_id", userId)
      .eq("status", "APPROVED");

    if (error) throw error;
    
    return data?.reduce((sum, item) => sum + item.points_amount, 0) || 0;
  } catch (error) {
    console.error("Error getting redeemed points:", error);
    return 0;
  }
};

export const createRedemptionRequest = async (
  userId: string,
  pointsAmount: number,
  redemptionType: "CASH" | "GIFT_VOUCHER",
  paymentDetails?: any
): Promise<RedemptionRequest | null> => {
  try {
    const { data, error } = await supabase
      .from("redemption_requests")
      .insert({
        user_id: userId,
        points_amount: pointsAmount,
        redemption_type: redemptionType,
        status: "PENDING",
        payment_details: paymentDetails,
      })
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error creating redemption request:", error);
    return null;
  }
};

export const getUserRedemptionRequests = async (
  userId: string
): Promise<RedemptionRequest[]> => {
  try {
    const { data, error } = await supabase
      .from("redemption_requests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error getting user redemption requests:", error);
    return [];
  }
};
