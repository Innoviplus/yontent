
import { supabase } from '@/integrations/supabase/client';

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
    
    // Create the full description with source info
    const fullDescription = sourceId
      ? `${description} [REDEMPTION:${sourceId}]`
      : `${description} [REDEMPTION]`;
    
    // Call the create_point_transaction function
    const { data: transactionData, error: transactionError } = await supabase.rpc(
      'create_point_transaction',
      {
        p_user_id: userId,
        p_amount: pointsAmount,
        p_type: 'REFUNDED',
        p_description: fullDescription
      }
    );
    
    if (transactionError) {
      console.error('Error creating refund transaction:', transactionError);
      console.error('Transaction error details:', JSON.stringify(transactionError));
      
      // If transaction logging fails, try to revert the points
      try {
        await supabase
          .from('profiles')
          .update({ points: currentPoints })
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
    console.error('Error in returnPointsToUser:', error);
    return { success: false, error: error.message };
  }
};
