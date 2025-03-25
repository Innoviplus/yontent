
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PointTransaction } from '@/lib/types';

/**
 * Returns points to a user (typically used when rejecting a redemption request)
 */
export const returnPointsToUser = async (userId: string, pointsAmount: number): Promise<void> => {
  await addPointsToUser(
    userId,
    pointsAmount,
    'REFUNDED',
    'REDEMPTION',
    'Returned from rejected redemption request'
  );
  
  console.log(`Successfully returned ${pointsAmount} points to user ${userId}`);
};

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
    await logPointsTransaction(
      userId,
      pointsAmount,
      type,
      source,
      description,
      sourceId
    );
    
    console.log(`Successfully updated user points from ${currentPoints} to ${newPointsTotal}`);
    
    return { success: true, newPointsTotal };
  } catch (error: any) {
    console.error('Error in addPointsToUser:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Deducts points from a user and logs the transaction
 */
export const deductPointsFromUser = async (
  userId: string, 
  pointsAmount: number,
  source: 'REDEMPTION' | 'ADMIN_ADJUSTMENT',
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
    await logPointsTransaction(
      userId,
      -pointsAmount, // Negative amount for deduction
      'REDEEMED',
      source,
      description,
      sourceId
    );
    
    console.log(`Successfully updated user points from ${currentPoints} to ${newPointsTotal}`);
    
    return { success: true, newPointsTotal };
  } catch (error: any) {
    console.error('Error in deductPointsFromUser:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get a user's current points balance
 */
export const getUserPointsBalance = async (userId: string): Promise<{ points: number; success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();
      
    if (error) {
      throw error;
    }
    
    return { points: data?.points || 0, success: true };
  } catch (error: any) {
    console.error('Error getting user points balance:', error);
    return { points: 0, success: false, error: error.message };
  }
};

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
      type: data.type,
      source: data.source,
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
      type: item.type,
      source: item.source,
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
