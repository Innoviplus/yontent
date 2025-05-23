
import { PointTransaction } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

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
    
    // Include the source information in the description
    const fullDescription = sourceId 
      ? `${description} [${source}:${sourceId}]`
      : `${description} [${source}]`;
    
    // Call the Supabase function with correctly named parameters
    const { data, error } = await supabase.rpc(
      'create_point_transaction',
      {
        p_user_id: userId,
        p_amount: amount,
        p_type: type,
        p_description: fullDescription
      }
    );
    
    if (error) {
      console.error('Error inserting transaction record:', error);
      throw error;
    }
    
    // If we got here, the transaction was successfully created but we need to fetch it
    // since the create_point_transaction function doesn't return the complete record
    const { data: transactionData, error: fetchError } = await supabase
      .from('point_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .eq('user_id_point', userId)  // Using the correct column name here
      .limit(1)
      .single();
    
    if (fetchError) {
      console.error('Error fetching created transaction:', fetchError);
      throw fetchError;
    }
    
    console.log('Transaction logged successfully:', transactionData);
    
    // Transform to match our interface
    const transaction: PointTransaction = {
      id: transactionData.id,
      userId: transactionData.user_id_point,  // Using the correct column name
      amount: transactionData.amount,
      type: transactionData.type as any, // Type assertion as our PointTransaction type is more strict
      source: source, // This is not stored in DB but we include it in the return object
      sourceId, // This is not stored in DB but we include it in the return object
      description: transactionData.description,
      createdAt: new Date(transactionData.created_at)
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
      .eq('user_id_point', userId)  // Using the correct column name here
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Parse the description field to extract source information if present
    const transactions: PointTransaction[] = (data || []).map(item => {
      // Try to extract source from description [SOURCE:ID] or [SOURCE]
      let source: PointTransaction['source'] = 'ADMIN_ADJUSTMENT';
      let sourceId: string | undefined;
      let cleanDescription = item.description;
      
      const sourceMatch = item.description.match(/\[(.*?)(?::([^\]]+))?\]$/);
      if (sourceMatch) {
        const extractedSource = sourceMatch[1];
        if (
          extractedSource === 'MISSION_REVIEW' || 
          extractedSource === 'RECEIPT_SUBMISSION' || 
          extractedSource === 'REDEMPTION' || 
          extractedSource === 'ADMIN_ADJUSTMENT'
        ) {
          source = extractedSource as any;
        }
        
        sourceId = sourceMatch[2];
        
        // Remove the source tag from the description
        cleanDescription = item.description.replace(/\s*\[.*?\]$/, '');
      }
      
      return {
        id: item.id,
        userId: item.user_id_point,  // Using the correct column name here
        amount: item.amount,
        type: item.type as any, // Type assertion as our PointTransaction type is more strict
        source,
        sourceId,
        description: cleanDescription,
        createdAt: new Date(item.created_at)
      };
    });
    
    return { transactions, success: true };
  } catch (error: any) {
    console.error('Error getting user transaction history:', error);
    return { transactions: [], success: false, error: error.message };
  }
};
