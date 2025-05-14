
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
      .update({ points: newPointsTotal, updated_at: new Date().toISOString() })
      .eq('id', userId);
    
    if (pointsError) {
      console.error('Error updating user points:', pointsError);
      throw pointsError;
    }
    
    // Include the source information in the description
    const fullDescription = sourceId 
      ? `${description} [${source}:${sourceId}]`
      : `${description} [${source}]`;
    
    // Call the create_point_transaction function with the correct parameter names
    const { data: transactionData, error: transactionError } = await supabase.rpc(
      'create_point_transaction',
      {
        p_user_id: userId,
        p_amount: pointsAmount,
        p_type: 'REDEEMED',
        p_description: fullDescription
      }
    );
    
    if (transactionError) {
      console.error('Error creating transaction record:', transactionError);
      console.error('Transaction error details:', JSON.stringify(transactionError));
      
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
    console.log('Transaction data:', transactionData);
    
    return { success: true, newPointsTotal };
  } catch (error: any) {
    console.error('Error in deductPointsFromUser:', error);
    return { success: false, error: error.message };
  }
};
