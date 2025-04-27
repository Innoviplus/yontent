
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
  console.log('[transformParticipationData] Transforming data:', data?.length || 0);
  
  if (!Array.isArray(data)) {
    console.error('[transformParticipationData] Expected array but got:', typeof data);
    return [];
  }
  
  return data.map(item => {
    try {
      // Parse dates safely
      const createdAt = new Date(item.created_at || Date.now());
      const updatedAt = new Date(item.updated_at || Date.now());
      
      // Handle the YY123 special user case
      const isYY123User = item.user_id === '02ff323c-a2d7-45ed-9bdc-a1d5580aba93';
      
      // Extract profile data with fallbacks
      const profileData = item.profiles || {};
      const userId = item.user_id || '';
      
      // Create user profile object
      const user: UserProfile = {
        id: userId,
        username: profileData.username || (isYY123User ? 'YY123' : `User-${userId.substring(0, 6)}`),
        email: profileData.email || '',
        avatar: profileData.avatar || null
      };
      
      // Extract mission data with fallbacks
      const missionData = item.missions || {};
      const missionId = item.mission_id || '';
      
      // Ensure mission type is valid
      const validMissionType: 'REVIEW' | 'RECEIPT' = 
        missionData.type === 'RECEIPT' ? 'RECEIPT' : 'REVIEW';
      
      // Create mission object
      const mission: Mission = {
        id: missionId,
        title: missionData.title || `Mission-${missionId.substring(0, 6)}`,
        description: missionData.description || '',
        pointsReward: typeof missionData.points_reward === 'number' ? missionData.points_reward : 0,
        type: validMissionType
      };
      
      // Return the transformed participation object
      return {
        id: item.id || '',
        missionId: missionId,
        userId: userId,
        status: item.status || 'PENDING',
        createdAt: createdAt,
        updatedAt: updatedAt,
        submissionData: item.submission_data || null,
        user: user,
        mission: mission
      };
    } catch (error) {
      console.error('[transformParticipationData] Error transforming item:', item, error);
      
      // Create a fallback object in case of error
      return {
        id: item.id || 'error',
        missionId: item.mission_id || '',
        userId: item.user_id || '',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        submissionData: null,
        user: {
          id: item.user_id || '',
          username: (item.user_id === '02ff323c-a2d7-45ed-9bdc-a1d5580aba93') ? 
                  'YY123' : `User-${(item.user_id || '').substring(0, 6)}`,
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
