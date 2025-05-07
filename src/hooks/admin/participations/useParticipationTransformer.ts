
import { useCallback } from 'react';
import { fetchProfileForParticipation } from './participationService';
import { Participation } from './types';

export const useParticipationTransformer = () => {
  /**
   * Transforms raw participation data by enriching it with profile information
   */
  const transformParticipationsWithProfiles = useCallback(
    async (participationsData: any[]): Promise<Participation[]> => {
      const participationsWithProfiles: Participation[] = [];
      
      for (const item of participationsData) {
        try {
          // For debugging
          console.log('Processing participation:', item.id);
          
          // Fetch profile for this participation
          const profile = await fetchProfileForParticipation(item.user_id_p);
          console.log('Profile data fetched:', profile);
        
          // Clean mission data with proper typing
          const missionData = item.mission ? {
            id: item.mission.id,
            title: item.mission.title,
            points_reward: item.mission.points_reward,
            type: (item.mission.type === 'REVIEW' || item.mission.type === 'RECEIPT') 
              ? item.mission.type as 'REVIEW' | 'RECEIPT'
              : 'REVIEW' // Default to 'REVIEW' if type is invalid
          } : undefined;
          
          participationsWithProfiles.push({
            ...item,
            mission: missionData,
            profile: {
              id: profile.id || '',
              username: profile.username || 'Unknown User',
              avatar: profile.avatar
            }
          });
        } catch (profileError) {
          console.error('Error processing profile:', profileError);
          
          // Still add the participation but with default profile
          participationsWithProfiles.push({
            ...item,
            mission: item.mission ? {
              id: item.mission.id,
              title: item.mission.title,
              points_reward: item.mission.points_reward,
              type: (item.mission.type === 'REVIEW' || item.mission.type === 'RECEIPT') 
                ? item.mission.type as 'REVIEW' | 'RECEIPT'
                : 'REVIEW'
            } : undefined,
            profile: {
              id: '',
              username: 'Unknown User',
              avatar: undefined
            }
          });
        }
      }
      
      return participationsWithProfiles;
    },
    []
  );

  return {
    transformParticipationsWithProfiles
  };
};
