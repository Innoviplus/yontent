
import { 
  fetchParticipationsData,
  fetchUserProfiles, 
  fetchMissions 
} from '../clients/participationsApiClient';
import { transformParticipationData } from '../utils/transformationUtils';
import { MissionParticipationFilters, ApiResponse, MissionParticipation } from '../types/participationTypes';
import { supabase } from '@/integrations/supabase/client';

export const fetchMissionParticipations = async (): Promise<ApiResponse<MissionParticipation>> => {
  try {
    console.log('[fetchMissionParticipations] Fetching all mission participations');
    
    // Using the direct method with nested selects for more reliable data fetching
    const { data: participations, error } = await supabase
      .from('mission_participations')
      .select(`
        *,
        user:profiles(*),
        mission:missions(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[fetchMissionParticipations] Failed to fetch participations:', error);
      return { success: false, error: error.message };
    }

    console.log('[fetchMissionParticipations] Raw participations with joins:', participations?.length || 0, participations);

    if (!participations || participations.length === 0) {
      console.log('[fetchMissionParticipations] No participations found in the database');
      return { success: true, participations: [] };
    }

    // Transform the data to match our type definitions
    const transformedData = transformParticipationData(participations);
    
    console.log('[fetchMissionParticipations] Transformed participations data:', transformedData);
    
    return {
      success: true,
      participations: transformedData
    };
  } catch (error: any) {
    console.error('[fetchMissionParticipations] Error in fetchMissionParticipations:', error);
    return { success: false, error: error.message };
  }
};

export const fetchMissionParticipationsWithFilters = async (
  filters: MissionParticipationFilters
): Promise<ApiResponse<MissionParticipation>> => {
  try {
    console.log('[fetchMissionParticipationsWithFilters] Fetching mission participations with filters:', filters);
    
    let query = supabase
      .from('mission_participations')
      .select(`
        *,
        user:profiles(*),
        mission:missions(*)
      `);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.missionId) {
      query = query.eq('mission_id', filters.missionId);
    }
    
    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }
    
    if (filters.page && filters.pageSize) {
      const from = (filters.page - 1) * filters.pageSize;
      const to = from + filters.pageSize - 1;
      query = query.range(from, to);
    }
    
    query = query.order('created_at', { ascending: false });
    
    const { data: participations, error } = await query;
    
    if (error) {
      console.error('[fetchMissionParticipationsWithFilters] Error fetching filtered participations:', error);
      return { success: false, error: error.message };
    }

    console.log('[fetchMissionParticipationsWithFilters] Raw filtered participations:', participations);

    if (!participations || participations.length === 0) {
      return { success: true, participations: [] };
    }

    const transformedData = transformParticipationData(participations);
    
    console.log('[fetchMissionParticipationsWithFilters] Transformed filtered participations:', transformedData.length, transformedData);
    
    return {
      success: true,
      participations: transformedData
    };
  } catch (error: any) {
    console.error('[fetchMissionParticipationsWithFilters] Error in fetchMissionParticipationsWithFilters:', error);
    return { success: false, error: error.message };
  }
};
