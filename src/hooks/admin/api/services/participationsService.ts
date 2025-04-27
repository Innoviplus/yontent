
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
    
    const { success, data: participations, error } = await fetchParticipationsData();
    
    if (!success || !participations) {
      console.error('[fetchMissionParticipations] Failed to fetch participations:', error);
      return { success: false, error: error || 'Failed to fetch participations' };
    }

    console.log('[fetchMissionParticipations] Raw participations data:', participations.length, participations);

    if (participations.length === 0) {
      console.log('[fetchMissionParticipations] No participations found in the database');
      return { success: true, participations: [] };
    }

    const userIds = [...new Set(participations.map(p => p.user_id))];
    const missionIds = [...new Set(participations.map(p => p.mission_id))];
    
    console.log('[fetchMissionParticipations] Will fetch data for userIds:', userIds);
    console.log('[fetchMissionParticipations] Will fetch data for missionIds:', missionIds);
    
    const [userProfiles, missions] = await Promise.all([
      fetchUserProfiles(userIds),
      fetchMissions(missionIds)
    ]);
    
    console.log('[fetchMissionParticipations] Fetched user profiles count:', userProfiles.length);
    console.log('[fetchMissionParticipations] User profiles data:', userProfiles);
    console.log('[fetchMissionParticipations] Fetched missions count:', missions.length);
    console.log('[fetchMissionParticipations] Missions data:', missions);
    
    // Create lookup maps
    const userMap = new Map(userProfiles.map(user => [user.id, user]));
    const missionMap = new Map(missions.map(mission => [mission.id, mission]));
    
    // Combine the data
    const enrichedParticipations = participations.map(participation => {
      const userObj = userMap.get(participation.user_id);
      const missionObj = missionMap.get(participation.mission_id);
      
      // If any user is missing, log a clear warning about it
      if (!userObj) {
        console.warn(`[fetchMissionParticipations] *** MISSING USER DATA *** for user_id ${participation.user_id} in participation ${participation.id}`);
      }
      
      console.log(`[fetchMissionParticipations] Enriching participation ${participation.id}:`, {
        userId: participation.user_id,
        foundUser: !!userObj,
        userName: userObj?.username || 'Unknown User',
        missionId: participation.mission_id,
        foundMission: !!missionObj,
        missionTitle: missionObj?.title || 'Unknown Mission'
      });
      
      return {
        ...participation,
        user: userObj || { 
          id: participation.user_id,
          username: `User-${participation.user_id.substring(0, 6)}`,
          avatar: null
        },
        mission: missionObj || {
          id: participation.mission_id,
          title: `Mission-${participation.mission_id.substring(0, 6)}`,
          description: '',
          pointsReward: 0,
          type: 'REVIEW'
        }
      };
    });
    
    console.log('[fetchMissionParticipations] Enriched participations before transform:', enrichedParticipations);
    
    const transformedData = transformParticipationData(enrichedParticipations);
    
    console.log('[fetchMissionParticipations] Transformed participations data:', transformedData);
    
    // Double check that we have the right number of participations
    console.log('[fetchMissionParticipations] Final count check - Original:', participations.length, 'Transformed:', transformedData.length);
    
    if (participations.length !== transformedData.length) {
      console.error('[fetchMissionParticipations] Mismatch in participation counts after transformation');
    }
    
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
    
    console.log('[fetchMissionParticipationsWithFilters] Raw filtered participations:', participations);

    if (participationsError) {
      console.error('[fetchMissionParticipationsWithFilters] Error fetching filtered participations:', participationsError);
      return { success: false, error: participationsError.message };
    }

    if (!participations || participations.length === 0) {
      return { success: true, participations: [] };
    }

    const userIds = [...new Set(participations.map(p => p.user_id))];
    const missionIds = [...new Set(participations.map(p => p.mission_id))];
    
    console.log('[fetchMissionParticipationsWithFilters] Will fetch profiles for user IDs:', userIds);
    console.log('[fetchMissionParticipationsWithFilters] Will fetch missions for mission IDs:', missionIds);
    
    const [userProfiles, missions] = await Promise.all([
      fetchUserProfiles(userIds),
      fetchMissions(missionIds)
    ]);
    
    console.log('[fetchMissionParticipationsWithFilters] Fetched user profiles for filter:', userProfiles.length, userProfiles);
    console.log('[fetchMissionParticipationsWithFilters] Fetched missions for filter:', missions.length);
    
    const userMap = new Map(userProfiles.map(user => [user.id, user]));
    const missionMap = new Map(missions.map(mission => [mission.id, mission]));
    
    const enrichedParticipations = participations.map(participation => {
      const userObj = userMap.get(participation.user_id);
      const missionObj = missionMap.get(participation.mission_id);
      
      console.log(`[fetchMissionParticipationsWithFilters] Processing participation ${participation.id} for filter:`, {
        userId: participation.user_id,
        foundUser: !!userObj,
        userName: userObj?.username || 'Unknown',
        missionId: participation.mission_id
      });
      
      return {
        ...participation,
        user: userObj || {
          id: participation.user_id,
          username: `User-${participation.user_id.substring(0, 6)}`,
          email: '',
          avatar: null
        },
        mission: missionObj || {
          id: participation.mission_id,
          title: `Mission-${participation.mission_id.substring(0, 6)}`,
          description: '',
          pointsReward: 0,
          type: 'REVIEW'
        }
      };
    });
    
    const transformedData = transformParticipationData(enrichedParticipations);
    
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
