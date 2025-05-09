
import { supabase } from '@/integrations/supabase/client';

export const updateUserPoints = async (userId: string, points: number) => {
  try {
    console.log(`Updating user ${userId} points to ${points}`);
    
    // First check if the profile exists
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
      
    if (profileError || !profileData) {
      console.error("Error checking if profile exists:", profileError);
      return { error: profileError || new Error("Profile not found") };
    }
    
    // Update the points
    const { data, error } = await supabase
      .from('profiles')
      .update({ points, updated_at: new Date().toISOString() })
      .eq('id', userId);
      
    if (error) {
      console.error("Error updating user points:", error);
      return { error };
    }
    
    console.log("Points update successful:", data);
    return { error: null, data };
  } catch (error: any) {
    console.error("Exception updating user points:", error);
    return { error };
  }
};
