
import { supabase } from '@/integrations/supabase/client';
import { PointTransaction } from '@/lib/types';

/**
 * Log a points transaction
 */
export const logPointsTransaction = async (
  userId: string,
  amount: number,
  type: 'EARNED' | 'REDEEMED' | 'REFUNDED' | 'ADJUSTED',
  source: 'MISSION_REVIEW' | 'RECEIPT_SUBMISSION' | 'REDEMPTION' | 'ADMIN_ADJUSTMENT',
  description: string,
  sourceId?: string
): Promise<{ success: boolean; transaction?: PointTransaction; error?: string }> => {
  try {
    console.log(`Logging points transaction: ${amount} points for user ${userId} (${type} from ${source})`);
    
    const { data, error } = await supabase
      .from('point_transactions')
      .insert({
        user_id: userId,
        amount: amount,
        type: type,
        source: source,
        source_id: sourceId,
        description: description
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error logging points transaction:', error);
      // Continue even if logging fails - this is not critical
      return { success: false, error: error.message };
    }
    
    console.log('Transaction logged successfully:', data);
    
    // Format for return
    const transaction: PointTransaction = {
      id: data.id,
      userId: data.user_id,
      amount: data.amount,
      type: data.type as 'EARNED' | 'REDEEMED' | 'REFUNDED' | 'ADJUSTED',
      source: data.source as 'MISSION_REVIEW' | 'RECEIPT_SUBMISSION' | 'REDEMPTION' | 'ADMIN_ADJUSTMENT',
      sourceId: data.source_id,
      description: data.description,
      createdAt: new Date(data.created_at)
    };
    
    return { success: true, transaction };
  } catch (error: any) {
    console.error('Error in logPointsTransaction:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get transaction history for a user
 */
export const getUserTransactionHistory = async (
  userId: string
): Promise<{ transactions: PointTransaction[]; success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('point_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    const transactions: PointTransaction[] = data.map(item => ({
      id: item.id,
      userId: item.user_id,
      amount: item.amount,
      type: item.type as 'EARNED' | 'REDEEMED' | 'REFUNDED' | 'ADJUSTED',
      source: item.source as 'MISSION_REVIEW' | 'RECEIPT_SUBMISSION' | 'REDEMPTION' | 'ADMIN_ADJUSTMENT',
      sourceId: item.source_id,
      description: item.description,
      createdAt: new Date(item.created_at)
    }));
    
    return { transactions, success: true };
  } catch (error: any) {
    console.error('Error getting user transaction history:', error);
    return { transactions: [], success: false, error: error.message };
  }
};
