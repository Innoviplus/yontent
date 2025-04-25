
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
    
    const profiles = item.profiles || {};
    const missions = item.missions || {};
    
    return {
      id: item.id,
      missionId: item.mission_id,
      userId: item.user_id,
      status: item.status,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      submissionData: item.submission_data,
      user: {
        id: profiles.id || item.user_id,
        username: profiles.username || 'Anonymous',
        email: profiles.email,
        avatar: extractAvatarUrl(profiles)
      },
      mission: {
        id: missions.id || item.mission_id,
        title: missions.title || 'Unknown Mission',
        description: missions.description || '',
        pointsReward: missions.points_reward || 0,
        type: missions.type || 'REVIEW'
      }
    };
  });
};
