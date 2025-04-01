
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Update a mission's expiry date
 */
export const updateMissionExpiryDate = async (
  missionId: string,
  expiryDate: Date
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('missions')
      .update({
        expires_at: expiryDate.toISOString()
      })
      .eq('id', missionId);

    if (error) {
      throw error;
    }

    toast.success("Mission expiry date updated successfully");
    return true;
  } catch (error: any) {
    console.error("Error updating mission expiry date:", error.message);
    toast.error("Failed to update mission expiry date");
    return false;
  }
};

// This functionality is now exposed as a utility function that can be explicitly called
// instead of being auto-executed
export const updateItoenMissionExpiry = async () => {
  try {
    // Get all missions to debug
    const { data: allMissions, error: listError } = await supabase
      .from('missions')
      .select('id, title, status');
    
    if (listError) {
      console.error("Error listing all missions:", listError.message);
      return;
    }
    
    // Get the mission ID for "Review ITOEN"
    const { data, error } = await supabase
      .from('missions')
      .select('id, title, status, expires_at')
      .eq('title', 'Review ITOEN')
      .single();

    if (error) {
      console.error("Error finding the Review ITOEN mission:", error.message);
      
      // Try creating a test mission if none exists
      if (error.code === 'PGRST116') { // No rows returned
        const { data: newData, error: createError } = await supabase
          .from('missions')
          .insert({
            title: 'Review ITOEN',
            description: 'Write a review about ITOEN products',
            points_reward: 100,
            type: 'REVIEW',
            status: 'ACTIVE',
            start_date: new Date().toISOString(),
            expires_at: new Date('2025-03-26T23:59:59').toISOString()
          })
          .select();
          
        if (createError) {
          console.error("Error creating test mission:", createError.message);
        } else {
          console.log("Created test mission:", newData);
        }
      }
      return;
    }

    console.log("Found mission:", data);

    if (data) {
      // Set expiry date to March 26, 2025
      const newExpiryDate = new Date('2025-03-26T23:59:59');
      const success = await updateMissionExpiryDate(data.id, newExpiryDate);
      
      if (success) {
        console.log("Successfully updated Review ITOEN mission expiry date to:", newExpiryDate.toISOString());
      }
    }
  } catch (err) {
    console.error("Unexpected error updating mission expiry date:", err);
  }
};
