
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
    
    // Since we don't have the point_transactions table in Supabase yet,
    // just create a mock transaction object
    const transaction: PointTransaction = {
      id: Date.now().toString(),
      userId,
      amount,
      type,
      source,
      sourceId,
      description,
      createdAt: new Date()
    };
    
    console.log('Transaction logged (mock):', transaction);
    
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
    // Mock implementation since we don't have the point_transactions table
    const transactions: PointTransaction[] = [
      {
        id: '1',
        userId,
        amount: 100,
        type: 'EARNED',
        source: 'MISSION_REVIEW',
        description: 'Completed mission: Product Review',
        createdAt: new Date(Date.now() - 86400000) // yesterday
      },
      {
        id: '2',
        userId,
        amount: 50,
        type: 'REDEEMED',
        source: 'REDEMPTION',
        description: 'Redeemed for Gift Card',
        createdAt: new Date(Date.now() - 172800000) // 2 days ago
      }
    ];
    
    return { transactions, success: true };
  } catch (error: any) {
    console.error('Error getting user transaction history:', error);
    return { transactions: [], success: false, error: error.message };
  }
};
