
import { supabase } from '@/integrations/supabase/client';
import { logPointsTransaction } from './transactionLog';

/**
 * Returns points to a user (refund) and logs the transaction
 */
export const returnPointsToUser = async (
  userId: string, 
  pointsAmount: number,
  description = 'Points returned to user',
  sourceId?: string
): Promise<{ success: boolean; newPointsTotal?: number; error?: string }> => {
  try {
    console.log(`Returning ${pointsAmount} points to user ${userId}`);
    
    // First, get current user points
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();
      
    if (userError) {
      console.error('Error fetching user points:', userError);
      throw userError;
    }
    
    // Calculate new points total
    const currentPoints = userData?.points || 0;
    const newPointsTotal = currentPoints + pointsAmount;
    
    // Update user points
    const { error: pointsError } = await supabase
      .from('profiles')
      .update({ points: newPointsTotal })
      .eq('id', userId);
    
    if (pointsError) {
      console.error('Error updating user points:', pointsError);
      throw pointsError;
    }
    
    // Log the transaction if successful
    const transactionResult = await logPointsTransaction(
      userId,
      pointsAmount,
      'REFUNDED',
      'REDEMPTION',
      description,
      sourceId
    );
    
    if (!transactionResult.success) {
      console.error('Failed to log refund transaction:', transactionResult.error);
    }
    
    console.log(`Successfully updated user points from ${currentPoints} to ${newPointsTotal}`);
    
    return { success: true, newPointsTotal };
  } catch (error: any) {
    console.error('Error in returnPointsToUser:', error);
    return { success: false, error: error.message };
  }
};
