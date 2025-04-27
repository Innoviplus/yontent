
import { supabase } from '@/integrations/supabase/client';
import { 
  ApiResponse, 
  MissionParticipation, 
  MissionParticipationFilters 
} from './types/participationTypes';
import { transformParticipationData } from './utils/transformationUtils';
import { 
  updateMissionParticipationStatus as updateParticipationStatus,
  approveParticipation as approveParticipationAction,
  rejectParticipation as rejectParticipationAction
} from './participationStatusActions';

/**
 * Fetches all mission participations
 */
export const fetchMissionParticipations = async (): Promise<ApiResponse<MissionParticipation>> => {
  try {
    console.log('Fetching all mission participations');
    
    // First fetch the mission participations
    const { data: participations, error: participationsError } = await supabase
      .from('mission_participations')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (participationsError) {
      console.error('Error fetching mission participations:', participationsError);
      return { success: false, error: participationsError.message };
    }

    // Bail early if no participations are found
    if (!participations || participations.length === 0) {
      console.log('No mission participations found');
      return { success: true, participations: [] };
    }
    
    console.log('Found participations:', participations.length);
    
    // Fetch associated user profiles
    const userIds = [...new Set(participations.map(p => p.user_id))];
    const { data: userProfiles, error: userError } = await supabase
      .from('profiles')
      .select('id, username, email, avatar')
      .in('id', userIds);
    
    if (userError) {
      console.error('Error fetching user profiles:', userError);
      // Continue with partial data
    }
    
    // Fetch associated missions
    const missionIds = [...new Set(participations.map(p => p.mission_id))];
    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select('id, title, description, type, points_reward')
      .in('id', missionIds);
    
    if (missionsError) {
      console.error('Error fetching missions:', missionsError);
      // Continue with partial data
    }
    
    // Create lookup maps for faster access
    const userMap = new Map();
    userProfiles?.forEach(user => userMap.set(user.id, user));
    
    const missionMap = new Map();
    missions?.forEach(mission => missionMap.set(mission.id, mission));
    
    // Combine the data
    const enrichedParticipations = participations.map(participation => {
      const user = userMap.get(participation.user_id) || {};
      const mission = missionMap.get(participation.mission_id) || {};
      
      return {
        ...participation,
        user,
        mission
      };
    });
    
    console.log('Enriched participations data:', enrichedParticipations);
    
    // Transform the data into the expected format
    const transformedData = transformParticipationData(enrichedParticipations);
    
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
    console.log('Fetching mission participations with filters:', filters);
    
    // Base query for participations
    let query = supabase
      .from('mission_participations')
      .select('*');

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
      console.log(`Filtering by status: ${filters.status}`);
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
    
    const { data: participations, error: participationsError } = await query;

    if (participationsError) {
      console.error('Error fetching filtered mission participations:', participationsError);
      return { success: false, error: participationsError.message };
    }

    // Bail early if no participations are found
    if (!participations || participations.length === 0) {
      console.log('No filtered mission participations found');
      return { success: true, participations: [] };
    }
    
    // Fetch associated user profiles
    const userIds = [...new Set(participations.map(p => p.user_id))];
    const { data: userProfiles, error: userError } = await supabase
      .from('profiles')
      .select('id, username, email, avatar')
      .in('id', userIds);
    
    if (userError) {
      console.error('Error fetching user profiles for filtered participations:', userError);
      // Continue with partial data
    }
    
    // Fetch associated missions
    const missionIds = [...new Set(participations.map(p => p.mission_id))];
    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select('id, title, description, type, points_reward')
      .in('id', missionIds);
    
    if (missionsError) {
      console.error('Error fetching missions for filtered participations:', missionsError);
      // Continue with partial data
    }
    
    // Create lookup maps for faster access
    const userMap = new Map();
    userProfiles?.forEach(user => userMap.set(user.id, user));
    
    const missionMap = new Map();
    missions?.forEach(mission => missionMap.set(mission.id, mission));
    
    // Combine the data
    const enrichedParticipations = participations.map(participation => {
      const user = userMap.get(participation.user_id) || {};
      const mission = missionMap.get(participation.mission_id) || {};
      
      return {
        ...participation,
        user,
        mission
      };
    });
    
    console.log('Enriched filtered participations:', enrichedParticipations);
    
    // Transform the data into the expected format
    const transformedData = transformParticipationData(enrichedParticipations);
    
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
export const updateMissionParticipationStatus = updateParticipationStatus;

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
