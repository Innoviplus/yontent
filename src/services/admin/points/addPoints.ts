
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

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
    
    // Calculate new points total
    const newPointsTotal = currentPoints + amount;
    console.log("New points total:", newPointsTotal);
    
    // IMPORTANT: First update user's points in the profiles table
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ points: newPointsTotal, updated_at: new Date().toISOString() })
      .eq('id', userId);
      
    if (updateError) {
      console.error("Error updating user points:", updateError);
      throw updateError;
    }
    
    console.log("Successfully updated user points to:", newPointsTotal);
    
    // Then create transaction record
    console.log("Calling admin_add_point_transaction with parameters:", {
      p_user_id: userId,
      p_amount: amount,
      p_type: type,
      p_description: description
    });
    
    // Call the admin_add_point_transaction function with the correct parameter names
    const { data: transactionData, error: transactionError } = await supabase.rpc(
      'admin_add_point_transaction',
      {
        p_user_id: userId,
        p_amount: amount,
        p_type: type,
        p_description: description
      }
    );
    
    if (transactionError) {
      console.error("Error creating transaction record:", transactionError);
      console.error("Transaction error details:", JSON.stringify(transactionError));
      
      // If transaction creation fails, try to revert the points update
      try {
        await supabase
          .from('profiles')
          .update({ points: currentPoints, updated_at: new Date().toISOString() })
          .eq('id', userId);
        console.log("Points update reverted due to transaction error");
      } catch (revertError) {
        console.error("Error reverting points update:", revertError);
      }
      
      throw transactionError;
    }
    
    console.log("Transaction recorded successfully:", transactionData);
    
    // Return the new points total for UI updates
    return { success: true, newPointsTotal };
    
  } catch (error: any) {
    console.error("Error in addPointsToUser:", error);
    console.error("Error details:", error.message, error.code, error.details, error.hint);
    return { success: false, error: error.message };
  }
};
