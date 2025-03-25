
import { supabase } from "@/integrations/supabase/client";
import { addPointsToUser } from './addPoints';

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
