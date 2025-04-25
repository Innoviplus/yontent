
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
    // Log the structure of each item to help debug
    console.log('Item structure:', {
      id: item.id,
      mission_id: item.mission_id,
      user_id: item.user_id,
      profiles: item.profiles,
      missions: item.missions
    });
    
    return {
      id: item.id,
      missionId: item.mission_id,
      userId: item.user_id,
      status: item.status,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      submissionData: item.submission_data,
      user: {
        id: item.profiles?.id || item.user_id,
        username: item.profiles?.username || 'Anonymous',
        email: item.profiles?.email,
        avatar: extractAvatarUrl(item.profiles)
      },
      mission: {
        id: item.missions?.id || item.mission_id,
        title: item.missions?.title || 'Unknown Mission',
        description: item.missions?.description || '',
        pointsReward: item.missions?.points_reward || 0,
        type: item.missions?.type || 'REVIEW'
      }
    };
  });
};
