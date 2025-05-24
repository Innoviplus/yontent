
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Add points to a user with proper error handling
 */
export const addPointsToUser = async (
  userId: string,
  pointsAmount: number,
  transactionType: 'EARNED' | 'ADJUSTED' | 'DEDUCTED',
  description: string
): Promise<{ success: boolean; newPointsTotal?: number; error?: string }> => {
  try {
    console.log(`Adding ${pointsAmount} points to user ${userId}`);
    
    // Get current user points
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();
      
    if (userError) {
      console.error('Error fetching user points:', userError);
      throw userError;
    }
    
    if (!userData) {
      throw new Error('User profile not found');
    }
    
    // Calculate new points total
    const currentPoints = userData?.points || 0;
    const newPointsTotal = currentPoints + pointsAmount;
    
    // Update user points
    const { error: pointsError } = await supabase
      .from('profiles')
      .update({ points: newPointsTotal, updated_at: new Date().toISOString() })
      .eq('id', userId);
    
    if (pointsError) {
      console.error('Error updating user points:', pointsError);
      throw pointsError;
    }
    
    // Create transaction record
    const { data: transactionData, error: transactionError } = await supabase.rpc(
      'create_point_transaction',
      {
        p_user_id: userId,
        p_amount: pointsAmount,
        p_type: transactionType,
        p_description: description
      }
    );
    
    if (transactionError) {
      console.error('Error creating transaction record:', transactionError);
      // If transaction logging fails, try to revert the points
      try {
        await supabase
          .from('profiles')
          .update({ points: currentPoints, updated_at: new Date().toISOString() })
          .eq('id', userId);
        console.log('Points reverted due to transaction error');
      } catch (revertError) {
        console.error('Failed to revert points after transaction error:', revertError);
      }
      throw transactionError;
    }
    
    console.log(`Successfully updated user points from ${currentPoints} to ${newPointsTotal}`);
    return { success: true, newPointsTotal };
  } catch (error: any) {
    console.error('Error in addPointsToUser:', error);
    return { success: false, error: error.message };
  }
};
