
import { supabase } from '@/integrations/supabase/client';
import { logPointsTransaction } from './transactionLog';

/**
 * Deducts points from a user and logs the transaction
 */
export const deductPointsFromUser = async (
  userId: string, 
  pointsAmount: number,
  source: 'REDEMPTION' | 'ADMIN_ADJUSTMENT' | 'MISSION_REVIEW' | 'RECEIPT_SUBMISSION',
  description: string,
  sourceId?: string
): Promise<{ success: boolean; newPointsTotal?: number; error?: string }> => {
  try {
    console.log(`Deducting ${pointsAmount} points from user ${userId} (from ${source})`);
    
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
    
    // Ensure user has enough points
    const currentPoints = userData?.points || 0;
    if (currentPoints < pointsAmount) {
      const errorMsg = `User has insufficient points (${currentPoints}) to deduct ${pointsAmount}`;
      console.error(errorMsg);
      return { success: false, error: errorMsg };
    }
    
    // Calculate new points total
    const newPointsTotal = currentPoints - pointsAmount;
    
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
      'REDEEMED',
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
    console.error('Error in deductPointsFromUser:', error);
    return { success: false, error: error.message };
  }
};
