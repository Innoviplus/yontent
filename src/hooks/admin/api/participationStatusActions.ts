
import { supabase } from '@/integrations/supabase/client';
import { ParticipationStatusResponse } from './types/participationTypes';

/**
 * Updates the status of a mission participation
 */
export const updateMissionParticipationStatus = async (
  id: string,
  status: string
): Promise<ParticipationStatusResponse> => {
  try {
    const { error } = await supabase
      .from('mission_participations')
      .update({ status, updated_at: new Date() })
      .eq('id', id);

    if (error) {
      console.error('Error updating participation status:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in updateMissionParticipationStatus:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Approves a participation and awards points if applicable
 */
export const approveParticipation = async (id: string): Promise<ParticipationStatusResponse> => {
  try {
    // First, get the participation to check its current status
    const { data: participation, error: fetchError } = await supabase
      .from('mission_participations')
      .select(`
        id,
        status,
        user_id,
        missions:mission_id (points_reward)
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching participation for approval:', fetchError);
      return { success: false, error: fetchError.message };
    }

    // If already approved, return early
    if (participation.status === 'APPROVED') {
      return { 
        success: true, 
        error: 'This submission was already approved.'
      };
    }

    // Get the points reward from the mission
    const pointsReward = participation.missions?.points_reward || 0;
    const userId = participation.user_id;

    // Begin a transaction to update both the participation status and award points
    const { error: updateError } = await supabase
      .from('mission_participations')
      .update({ status: 'APPROVED', updated_at: new Date() })
      .eq('id', id);

    if (updateError) {
      console.error('Error approving participation:', updateError);
      return { success: false, error: updateError.message };
    }

    // Award points to the user
    if (pointsReward > 0) {
      // Update user points in profiles table
      const { error: pointsError } = await supabase.rpc('increment_points', {
        user_id_param: userId,
        points_amount_param: pointsReward
      });

      if (pointsError) {
        console.error('Error awarding points:', pointsError);
        // We don't return an error here as the participation was approved
        // But we should log this for admin attention
      } else {
        // Create a transaction record
        const { error: transactionError } = await supabase
          .from('point_transactions')
          .insert({
            user_id: userId,
            amount: pointsReward,
            type: 'EARNED',
            description: 'Mission participation approved'
          });

        if (transactionError) {
          console.error('Error creating point transaction:', transactionError);
          // Again, we don't return an error as the main operation succeeded
        }
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in approveParticipation:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Rejects a participation
 */
export const rejectParticipation = async (id: string): Promise<ParticipationStatusResponse> => {
  try {
    const { error } = await supabase
      .from('mission_participations')
      .update({ status: 'REJECTED', updated_at: new Date() })
      .eq('id', id);

    if (error) {
      console.error('Error rejecting participation:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in rejectParticipation:', error);
    return { success: false, error: error.message };
  }
};
