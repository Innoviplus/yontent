
import { supabase } from "@/integrations/supabase/client";
import { RedemptionItem } from "@/types/redemption";
import { toast } from "sonner";

/**
 * Fetches all active redemption items from the database
 */
export const fetchRedemptionItems = async (): Promise<RedemptionItem[]> => {
  try {
    console.log("Fetching redemption items...");
    const { data, error } = await supabase
      .from('redemption_items')
      .select('*')
      .eq('is_active', true)
      .order('points_required', { ascending: true });

    if (error) {
      console.error("Error fetching redemption items:", error);
      throw error;
    }

    console.log("Loaded redemption items:", data);
    return data as RedemptionItem[];
  } catch (error: any) {
    console.error("Error fetching redemption items:", error.message);
    toast.error("Failed to load redemption options");
    return [];
  }
};

/**
 * Submits a redemption request
 */
export const submitRedemptionRequest = async (
  userId: string,
  itemId: string,
  pointsAmount: number,
  redemptionType: 'CASH' | 'GIFT_VOUCHER'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('redemption_requests')
      .insert({
        user_id: userId,
        points_amount: pointsAmount,
        redemption_type: redemptionType,
        status: 'PENDING'
      });

    if (error) {
      console.error("Error submitting redemption request:", error);
      throw error;
    }

    return true;
  } catch (error: any) {
    console.error("Error submitting redemption request:", error.message);
    toast.error("Failed to submit redemption request");
    return false;
  }
};
