
import { supabase } from '@/integrations/supabase/client';

export const returnPointsToUser = async (userId: string, pointsAmount: number): Promise<void> => {
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
  const newPointsTotal = (userData?.points || 0) + pointsAmount;
  
  // Update user points
  const { error: pointsError } = await supabase
    .from('profiles')
    .update({ points: newPointsTotal })
    .eq('id', userId);
  
  if (pointsError) {
    console.error('Error returning points to user:', pointsError);
    throw pointsError;
  }
  
  console.log(`Successfully updated user points to ${newPointsTotal}`);
};
