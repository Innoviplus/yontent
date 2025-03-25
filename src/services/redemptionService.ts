import { supabase } from "@/integrations/supabase/client";
import { RedemptionRequest } from "@/lib/types";
import { RedemptionItem } from "@/types/redemption";
import { mockRewards } from "@/utils/mockRewards";
import { deductPointsFromUser } from "@/hooks/admin/utils/points";

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
export const getRedemptionItems = async (): Promise<RedemptionItem[]> => {
  try {
    // Fetch redemption items from Supabase
    const { data, error } = await supabase
      .from('redemption_items')
      .select('*')
      .eq('is_active', true)
      .order('points_required', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No redemption items found in database, using mock data');
      return mockRewards;
    }
    
    // Map data to RedemptionItem interface
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      points_required: item.points_required,
      image_url: item.image_url,
      banner_image: item.banner_image,
      is_active: item.is_active,
      terms_conditions: item.terms_conditions,
      redemption_details: item.redemption_details,
      // Cast string to union type
      redemption_type: (item.redemption_type === 'CASH' ? 'CASH' : 'GIFT_VOUCHER') as 'GIFT_VOUCHER' | 'CASH'
    }));
  } catch (error) {
    console.error("Error getting redemption items:", error);
    // Return mock data as fallback
    return mockRewards;
  }
};
