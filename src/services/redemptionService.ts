
import { supabase } from "@/integrations/supabase/client";
import { RedemptionRequest } from "@/lib/types";

// Get total redeemed points for a user
export const getRedeemedPoints = async (userId: string): Promise<number> => {
  try {
    // For now, return 0 as we haven't implemented redemption_requests table yet
    return 0;
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
    // For now, just return a mock successful response
    // In the future, we'll implement the actual database interaction
    return {
      id: "mock-id-" + Date.now(),
      userId,
      pointsAmount,
      redemptionType,
      status: "PENDING",
      paymentDetails,
      createdAt: new Date(),
      updatedAt: new Date()
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
    // For now, return an empty array
    return [];
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
