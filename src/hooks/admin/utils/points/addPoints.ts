
import { supabase } from '@/integrations/supabase/client';
import { logPointsTransaction } from './transactionLog';

/**
 * Adds points to a user and logs the transaction
 */
export const addPointsToUser = async (
  userId: string, 
  pointsAmount: number,
  type: 'EARNED' | 'REFUNDED' | 'ADJUSTED',
  source: 'MISSION_REVIEW' | 'RECEIPT_SUBMISSION' | 'REDEMPTION' | 'ADMIN_ADJUSTMENT',
  description: string,
  sourceId?: string
): Promise<{ success: boolean; newPointsTotal?: number; error?: string }> => {
  try {
    console.log(`Adding ${pointsAmount} points to user ${userId} (${type} from ${source})`);
    
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
    
    // Update user points in a transaction
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
      type,
      source,
      description,
      sourceId
    );
    
    if (!transactionResult.success) {
      console.error('Failed to log transaction:', transactionResult.error);
    }
    
    console.log(`Successfully updated user points from ${currentPoints} to ${newPointsTotal}`);
    
    return { success: true, newPointsTotal };
  } catch (error: any) {
    console.error('Error in addPointsToUser:', error);
    return { success: false, error: error.message };
  }
};
