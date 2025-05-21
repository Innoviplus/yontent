
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
      console.log("Updating start date to:", startDate.toISOString());
      updateData.start_date = startDate.toISOString();
    }
    
    // Handle expiry date (can be updated or removed)
    if (expiryDate === null) {
      console.log("Removing expiry date");
      updateData.expires_at = null; // Remove expiry date
    } else if (expiryDate) {
      console.log("Updating expiry date to:", expiryDate.toISOString());
      updateData.expires_at = expiryDate.toISOString();
    }
    
    // Only proceed if we have updates
    if (Object.keys(updateData).length === 0) {
      console.log("No date updates to perform");
      return false;
    }

    console.log('Updating mission dates with:', updateData);

    const { error } = await supabase
      .from('missions')
      .update(updateData)
      .eq('id', missionId);

    if (error) {
      console.error("Supabase error:", error);
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
