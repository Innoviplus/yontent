
import { supabase } from '@/integrations/supabase/client';
import { logPointsTransaction } from './transactionLog';
import { toast } from 'sonner';

/**
 * Adds points to a user and logs the transaction
 */
export const addPointsToUser = async (
  userId: string, 
  pointsAmount: number,
  type: 'EARNED' | 'REFUNDED' | 'ADJUSTED' | 'DEDUCTED',
  source: 'MISSION_REVIEW' | 'RECEIPT_SUBMISSION' | 'REDEMPTION' | 'ADMIN_ADJUSTMENT',
  description: string,
  sourceId?: string
): Promise<{ success: boolean; newPointsTotal?: number; error?: string }> => {
  try {
    console.log(`Adding ${pointsAmount} points to user ${userId} (${type} from ${source})`);
    
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
    
    console.log('Calling admin_add_point_transaction with parameters:', {
      p_user_id: userId,
      p_amount: pointsAmount,
      p_type: type,
      p_description: description
    });
    
    // Use the admin_add_point_transaction RPC function with explicit parameter names
    const { data: transactionData, error: transactionError } = await supabase.rpc(
      'admin_add_point_transaction',
      {
        p_user_id: userId,
        p_amount: pointsAmount,
        p_type: type,
        p_description: description
      }
    );
    
    if (transactionError) {
      console.error('Error logging transaction:', transactionError);
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
    console.error('Error in addPointsToUser:', error);
    console.error('Error details:', error.message, error.code, error.details, error.hint);
    return { success: false, error: error.message };
  }
};
