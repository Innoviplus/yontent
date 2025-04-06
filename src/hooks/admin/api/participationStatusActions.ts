
import { supabase } from '@/integrations/supabase/client';
import { ParticipationStatus } from './types/participationTypes';

export const updateMissionParticipationStatus = async (
  participationId: string,
  status: ParticipationStatus
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('mission_participations')
      .update({ status })
      .eq('id', participationId);

    if (error) {
      console.error('Error updating participation status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateMissionParticipationStatus:', error);
    return false;
  }
};

export const approveParticipation = async (participationId: string): Promise<boolean> => {
  return updateMissionParticipationStatus(participationId, 'APPROVED');
};

export const rejectParticipation = async (participationId: string): Promise<boolean> => {
  return updateMissionParticipationStatus(participationId, 'REJECTED');
};
