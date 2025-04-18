
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Adds points to a user by directly updating their profile
 */
export const addPointsToUser = async (
  userId: string, 
  amount: number, 
  type: 'EARNED' | 'ADJUSTED',
  description: string
) => {
  try {
    console.log("Adding points to user:", userId, "Amount:", amount);
    
    // Fetch the current user points from profiles
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();
      
    if (userError) {
      console.error("Error fetching user profile:", userError);
      throw userError;
    }
    
    if (!user) {
      const errorMsg = "User profile not found";
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    // Ensure points is a number, defaulting to 0 if null
    const currentPoints = user.points || 0;
    console.log("Current user points:", currentPoints);
    
    // Update user's points directly in the profiles table
    const newPointsTotal = currentPoints + amount;
    console.log("New points total:", newPointsTotal);
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ points: newPointsTotal })
      .eq('id', userId);
      
    if (updateError) {
      console.error("Error updating user points:", updateError);
      throw updateError;
    }
    
    console.log("Successfully updated user points to:", newPointsTotal);
    
    // Return the new points total for UI updates
    return { success: true, newPointsTotal };
    
  } catch (error: any) {
    console.error("Error in addPointsToUser:", error.message, error);
    return { success: false, error: error.message };
  }
};
