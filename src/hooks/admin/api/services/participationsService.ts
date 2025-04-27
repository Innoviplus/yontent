
import { supabase } from '@/integrations/supabase/client';
import { MissionParticipationFilters, ApiResponse, MissionParticipation } from '../types/participationTypes';
import { transformParticipationData } from '../utils/transformationUtils';

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
    
    console.log('[fetchMissionParticipations] User IDs found:', userIds);
    console.log('[fetchMissionParticipations] Mission IDs found:', missionIds);

    // Log the first participation details for debugging
    if (participations.length > 0) {
      console.log('[fetchMissionParticipations] First participation details:', {
        id: participations[0].id,
        user_id: participations[0].user_id,
        mission_id: participations[0].mission_id,
        status: participations[0].status
      });
    }

    // Fetch profiles separately - try direct user_id lookup
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);
      
    if (profilesError) {
      console.error('[fetchMissionParticipations] Failed to fetch profiles:', profilesError);
      return { success: false, error: `Error fetching user profiles: ${profilesError.message}` };
    }

    // Fetch missions separately
    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select('*')
      .in('id', missionIds);
      
    if (missionsError) {
      console.error('[fetchMissionParticipations] Failed to fetch missions:', missionsError);
      return { success: false, error: `Error fetching missions: ${missionsError.message}` };
    }

    console.log('[fetchMissionParticipations] Profiles fetched:', profiles?.length || 0);
    if (profiles && profiles.length > 0) {
      console.log('[fetchMissionParticipations] Sample profile:', {
        id: profiles[0].id,
        username: profiles[0].username
      });
      
      // Check for missing user profiles
      const profileIdsSet = new Set(profiles.map(p => p.id));
      const missingUserIds = userIds.filter(id => !profileIdsSet.has(id));
      
      if (missingUserIds.length > 0) {
        console.warn('[fetchMissionParticipations] Missing profiles for users:', missingUserIds);
      }
    }
    
    console.log('[fetchMissionParticipations] Missions fetched:', missions?.length || 0);
    
    // Create lookup maps for faster access
    const profilesMap = new Map();
    profiles?.forEach(profile => profilesMap.set(profile.id, profile));
    
    const missionsMap = new Map();
    missions?.forEach(mission => missionsMap.set(mission.id, mission));
    
    // Combine the data manually with thorough logging
    const combinedData = participations.map(participation => {
      const userId = participation.user_id;
      const userProfile = profilesMap.get(userId);
      
      if (!userProfile) {
        console.warn(`[fetchMissionParticipations] Missing profile for user ID: ${userId}`);
      }
      
      return {
        ...participation,
        user: userProfile || {
          id: userId,
          username: `User-${userId.substring(0, 8)}`,
          email: "",
          avatar: null
        },
        mission: missionsMap.get(participation.mission_id) || null
      };
    });
    
    console.log('[fetchMissionParticipations] Combined data:', combinedData.length);
    
    // Now transform the combined data
    const transformedData = transformParticipationData(combinedData);
    
    console.log('[fetchMissionParticipations] Transformed participations data:', transformedData.length);
    
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
          username: `User-${userId.substring(0, 8)}`,
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
          username: `User-${participation.user_id.substring(0, 8)}`,
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
