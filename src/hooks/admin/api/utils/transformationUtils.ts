
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
      // Special handling for YY123 user to ensure they're properly displayed
      const isYY123User = item.user_id === '02ff323c-a2d7-45ed-9bdc-a1d5580aba93';
      
      // Make sure dates are properly parsed
      let createdAt: Date;
      let updatedAt: Date;
      
      try {
        createdAt = item.created_at ? new Date(item.created_at) : new Date();
      } catch (e) {
        console.warn(`[transformParticipationData] Error parsing created_at for participation ${item.id}:`, e);
        createdAt = new Date();
      }
      
      try {
        updatedAt = item.updated_at ? new Date(item.updated_at) : new Date();
      } catch (e) {
        console.warn(`[transformParticipationData] Error parsing updated_at for participation ${item.id}:`, e);
        updatedAt = new Date();
      }
      
      // Get user profile from profiles object or use fallback
      const userProfile = item.profiles || {};
      const userId = item.user_id || '';
      const username = userProfile.username || (isYY123User ? 'YY123' : `User-${userId.substring(0, 6)}`);
      
      // Get mission from missions object or use fallback
      const mission = item.missions || {};
      const missionId = item.mission_id || '';
      
      // Transform user data to match UserProfile type with fallbacks
      const user: UserProfile = {
        id: userId,
        username: username,
        email: userProfile.email || '',
        avatar: userProfile.avatar || null
      };
      
      // Get the mission type string value with fallback
      let missionTypeValue = mission.type || 'REVIEW';
      
      // Validate and ensure the mission type is one of the allowed values
      const validMissionType: 'REVIEW' | 'RECEIPT' = 
        missionTypeValue === 'RECEIPT' ? 'RECEIPT' : 'REVIEW';
      
      // Transform mission data to match Mission type with fallbacks
      const missionData: Mission = {
        id: missionId,
        title: mission.title || `Mission-${missionId.substring(0, 6)}`,
        description: mission.description || 'No description available',
        pointsReward: typeof mission.points_reward === 'number' ? mission.points_reward : 0,
        type: validMissionType
      };
      
      // Return the transformed participation with all required fields
      return {
        id: item.id || '',
        missionId: missionId,
        userId: userId,
        status: item.status || 'PENDING',
        createdAt: createdAt,
        updatedAt: updatedAt,
        submissionData: item.submission_data || null,
        user: user,
        mission: missionData
      };
    } catch (error) {
      console.error('[transformParticipationData] Error transforming participation item:', item, error);
      
      // Return a minimal valid object in case of error with correct typing
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
          username: item.user_id === '02ff323c-a2d7-45ed-9bdc-a1d5580aba93' ? 'YY123' : 
                   `Error-${item.user_id ? item.user_id.substring(0, 6) : 'Unknown'}`,
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
  
  return transformedData;
};
