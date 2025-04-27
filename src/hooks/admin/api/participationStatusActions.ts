
import { supabase } from '@/integrations/supabase/client';
import { ParticipationStatus } from './types/participationTypes';
import { toast } from 'sonner';

export const updateMissionParticipationStatus = async (
  participationId: string,
  status: ParticipationStatus
): Promise<boolean> => {
  try {
    console.log(`Updating participation ${participationId} status to ${status}`);
    
    const { error } = await supabase
      .from('mission_participations')
      .update({ status })
      .eq('id', participationId);

    if (error) {
      console.error('Error updating participation status:', error);
      toast.error(`Failed to update participation: ${error.message}`);
      return false;
    }

    console.log(`Successfully updated participation ${participationId} to ${status}`);
    toast.success(`Participation ${status.toLowerCase()} successfully`);
    return true;
  } catch (error: any) {
    console.error('Error in updateMissionParticipationStatus:', error);
    toast.error(`Error: ${error.message}`);
    return false;
  }
};

export const approveParticipation = async (participationId: string): Promise<boolean> => {
  const result = await updateMissionParticipationStatus(participationId, 'APPROVED');
  return result;
};

export const rejectParticipation = async (participationId: string): Promise<boolean> => {
  const result = await updateMissionParticipationStatus(participationId, 'REJECTED');
  return result;
};
