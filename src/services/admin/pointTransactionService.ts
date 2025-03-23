
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Adds points to a user and creates a transaction record
 */
export const addPointsToUser = async (
  userId: string, 
  amount: number, 
  type: 'EARNED' | 'ADJUSTED',
  description: string
) => {
  try {
    console.log("Adding points to user:", userId, "Amount:", amount);
    
    // First, fetch the current user points from profiles
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
    
    // Add the point transaction first
    const { data: transaction, error: transactionError } = await supabase
      .from('point_transactions')
      .insert([{
        user_id: userId,
        amount: amount,
        type: type,
        source: 'ADMIN_ADJUSTMENT',
        description: description
      }])
      .select()
      .single();
      
    if (transactionError) {
      console.error("Error adding transaction:", transactionError);
      throw transactionError;
    }
    
    console.log("Transaction created:", transaction);
    
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
    return { success: true, newPointsTotal, transaction };
    
  } catch (error: any) {
    console.error("Error in addPointsToUser:", error.message, error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetches all users with their points information
 */
export const fetchUsersWithPoints = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar, points')
      .order('username', { ascending: true });
      
    if (error) {
      console.error("Error fetching users with points:", error);
      throw error;
    }
    
    return data || [];
  } catch (error: any) {
    console.error("Error in fetchUsersWithPoints:", error);
    throw error;
  }
};

/**
 * Sets a user as super admin
 */
export const setUserAsSuperAdmin = async (userId: string) => {
  try {
    // First, get the current extended_data
    const { data: user, error: fetchError } = await supabase
      .from('profiles')
      .select('extended_data')
      .eq('id', userId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching user profile:", fetchError);
      throw fetchError;
    }
    
    if (!user) {
      throw new Error("User not found");
    }
    
    // Create a properly typed extended_data object
    let extendedData = {};
    
    if (user.extended_data && typeof user.extended_data === 'object' && !Array.isArray(user.extended_data)) {
      extendedData = { ...user.extended_data };
    }
    
    // Add admin flags to extended data
    extendedData = {
      ...extendedData,
      isAdmin: true,
      isSuperAdmin: true
    };
    
    console.log("Setting user as super admin:", userId, extendedData);
    
    // Update the user profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ extended_data: extendedData })
      .eq('id', userId);
      
    if (updateError) {
      console.error("Error updating user to super admin:", updateError);
      throw updateError;
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error in setUserAsSuperAdmin:", error.message, error);
    return { success: false, error: error.message };
  }
};

/**
 * Adds 100 points to specified user as a one-time setup
 */
export const addInitialPointsToUser = async (username: string) => {
  try {
    // First, find the user by username
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id, points')
      .eq('username', username)
      .single();
      
    if (userError) {
      console.error("Error finding user by username:", userError);
      throw userError;
    }
    
    if (!user) {
      throw new Error(`User '${username}' not found`);
    }
    
    // Now add 100 points to this user
    return await addPointsToUser(
      user.id,
      100,
      'ADJUSTED',
      'Initial 100 points bonus'
    );
  } catch (error: any) {
    console.error(`Error adding initial points to ${username}:`, error.message, error);
    return { success: false, error: error.message };
  }
};

/**
 * Adds a direct point transaction record to the database
 */
export const addPointTransaction = async (
  userId: string,
  amount: number,
  type: 'EARNED' | 'ADJUSTED' | 'REDEEMED' | 'REFUNDED',
  source: 'MISSION_REVIEW' | 'RECEIPT_SUBMISSION' | 'REDEMPTION' | 'ADMIN_ADJUSTMENT',
  description: string
) => {
  try {
    console.log("Adding point transaction record:", { userId, amount, type, source, description });
    
    const { data: transaction, error } = await supabase
      .from('point_transactions')
      .insert([{
        user_id: userId,
        amount: amount,
        type: type,
        source: source,
        description: description
      }])
      .select()
      .single();
      
    if (error) {
      console.error("Error adding point transaction record:", error);
      throw error;
    }
    
    console.log("Transaction record created:", transaction);
    
    return { success: true, transaction };
  } catch (error: any) {
    console.error("Error in addPointTransaction:", error.message, error);
    return { success: false, error: error.message };
  }
};
