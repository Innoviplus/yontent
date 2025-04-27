
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
  console.log('[transformParticipationData] Input data length:', data ? data.length : 0);
  
  if (!Array.isArray(data)) {
    console.error('[transformParticipationData] Expected array but got:', typeof data);
    return [];
  }
  
  const transformedData = data.map(item => {
    try {
      // Extract the nested data from Supabase's response format
      const mission = item.missions || {};
      const profile = item.profiles || {};
      
      // Transform user data to match UserProfile type
      const userProfile: UserProfile = {
        id: item.user_id || '',
        username: profile.username || `User-${item.user_id?.substring(0, 6) || 'Unknown'}`,
        email: profile.email || '',
        avatar: profile.avatar || null
      };
      
      // Handle special case for YY123 user
      if (item.user_id === '02ff323c-a2d7-45ed-9bdc-a1d5580aba93') {
        userProfile.username = 'YY123';
      }
      
      // Get the mission type string value
      const missionTypeValue = mission.type || 'REVIEW';
      
      // Ensure the mission type is one of the allowed values
      const validMissionType: 'REVIEW' | 'RECEIPT' = 
        missionTypeValue === 'RECEIPT' ? 'RECEIPT' : 'REVIEW';
      
      // Transform mission data
      const missionData: Mission = {
        id: item.mission_id || '',
        title: mission.title || `Mission-${item.mission_id?.substring(0, 6) || 'Unknown'}`,
        description: mission.description || 'No description available',
        pointsReward: typeof mission.points_reward === 'number' ? mission.points_reward : 0,
        type: validMissionType
      };
      
      // Return the transformed participation
      return {
        id: item.id || '',
        missionId: item.mission_id || '',
        userId: item.user_id || '',
        status: item.status || 'PENDING',
        createdAt: item.created_at ? new Date(item.created_at) : new Date(),
        updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
        submissionData: item.submission_data || null,
        user: userProfile,
        mission: missionData
      };
    } catch (error) {
      console.error('[transformParticipationData] Error transforming item:', item.id, error);
      
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
          username: 'Error-User',
          email: '',
          avatar: null
        },
        mission: {
          id: item.mission_id || '',
          title: 'Error processing mission',
          description: '',
          pointsReward: 0,
          type: 'REVIEW' as 'REVIEW' | 'RECEIPT'
        }
      };
    }
  });
  
  console.log('[transformParticipationData] Transformed data length:', transformedData.length);
  return transformedData;
};
