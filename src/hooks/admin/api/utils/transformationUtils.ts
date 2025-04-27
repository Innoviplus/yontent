
import { MissionParticipation, UserProfile, Mission } from '../types/participationTypes';

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
  console.log('transformParticipationData input:', data);
  
  if (!Array.isArray(data)) {
    console.error('Expected array for transformParticipationData but got:', typeof data);
    return [];
  }
  
  return data.map(item => {
    try {
      // Handle user data
      const user = item.user || {};
      const userId = item.user_id || '';
      
      // Handle mission data
      const mission = item.mission || {};
      const missionId = item.mission_id || '';
      
      // Make sure dates are properly parsed to Date objects
      const createdAt = item.created_at ? new Date(item.created_at) : new Date();
      const updatedAt = item.updated_at ? new Date(item.updated_at) : new Date();
      
      // Debug logging for this specific item
      console.log(`Transform item ${item.id}:`, {
        userId,
        username: user.username,
        status: item.status,
        submissionData: item.submission_data,
        createdAt: createdAt.toString(),
        updatedAt: updatedAt.toString()
      });
      
      // Transform user data to match UserProfile type
      const userProfile: UserProfile = {
        id: userId,
        username: user.username || 'Unknown User',
        email: user.email,
        avatar: extractAvatarUrl(user)
      };
      
      // Transform mission data to match Mission type
      const missionData: Mission = {
        id: missionId,
        title: mission.title || 'Unknown Mission',
        description: mission.description || '',
        pointsReward: mission.points_reward || 0,
        type: mission.type || 'REVIEW'
      };
      
      // Ensure data types match expected MissionParticipation type
      return {
        id: item.id || '',
        missionId: missionId,
        userId: userId,
        status: item.status || 'PENDING',
        createdAt: createdAt,
        updatedAt: updatedAt,
        submissionData: item.submission_data || null,
        user: userProfile,
        mission: missionData
      };
    } catch (error) {
      console.error('Error transforming participation item:', item, error);
      
      // Return a minimal valid object in case of error
      return {
        id: item.id || 'error-id',
        missionId: item.mission_id || '',
        userId: item.user_id || '',
        status: item.status || 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        submissionData: null,
        user: {
          id: item.user_id || '',
          username: 'Error processing user',
          email: '',
          avatar: null
        },
        mission: {
          id: item.mission_id || '',
          title: 'Error processing mission',
          description: '',
          pointsReward: 0,
          type: 'REVIEW'
        }
      };
    }
  });
};
