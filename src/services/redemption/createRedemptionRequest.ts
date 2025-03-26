
import { supabase } from "@/integrations/supabase/client";
import { RedemptionRequest } from "@/lib/types";
import { deductPointsFromUser } from "@/hooks/admin/utils/points";

// Create a new redemption request
export const createRedemptionRequest = async (
  userId: string,
  pointsAmount: number,
  redemptionType: "CASH" | "GIFT_VOUCHER",
  paymentDetails?: any
): Promise<RedemptionRequest | null> => {
  try {
    console.log("Creating redemption request:", {
      userId,
      pointsAmount,
      redemptionType,
      paymentDetails
    });
    
    // Use the deductPointsFromUser utility to handle point deduction with transaction logging
    const pointsResult = await deductPointsFromUser(
      userId,
      pointsAmount,
      'REDEMPTION',
      `${redemptionType} redemption request`
    );
    
    if (!pointsResult.success) {
      throw new Error(pointsResult.error || "Failed to deduct points");
    }
    
    // Create the redemption request
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
    
    if (error) {
      console.error("Supabase error creating redemption request:", error);
      throw error;
    }
    
    console.log("Redemption request created successfully:", data);
    
    // Verify the data exists before processing
    if (!data) {
      throw new Error("No data returned from redemption request creation");
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      pointsAmount: data.points_amount,
      redemptionType: data.redemption_type as "CASH" | "GIFT_VOUCHER",
      status: data.status as "PENDING" | "APPROVED" | "REJECTED",
      paymentDetails: data.payment_details,
      adminNotes: data.admin_notes,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  } catch (error) {
    console.error("Error creating redemption request:", error);
    return null;
  }
};
