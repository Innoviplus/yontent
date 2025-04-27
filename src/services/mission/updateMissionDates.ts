
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Update a mission's start and expiry dates
 */
export const updateMissionDates = async (
  missionId: string,
  startDate?: Date,
  expiryDate?: Date | null
): Promise<boolean> => {
  try {
    // Prepare update object
    const updateData: any = {};
    
    // Only add fields that have values
    if (startDate) {
      updateData.start_date = startDate.toISOString();
    }
    
    // Handle expiry date (can be updated or removed)
    if (expiryDate === null) {
      updateData.expires_at = null; // Remove expiry date
    } else if (expiryDate) {
      updateData.expires_at = expiryDate.toISOString();
    }
    
    // Only proceed if we have updates
    if (Object.keys(updateData).length === 0) {
      return false;
    }

    const { error } = await supabase
      .from('missions')
      .update(updateData)
      .eq('id', missionId);

    if (error) {
      throw error;
    }

    toast.success("Mission dates updated successfully");
    return true;
  } catch (error: any) {
    console.error("Error updating mission dates:", error.message);
    toast.error("Failed to update mission dates");
    return false;
  }
};

// Export the function for updating just the expiry date
export const updateMissionExpiryDate = async (
  missionId: string,
  expiryDate: Date | null
): Promise<boolean> => {
  return updateMissionDates(missionId, undefined, expiryDate);
};
