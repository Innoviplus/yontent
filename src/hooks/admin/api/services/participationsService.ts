
import { supabase } from '@/integrations/supabase/client';
import { MissionParticipationFilters, ApiResponse, MissionParticipation } from '../types/participationTypes';
import { transformParticipationData } from '../utils/transformationUtils';

export const fetchMissionParticipations = async (): Promise<ApiResponse<MissionParticipation>> => {
  try {
    console.log('[fetchMissionParticipations] Fetching mission participations');
    
    // Fetch mission participations without column qualifiers
    const { data: participations, error: participationsError } = await supabase
      .from('mission_participations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (participationsError) {
      console.error('[fetchMissionParticipations] Error fetching participations:', participationsError);
      return { success: false, error: participationsError.message };
    }

    if (!participations || participations.length === 0) {
      return { success: true, participations: [] };
    }

    // Extract user IDs and mission IDs for separate queries
    const userIds = [...new Set(participations.map(p => p.user_id))];
    const missionIds = [...new Set(participations.map(p => p.mission_id))];
    
    // Fetch profiles separately
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, email, avatar')
      .in('id', userIds);
      
    if (profilesError) {
      console.error('[fetchMissionParticipations] Error fetching profiles:', profilesError);
      // Continue without profiles instead of failing completely
    }
    
    // Fetch missions separately
    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select('id, title, description, points_reward, type')
      .in('id', missionIds);
    
    if (missionsError) {
      console.error('[fetchMissionParticipations] Error fetching missions:', missionsError);
      // Continue without missions instead of failing completely
    }
    
    // Create lookup maps for faster access
    const profilesMap = (profiles || []).reduce((acc, profile) => {
      acc[profile.id] = profile;
      return acc;
    }, {});
    
    const missionsMap = (missions || []).reduce((acc, mission) => {
      acc[mission.id] = mission;
      return acc;
    }, {});
    
    // Combine the data manually
    const combinedData = participations.map(participation => {
      return {
        ...participation,
        profiles: profilesMap[participation.user_id] || null,
        missions: missionsMap[participation.mission_id] || null
      };
    });
    
    console.log('[fetchMissionParticipations] Raw data count:', combinedData.length);
    
    const transformedData = transformParticipationData(combinedData);
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

    // Build query for participations with filters
    let query = supabase
      .from('mission_participations')
      .select('*');

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
    const { data: participations, error: participationsError } = await query;
    
    if (participationsError) {
      console.error('[fetchMissionParticipationsWithFilters] Error:', participationsError);
      return { success: false, error: participationsError.message };
    }

    if (!participations || participations.length === 0) {
      return { success: true, participations: [] };
    }
    
    // Extract user IDs and mission IDs for separate queries
    const userIds = [...new Set(participations.map(p => p.user_id))];
    const missionIds = [...new Set(participations.map(p => p.mission_id))];
    
    // Fetch profiles separately
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, email, avatar')
      .in('id', userIds);
      
    if (profilesError) {
      console.error('[fetchMissionParticipationsWithFilters] Error fetching profiles:', profilesError);
      // Continue without profiles
    }
    
    // Fetch missions separately
    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select('id, title, description, points_reward, type')
      .in('id', missionIds);
    
    if (missionsError) {
      console.error('[fetchMissionParticipationsWithFilters] Error fetching missions:', missionsError);
      // Continue without missions
    }
    
    // Create lookup maps for faster access
    const profilesMap = (profiles || []).reduce((acc, profile) => {
      acc[profile.id] = profile;
      return acc;
    }, {});
    
    const missionsMap = (missions || []).reduce((acc, mission) => {
      acc[mission.id] = mission;
      return acc;
    }, {});
    
    // Combine the data manually
    const combinedData = participations.map(participation => {
      return {
        ...participation,
        profiles: profilesMap[participation.user_id] || null,
        missions: missionsMap[participation.mission_id] || null
      };
    });
    
    console.log('[fetchMissionParticipationsWithFilters] Raw filtered data count:', combinedData.length);
    
    const transformedData = transformParticipationData(combinedData);
    return {
      success: true,
      participations: transformedData
    };
  } catch (error: any) {
    console.error('[fetchMissionParticipationsWithFilters] Exception:', error);
    return { success: false, error: error.message };
  }
};
