
import { supabase } from '@/integrations/supabase/client';
import { 
  ApiResponse, 
  MissionParticipation, 
  MissionParticipationFilters 
} from './types/participationTypes';
import { transformParticipationData } from './utils/transformationUtils';
import { 
  updateMissionParticipationStatus as updateStatusAction,
  approveParticipation as approveParticipationAction,
  rejectParticipation as rejectParticipationAction
} from './participationStatusActions';

/**
 * Fetches all mission participations
 */
export const fetchMissionParticipations = async (): Promise<ApiResponse<MissionParticipation>> => {
  try {
    const { data, error } = await supabase
      .from('mission_participations')
      .select(`
        *,
        profiles:user_id (*),
        missions:mission_id (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching mission participations:', error);
      return { success: false, error: error.message };
    }

    const transformedData = transformParticipationData(data || []);
    
    return {
      success: true,
      participations: transformedData
    };
  } catch (error: any) {
    console.error('Error in fetchMissionParticipations:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetches mission participations with filters
 */
export const fetchMissionParticipationsWithFilters = async (
  filters: MissionParticipationFilters
): Promise<ApiResponse<MissionParticipation>> => {
  try {
    let query = supabase
      .from('mission_participations')
      .select(`
        *,
        profiles:user_id (*),
        missions:mission_id (*)
      `);

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.missionId) {
      query = query.eq('mission_id', filters.missionId);
    }
    
    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }
    
    // Apply pagination if provided
    if (filters.page && filters.pageSize) {
      const from = (filters.page - 1) * filters.pageSize;
      const to = from + filters.pageSize - 1;
      query = query.range(from, to);
    }
    
    // Order by creation date, newest first
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;

    if (error) {
      console.error('Error fetching mission participations with filters:', error);
      return { success: false, error: error.message };
    }

    const transformedData = transformParticipationData(data || []);
    
    return {
      success: true,
      participations: transformedData
    };
  } catch (error: any) {
    console.error('Error in fetchMissionParticipationsWithFilters:', error);
    return { success: false, error: error.message };
  }
};

// Export the status action functions with the same names to maintain API compatibility
export const approveParticipation = approveParticipationAction;
export const rejectParticipation = rejectParticipationAction;
export const updateMissionParticipationStatus = updateStatusAction;

// Re-export the MissionParticipation type
export type { MissionParticipation } from './types/participationTypes';

// API functions export
export const useMissionParticipationsApi = () => {
  return {
    fetchMissionParticipations,
    fetchMissionParticipationsWithFilters,
    updateMissionParticipationStatus,
    approveParticipation,
    rejectParticipation
  };
};
