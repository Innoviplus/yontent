
import { supabase } from '@/integrations/supabase/client';
import { ParticipationStatusResponse } from './types/participationTypes';

/**
 * Update mission participation status
 */
export const updateMissionParticipationStatus = async (
  id: string,
  status: string
): Promise<ParticipationStatusResponse> => {
  try {
    const { error } = await supabase
      .from('mission_participations')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating mission participation:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in updateMissionParticipationStatus:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Approve a mission participation
 */
export const approveParticipation = async (
  id: string
): Promise<ParticipationStatusResponse> => {
  try {
    // First, get participation information to determine reward
    const { data: participation, error: fetchError } = await supabase
      .from('mission_participations')
      .select(`
        user_id,
        missions:mission_id (
          points_reward
        )
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching participation for approval:', fetchError);
      return { success: false, error: fetchError.message };
    }

    // Update status to APPROVED
    const { error: updateError } = await supabase
      .from('mission_participations')
      .update({
        status: 'APPROVED',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating mission participation status:', updateError);
      return { success: false, error: updateError.message };
    }

    // Create a point transaction for the user
    const pointAmount = participation.missions.points_reward;
    
    // Add points to user and create transaction record
    await addPointsToUser(participation.user_id, pointAmount, 'Approved mission participation');

    return { success: true };
  } catch (error: any) {
    console.error('Error in approveParticipation:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Reject a mission participation
 */
export const rejectParticipation = async (
  id: string
): Promise<ParticipationStatusResponse> => {
  try {
    const { error } = await supabase
      .from('mission_participations')
      .update({
        status: 'REJECTED',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error rejecting mission participation:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in rejectParticipation:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Helper function to add points to a user and log the transaction
 */
const addPointsToUser = async (userId: string, amount: number, description: string): Promise<void> => {
  try {
    // First increment the points in the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('points')
      .eq('id', userId)
      .single();
      
    if (profileError) throw profileError;
    
    const newPoints = (profile.points || 0) + amount;
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ points: newPoints })
      .eq('id', userId);
      
    if (updateError) throw updateError;
    
    // Then log the transaction
    const { error: transactionError } = await supabase
      .from('point_transactions')
      .insert({
        user_id: userId,
        amount: amount,
        type: 'EARNED',
        description: description
      });
      
    if (transactionError) throw transactionError;
  } catch (error) {
    console.error('Error adding points to user:', error);
    throw error;
  }
};
