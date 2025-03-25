
import { addPointsToUser } from './addPoints';

/**
 * Returns points to a user (typically used when rejecting a redemption request)
 */
export const returnPointsToUser = async (userId: string, pointsAmount: number): Promise<void> => {
  try {
    console.log(`Attempting to return ${pointsAmount} points to user ${userId}`);
    
    const result = await addPointsToUser(
      userId,
      pointsAmount,
      'REFUNDED',
      'REDEMPTION',
      'Returned from rejected redemption request'
    );
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to return points to user');
    }
    
    console.log(`Successfully returned ${pointsAmount} points to user ${userId}`);
  } catch (error) {
    console.error('Error in returnPointsToUser:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
