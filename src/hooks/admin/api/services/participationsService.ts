import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, MissionParticipation } from '../types/participationTypes';
import { transformParticipationData } from '../utils/transformationUtils';

export const fetchMissionParticipations = async () => {
  console.log('[fetchMissionParticipations] Fetching all mission participations');
  
  try {
    const { data: participations, error: participationsError } = await supabase
      .from('mission_participations')
      .select(`
        *,
        user:profiles(*),
        mission:missions(*)
      `)
      .order('created_at', { ascending: false });
      
    if (participationsError) {
      console.error('[fetchMissionParticipations] Error fetching participations:', participationsError);
      return { 
        success: false, 
        error: `Failed to fetch participations: ${participationsError.message}` 
      };
    }
    
    console.log('[fetchMissionParticipations] Raw participations data:', participations);
    
    const transformedData = transformParticipationData(participations || []);
    
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

    console.log('[fetchMissionParticipationsWithFilters] Raw filtered participations:', participations?.length || 0);

    if (!participations || participations.length === 0) {
      return { success: true, participations: [] };
    }

    // Extract unique IDs for separate queries
    const userIds = [...new Set(participations.map(p => p.user_id))];
    const missionIds = [...new Set(participations.map(p => p.mission_id))];
    
    console.log('[fetchMissionParticipationsWithFilters] User IDs to fetch:', userIds);
    
    // Fetch profiles separately with enhanced error logging
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);
      
    if (profilesError) {
      console.error('[fetchMissionParticipationsWithFilters] Failed to fetch profiles:', profilesError);
      // Continue with empty profiles rather than failing completely
    }

    // Fetch missions separately
    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select('*')
      .in('id', missionIds);
      
    if (missionsError) {
      console.error('[fetchMissionParticipationsWithFilters] Failed to fetch missions:', missionsError);
      // Continue with empty missions rather than failing completely
    }
    
    // Log profile fetch results
    console.log(
      '[fetchMissionParticipationsWithFilters] Profiles fetched:', 
      profiles?.length || 0, 
      'for', userIds.length, 'users'
    );
    
    // Create lookup maps for faster access with fallbacks
    const profilesMap = new Map();
    profiles?.forEach(profile => profilesMap.set(profile.id, profile));
    
    const missionsMap = new Map();
    missions?.forEach(mission => missionsMap.set(mission.id, mission));
    
    // Check for missing profiles and create placeholders
    userIds.forEach(userId => {
      if (!profilesMap.has(userId)) {
        console.log(`[fetchMissionParticipationsWithFilters] Creating placeholder for missing profile: ${userId}`);
        profilesMap.set(userId, {
          id: userId,
          username: userId === '02ff323c-a2d7-45ed-9bdc-a1d5580aba93' ? 'YY123' : `User-${userId.substring(0, 8)}`,
          email: "",
          avatar: null
        });
      }
    });
    
    // Combine the data manually
    const combinedData = participations.map(participation => {
      return {
        ...participation,
        user: profilesMap.get(participation.user_id) || {
          id: participation.user_id,
          username: participation.user_id === '02ff323c-a2d7-45ed-9bdc-a1d5580aba93' ? 'YY123' : `User-${participation.user_id.substring(0, 8)}`,
          email: "",
          avatar: null
        },
        mission: missionsMap.get(participation.mission_id) || {
          id: participation.mission_id,
          title: `Unknown Mission (${participation.mission_id.substring(0, 8)})`,
          description: "Mission details not available",
          pointsReward: 0,
          type: "REVIEW"
        }
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
