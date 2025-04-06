
import { MissionParticipation } from '../types/participationTypes';
import { extractAvatarUrl } from '../types/participationTypes';

/**
 * Transforms raw Supabase data into MissionParticipation objects
 */
export const transformParticipationData = (data: any[]): MissionParticipation[] => {
  return data.map((item) => {
    // Handle possible error responses safely
    const userProfile = item.profiles || {};
    const mission = item.missions || {};
    const extendedData = userProfile.extended_data || {};
    
    return {
      id: item.id,
      missionId: item.mission_id,
      userId: item.user_id,
      status: item.status,
      submissionData: item.submission_data,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
      userName: userProfile.username || 'Anonymous',
      userAvatar: extractAvatarUrl(extendedData),
      missionTitle: mission.title || '',
      missionDescription: mission.description || '',
      missionPointsReward: mission.points_reward || 0,
      missionType: mission.type || ''
    };
  });
};
