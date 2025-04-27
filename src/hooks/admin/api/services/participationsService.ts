
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
    const { success, data: participations, error } = await fetchParticipationsData();
    
    if (!success || !participations) {
      return { success: false, error: error || 'Failed to fetch participations' };
    }

    if (participations.length === 0) {
      return { success: true, participations: [] };
    }

    const userIds = [...new Set(participations.map(p => p.user_id))];
    const missionIds = [...new Set(participations.map(p => p.mission_id))];
    
    const [userProfiles, missions] = await Promise.all([
      fetchUserProfiles(userIds),
      fetchMissions(missionIds)
    ]);
    
    // Create lookup maps
    const userMap = new Map(userProfiles.map(user => [user.id, user]));
    const missionMap = new Map(missions.map(mission => [mission.id, mission]));
    
    // Combine the data
    const enrichedParticipations = participations.map(participation => ({
      ...participation,
      user: userMap.get(participation.user_id) || { 
        username: 'Unknown User',
        avatar: null
      },
      mission: missionMap.get(participation.mission_id) || {
        title: 'Unknown Mission',
        description: '',
        points_reward: 0,
        type: 'REVIEW'
      }
    }));
    
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

export const fetchMissionParticipationsWithFilters = async (
  filters: MissionParticipationFilters
): Promise<ApiResponse<MissionParticipation>> => {
  try {
    console.log('Fetching mission participations with filters:', filters);
    
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
    
    const { data: participations, error: participationsError } = await query;

    if (participationsError) {
      return { success: false, error: participationsError.message };
    }

    if (!participations || participations.length === 0) {
      return { success: true, participations: [] };
    }

    const userIds = [...new Set(participations.map(p => p.user_id))];
    const missionIds = [...new Set(participations.map(p => p.mission_id))];
    
    const [userProfiles, missions] = await Promise.all([
      fetchUserProfiles(userIds),
      fetchMissions(missionIds)
    ]);
    
    const userMap = new Map(userProfiles.map(user => [user.id, user]));
    const missionMap = new Map(missions.map(mission => [mission.id, mission]));
    
    const enrichedParticipations = participations.map(participation => ({
      ...participation,
      user: userMap.get(participation.user_id) || {},
      mission: missionMap.get(participation.mission_id) || {}
    }));
    
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
