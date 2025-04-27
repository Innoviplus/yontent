
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
    
    // Get basic participation data first
    const { data: participations, error } = await supabase
      .from('mission_participations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[fetchMissionParticipations] Failed to fetch participations:', error);
      return { success: false, error: error.message };
    }

    console.log('[fetchMissionParticipations] Raw participations fetched:', participations?.length || 0);
    
    if (!participations || participations.length === 0) {
      console.log('[fetchMissionParticipations] No participations found in the database');
      return { success: true, participations: [] };
    }

    // Extract unique IDs for separate queries
    const userIds = [...new Set(participations.map(p => p.user_id))];
    const missionIds = [...new Set(participations.map(p => p.mission_id))];
    
    console.log('[fetchMissionParticipations] Fetching data for users:', userIds);
    console.log('[fetchMissionParticipations] Fetching data for missions:', missionIds);

    // Fetch profiles separately
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);
      
    if (profilesError) {
      console.error('[fetchMissionParticipations] Failed to fetch profiles:', profilesError);
    }

    // Fetch missions separately
    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select('*')
      .in('id', missionIds);
      
    if (missionsError) {
      console.error('[fetchMissionParticipations] Failed to fetch missions:', missionsError);
    }

    console.log('[fetchMissionParticipations] Profiles fetched:', profiles?.length || 0);
    console.log('[fetchMissionParticipations] Missions fetched:', missions?.length || 0);
    
    // Create lookup maps for faster access
    const profilesMap = new Map();
    profiles?.forEach(profile => profilesMap.set(profile.id, profile));
    
    const missionsMap = new Map();
    missions?.forEach(mission => missionsMap.set(mission.id, mission));
    
    // Combine the data manually
    const combinedData = participations.map(participation => {
      return {
        ...participation,
        user: profilesMap.get(participation.user_id) || null,
        mission: missionsMap.get(participation.mission_id) || null
      };
    });
    
    console.log('[fetchMissionParticipations] Combined data:', combinedData.length);
    
    // Now transform the combined data
    const transformedData = transformParticipationData(combinedData);
    
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
    
    // Build the query with filters
    let query = supabase
      .from('mission_participations')
      .select('*');

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
      console.error('[fetchMissionParticipationsWithFilters] Error fetching filtered participations:', error);
      return { success: false, error: error.message };
    }

    console.log('[fetchMissionParticipationsWithFilters] Raw filtered participations:', participations);

    if (!participations || participations.length === 0) {
      return { success: true, participations: [] };
    }

    // Extract unique IDs for separate queries
    const userIds = [...new Set(participations.map(p => p.user_id))];
    const missionIds = [...new Set(participations.map(p => p.mission_id))];
    
    // Fetch profiles separately
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);
      
    if (profilesError) {
      console.error('[fetchMissionParticipationsWithFilters] Failed to fetch profiles:', profilesError);
    }

    // Fetch missions separately
    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select('*')
      .in('id', missionIds);
      
    if (missionsError) {
      console.error('[fetchMissionParticipationsWithFilters] Failed to fetch missions:', missionsError);
    }
    
    // Create lookup maps for faster access
    const profilesMap = new Map();
    profiles?.forEach(profile => profilesMap.set(profile.id, profile));
    
    const missionsMap = new Map();
    missions?.forEach(mission => missionsMap.set(mission.id, mission));
    
    // Combine the data manually
    const combinedData = participations.map(participation => {
      return {
        ...participation,
        user: profilesMap.get(participation.user_id) || null,
        mission: missionsMap.get(participation.mission_id) || null
      };
    });

    const transformedData = transformParticipationData(combinedData);
    
    console.log('[fetchMissionParticipationsWithFilters] Transformed filtered participations:', transformedData.length);
    
    return {
      success: true,
      participations: transformedData
    };
  } catch (error: any) {
    console.error('[fetchMissionParticipationsWithFilters] Error in fetchMissionParticipationsWithFilters:', error);
    return { success: false, error: error.message };
  }
};
