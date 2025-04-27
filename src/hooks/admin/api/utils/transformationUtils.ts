
import { MissionParticipation } from '../types/participationTypes';

// Helper to extract avatar URL from profile data
export const extractAvatarUrl = (profileData: any): string | null => {
  if (!profileData) return null;
  
  if (typeof profileData === 'object') {
    // Try to get avatar directly
    if (profileData.avatar) return profileData.avatar;
    
    // Handle case where avatar might be in extended_data
    if (profileData.extended_data) {
      const extendedData = profileData.extended_data;
      if (typeof extendedData === 'object' && extendedData.avatarUrl) {
        return extendedData.avatarUrl;
      }
    }
  }
  
  return null;
};

export const transformParticipationData = (data: any[]): MissionParticipation[] => {
  console.log('Transforming participation data:', data);
  
  if (!Array.isArray(data)) {
    console.error('Expected array for transformParticipationData but got:', typeof data);
    return [];
  }
  
  return data.map(item => {
    // Handle user data
    const user = item.user || {};
    const userId = item.user_id || '';
    const username = user.username || 'Anonymous';
    
    // Handle mission data
    const mission = item.mission || {};
    const missionId = item.mission_id || '';
    const missionTitle = mission.title || 'Unknown Mission';
    
    return {
      id: item.id,
      missionId: missionId,
      userId: userId,
      status: item.status,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      submissionData: item.submission_data,
      user: {
        id: user.id || userId,
        username: username,
        email: user.email,
        avatar: extractAvatarUrl(user)
      },
      mission: {
        id: mission.id || missionId,
        title: missionTitle,
        description: mission.description || '',
        pointsReward: mission.points_reward || 0,
        type: mission.type || 'REVIEW'
      }
    };
  });
};
