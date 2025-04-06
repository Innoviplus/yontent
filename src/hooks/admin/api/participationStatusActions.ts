
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, MissionParticipation, ParticipationStatus } from './types/participationTypes';
import { transformParticipationData } from './utils/transformationUtils';

/**
 * Updates a mission participation status
 */
export const updateMissionParticipationStatus = async (
  participationId: string,
  status: ParticipationStatus
): Promise<ApiResponse<MissionParticipation>> => {
  try {
    const { data, error } = await supabase
      .from('mission_participations')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', participationId)
      .select(`
        *,
        profiles:user_id (*),
        missions:mission_id (*)
      `)
      .single();

    if (error) {
      console.error('Error updating participation status:', error);
      return { success: false, error: error.message };
    }

    const transformedData = transformParticipationData([data]);
    
    return {
      success: true,
      participations: transformedData
    };
  } catch (error: any) {
    console.error('Error in updateMissionParticipationStatus:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Approves a mission participation
 */
export const approveParticipation = async (
  participationId: string
): Promise<ApiResponse<MissionParticipation>> => {
  try {
    // First, get the participation to check if it's already approved
    const { data: existingData, error: fetchError } = await supabase
      .from('mission_participations')
      .select('*')
      .eq('id', participationId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching participation:', fetchError);
      return { success: false, error: fetchError.message };
    }
    
    if (existingData.status === 'APPROVED') {
      console.log('Participation already approved');
      return { success: true, participations: [] };
    }
    
    // Update the status to APPROVED
    const { data, error } = await supabase
      .from('mission_participations')
      .update({
        status: 'APPROVED',
        updated_at: new Date().toISOString()
      })
      .eq('id', participationId)
      .select(`
        *,
        profiles:user_id (*),
        missions:mission_id (*)
      `)
      .single();

    if (error) {
      console.error('Error approving participation:', error);
      return { success: false, error: error.message };
    }

    const transformedData = transformParticipationData([data]);
    
    return {
      success: true,
      participations: transformedData
    };
  } catch (error: any) {
    console.error('Error in approveParticipation:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Rejects a mission participation
 */
export const rejectParticipation = async (
  participationId: string
): Promise<ApiResponse<MissionParticipation>> => {
  try {
    // First, get the participation to check if it's already rejected
    const { data: existingData, error: fetchError } = await supabase
      .from('mission_participations')
      .select('*')
      .eq('id', participationId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching participation:', fetchError);
      return { success: false, error: fetchError.message };
    }
    
    if (existingData.status === 'REJECTED') {
      console.log('Participation already rejected');
      return { success: true, participations: [] };
    }
    
    // Update the status to REJECTED
    const { data, error } = await supabase
      .from('mission_participations')
      .update({
        status: 'REJECTED',
        updated_at: new Date().toISOString()
      })
      .eq('id', participationId)
      .select(`
        *,
        profiles:user_id (*),
        missions:mission_id (*)
      `)
      .single();

    if (error) {
      console.error('Error rejecting participation:', error);
      return { success: false, error: error.message };
    }

    const transformedData = transformParticipationData([data]);
    
    return {
      success: true,
      participations: transformedData
    };
  } catch (error: any) {
    console.error('Error in rejectParticipation:', error);
    return { success: false, error: error.message };
  }
};
