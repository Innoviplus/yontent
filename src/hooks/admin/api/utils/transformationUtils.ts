
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
  
  return data.map(item => {
    // For direct join queries, the data structure is different
    const user = item.user || {};
    const mission = item.mission || {};
    
    return {
      id: item.id,
      missionId: item.mission_id,
      userId: item.user_id,
      status: item.status,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      submissionData: item.submission_data,
      user: {
        id: user.id || item.user_id,
        username: user.username || 'Anonymous',
        email: user.email,
        avatar: extractAvatarUrl(user)
      },
      mission: {
        id: mission.id || item.mission_id,
        title: mission.title || 'Unknown Mission',
        description: mission.description || '',
        pointsReward: mission.points_reward || 0,
        type: mission.type || 'REVIEW'
      }
    };
  });
};
