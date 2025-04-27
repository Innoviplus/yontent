
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
  console.log('[transformParticipationData] Input data:', data);
  console.log('[transformParticipationData] Input data length:', data ? data.length : 0);
  
  if (!Array.isArray(data)) {
    console.error('[transformParticipationData] Expected array but got:', typeof data);
    return [];
  }
  
  // Log all the user information before transformation to help debug
  console.log('[transformParticipationData] User IDs in data:',
    data.map(item => ({
      userId: item.user_id,
      username: item.user?.username || 'Unknown',
      hasUserObject: !!item.user
    }))
  );

  const transformedData = data.map(item => {
    try {
      // Make sure user data exists with default values if missing
      const user = item.user || {};
      const userId = item.user_id || '';
      
      // Make sure mission data exists with default values if missing
      const mission = item.mission || {};
      const missionId = item.mission_id || '';
      
      // Make sure dates are properly parsed
      let createdAt;
      let updatedAt;
      
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
      
      // Create a dummy username based on user_id if username is missing
      const fallbackUsername = userId ? `User-${userId.substring(0, 6)}` : 'Unknown User';
      const username = user.username || fallbackUsername;
      
      console.log(`[transformParticipationData] Processing item ${item.id}:`, {
        userId,
        username,
        submissionData: item.submission_data,
        status: item.status
      });
      
      // Transform user data to match UserProfile type with fallbacks
      const userProfile: UserProfile = {
        id: userId,
        username: username,
        email: user.email || '',
        avatar: extractAvatarUrl(user)
      };
      
      // Transform mission data to match Mission type with fallbacks
      const missionData: Mission = {
        id: missionId,
        title: mission.title || `Mission-${missionId.substring(0, 6)}`,
        description: mission.description || 'No description available',
        pointsReward: mission.points_reward || 0,
        type: mission.type || 'REVIEW'
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
        user: userProfile,
        mission: missionData
      };
    } catch (error) {
      console.error('[transformParticipationData] Error transforming participation item:', item, error);
      
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
          username: `Error-${item.user_id ? item.user_id.substring(0, 6) : 'Unknown'}`,
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
  
  console.log('[transformParticipationData] Transformed data length:', transformedData.length);
  
  if (transformedData.length > 0) {
    console.log('[transformParticipationData] First transformed item sample:', transformedData[0]);
  }
  
  return transformedData;
};
