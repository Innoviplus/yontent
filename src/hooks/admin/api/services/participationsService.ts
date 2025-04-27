
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, MissionParticipation, MissionParticipationFilters } from '../types/participationTypes';
import { transformParticipationData } from '../utils/transformationUtils';

export const fetchMissionParticipations = async () => {
  console.log('[fetchMissionParticipations] Fetching all mission participations');
  
  try {
    const { data: participations, error } = await supabase
      .from('mission_participations')
      .select(`
        id,
        mission_id,
        user_id,
        status,
        submission_data,
        created_at,
        updated_at,
        missions (
          id, 
          title, 
          description,
          points_reward,
          type
        ),
        profiles (
          id,
          username,
          email,
          avatar
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[fetchMissionParticipations] Error:', error);
      return { 
        success: false, 
        error: error.message
      };
    }

    if (!participations || participations.length === 0) {
      return { success: true, participations: [] };
    }
    
    // Transform the data to the required format
    const transformedData = transformParticipationData(participations);
    
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
    console.log('[fetchMissionParticipationsWithFilters] Fetching with filters:', filters);
    
    // Build the query with filters
    let query = supabase
      .from('mission_participations')
      .select(`
        id,
        mission_id,
        user_id,
        status,
        submission_data,
        created_at,
        updated_at,
        missions (
          id, 
          title, 
          description,
          points_reward,
          type
        ),
        profiles (
          id,
          username,
          email,
          avatar
        )
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
    
    // Execute the query
    const { data: participations, error } = await query;
    
    if (error) {
      console.error('[fetchMissionParticipationsWithFilters] Error:', error);
      return { success: false, error: error.message };
    }

    if (!participations || participations.length === 0) {
      return { success: true, participations: [] };
    }

    // Transform the data to the required format
    const transformedData = transformParticipationData(participations);
    
    return {
      success: true,
      participations: transformedData
    };
  } catch (error: any) {
    console.error('[fetchMissionParticipationsWithFilters] Error:', error);
    return { success: false, error: error.message };
  }
};
