
import { supabase } from '@/integrations/supabase/client';
import { ParticipationStatusResponse } from './types/participationTypes';
import { toast } from 'sonner';

/**
 * Approves a participation and awards points to the user
 */
export const approveParticipation = async (id: string): Promise<ParticipationStatusResponse> => {
  try {
    // Get the participation details
    const { data: participation, error: fetchError } = await supabase
      .from('mission_participations')
      .select('*, missions(points_reward, title), user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }

    // Check if already approved
    if (participation.status === 'APPROVED') {
      return { success: true, error: 'This submission was already approved' };
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
      return { success: false, error: updateError.message };
    }

    // Award points to the user
    const pointsToAward = participation.missions?.points_reward || 0;
    if (pointsToAward > 0) {
      const { error: pointsError } = await supabase.rpc('increment_points', {
        user_id_param: participation.user_id,
        points_amount_param: pointsToAward
      });

      if (pointsError) {
        console.error('Error awarding points:', pointsError);
        // Continue despite points error, but log it
      } else {
        // Log the points transaction
        const missionTitle = participation.missions?.title || 'Unknown mission';
        await supabase.from('point_transactions').insert({
          user_id: participation.user_id,
          amount: pointsToAward,
          type: 'MISSION_COMPLETION',
          description: `Completed mission: ${missionTitle}`
        });
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
    // Check if already rejected
    const { data: participation, error: fetchError } = await supabase
      .from('mission_participations')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }

    if (participation.status === 'REJECTED') {
      return { success: true, error: 'This submission was already rejected' };
    }

    // Update status to REJECTED
    const { error: updateError } = await supabase
      .from('mission_participations')
      .update({ 
        status: 'REJECTED',
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in rejectParticipation:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Updates a mission participation status
 */
export const updateMissionParticipationStatus = async (
  id: string,
  status: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('mission_participations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error: any) {
    console.error('Error updating mission participation status:', error);
    toast.error(`Error: ${error.message}`);
    return false;
  }
};
