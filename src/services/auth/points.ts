
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Updates a user's points directly in the profile table and creates a transaction record
 */
export const updateUserPoints = async (
  userId: string, 
  points: number, 
  reason?: string
) => {
  try {
    console.log(`Updating user ${userId} points to ${points}`, reason ? `Reason: ${reason}` : '');
    
    // First check if the profile exists
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, points')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error("Error checking if profile exists:", profileError);
      return { error: profileError };
    }
    
    if (!profileData) {
      console.error("Profile not found");
      return { error: new Error("Profile not found") };
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
    return { error: null, data, oldPoints: profileData.points };
  } catch (error: any) {
    console.error("Exception updating user points:", error);
    return { error };
  }
};

/**
 * Creates a transaction record for points operations
 */
export const createPointTransaction = async (
  userId: string,
  amount: number,
  type: string,
  description: string
) => {
  try {
    console.log(`Creating point transaction record: ${userId}, ${amount}, ${type}, ${description}`);
    
    // Use the create_point_transaction function with the updated column name
    const { data, error } = await supabase.rpc(
      'create_point_transaction',
      {
        p_user_id: userId,
        p_amount: amount,
        p_type: type,
        p_description: description
      }
    );
    
    if (error) {
      console.error("Error creating transaction record:", error);
      return { error };
    }
    
    console.log("Transaction record created successfully:", data);
    return { error: null, data };
    
  } catch (error: any) {
    console.error("Exception creating transaction record:", error);
    return { error };
  }
};
