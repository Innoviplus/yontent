
import { supabase } from '@/integrations/supabase/client';
import { MissionParticipationFilters, ApiResponse, MissionParticipation } from '../types/participationTypes';
import { transformParticipationData } from '../utils/transformationUtils';

export const fetchMissionParticipations = async (): Promise<ApiResponse<MissionParticipation>> => {
  try {
    console.log('[fetchMissionParticipations] Fetching mission participations');
    
    // Use explicit table aliases and fully qualified column references to avoid ambiguity
    const { data, error } = await supabase
      .from('mission_participations')
      .select(`
        id,
        mission_participations.mission_id,
        mission_participations.user_id,
        mission_participations.status,
        mission_participations.created_at,
        mission_participations.updated_at,
        mission_participations.submission_data,
        profiles:mission_participations.user_id(id, username, email, avatar),
        missions:mission_participations.mission_id(id, title, description, points_reward, type)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[fetchMissionParticipations] Error fetching participations:', error);
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      return { success: true, participations: [] };
    }
    
    console.log('[fetchMissionParticipations] Raw data count:', data.length);
    
    const transformedData = transformParticipationData(data);
    return {
      success: true,
      participations: transformedData
    };
  } catch (error: any) {
    console.error('[fetchMissionParticipations] Exception:', error);
    return { success: false, error: error.message };
  }
};

export const fetchMissionParticipationsWithFilters = async (
  filters: MissionParticipationFilters
): Promise<ApiResponse<MissionParticipation>> => {
  try {
    console.log('[fetchMissionParticipationsWithFilters] Filters:', filters);

    // Build query with explicit table references
    let query = supabase
      .from('mission_participations')
      .select(`
        id,
        mission_participations.mission_id,
        mission_participations.user_id,
        mission_participations.status,
        mission_participations.created_at,
        mission_participations.updated_at,
        mission_participations.submission_data,
        profiles:mission_participations.user_id(id, username, email, avatar),
        missions:mission_participations.mission_id(id, title, description, points_reward, type)
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
    
    // Apply pagination if specified
    if (filters.page && filters.pageSize) {
      const from = (filters.page - 1) * filters.pageSize;
      const to = from + filters.pageSize - 1;
      query = query.range(from, to);
    }
    
    // Order by created_at
    query = query.order('created_at', { ascending: false });
    
    // Execute the query
    const { data, error } = await query;
    
    if (error) {
      console.error('[fetchMissionParticipationsWithFilters] Error:', error);
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      return { success: true, participations: [] };
    }
    
    console.log('[fetchMissionParticipationsWithFilters] Raw filtered data count:', data.length);
    
    const transformedData = transformParticipationData(data);
    return {
      success: true,
      participations: transformedData
    };
  } catch (error: any) {
    console.error('[fetchMissionParticipationsWithFilters] Exception:', error);
    return { success: false, error: error.message };
  }
};
