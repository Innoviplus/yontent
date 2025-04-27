
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, MissionParticipation } from '../types/participationTypes';

export const fetchParticipationsData = async () => {
  console.log('[fetchParticipationsData] Fetching all mission participations from database');
  
  try {
    const { data: participations, error: participationsError } = await supabase
      .from('mission_participations')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (participationsError) {
      console.error('[fetchParticipationsData] Error fetching mission participations:', participationsError);
      return { success: false, error: participationsError.message };
    }
    
    console.log('[fetchParticipationsData] Participation fetch result:', participations ? participations.length : 0, 'records');
    
    // Log all unique user_ids to help debug
    if (participations && participations.length > 0) {
      const userIds = [...new Set(participations.map(p => p.user_id))];
      console.log('[fetchParticipationsData] Unique user_ids in participations:', userIds);
    }
    
    return { success: true, data: participations || [] };
  } catch (error: any) {
    console.error('[fetchParticipationsData] Exception while fetching participations:', error);
    return { success: false, error: error.message };
  }
};

export const fetchUserProfiles = async (userIds: string[]) => {
  if (!userIds || userIds.length === 0) {
    console.log('[fetchUserProfiles] No user IDs provided to fetch profiles');
    return [];
  }
  
  console.log('[fetchUserProfiles] Fetching profiles for user IDs:', userIds);
  
  try {
    // First try to get from profiles table
    const { data: userProfiles, error: userError } = await supabase
      .from('profiles')
      .select('id, username, email, avatar, extended_data')
      .in('id', userIds);
    
    if (userError) {
      console.error('[fetchUserProfiles] Error fetching user profiles:', userError);
      return [];
    }
    
    console.log('[fetchUserProfiles] Fetched profiles result:', userProfiles ? userProfiles.length : 0, 'profiles');
    console.log('[fetchUserProfiles] User profiles data:', userProfiles);
    
    // Check if any user IDs are missing from the result
    if (userProfiles) {
      const returnedIds = new Set(userProfiles.map(p => p.id));
      const missingIds = userIds.filter(id => !returnedIds.has(id));
      
      if (missingIds.length > 0) {
        console.warn('[fetchUserProfiles] Missing user profiles for IDs:', missingIds);
        
        // For each missing ID, attempt an individual fetch for additional debugging
        for (const missingId of missingIds) {
          console.log(`[fetchUserProfiles] Attempting individual fetch for user ID: ${missingId}`);
          const { data: singleUser, error: singleError } = await supabase
            .from('profiles')
            .select('id, username, email, avatar, extended_data')
            .eq('id', missingId)
            .single();
          
          if (singleError) {
            console.error(`[fetchUserProfiles] Error in individual fetch for user ${missingId}:`, singleError);
          } else {
            console.log(`[fetchUserProfiles] Individual fetch result for user ${missingId}:`, singleUser);
          }
        }
        
        // Create placeholder profiles for missing users
        const placeholderProfiles = missingIds.map(id => ({
          id,
          username: `User-${id.substring(0, 6)}`,
          email: null,
          avatar: null,
          extended_data: {}
        }));
        
        console.log('[fetchUserProfiles] Created placeholder profiles:', placeholderProfiles);
        return [...userProfiles, ...placeholderProfiles];
      }
    }
    
    return userProfiles || [];
  } catch (error: any) {
    console.error('[fetchUserProfiles] Exception while fetching profiles:', error);
    return [];
  }
};

export const fetchMissions = async (missionIds: string[]) => {
  if (!missionIds || missionIds.length === 0) {
    console.log('[fetchMissions] No mission IDs provided to fetch missions');
    return [];
  }
  
  console.log('[fetchMissions] Fetching missions for mission IDs:', missionIds);
  
  try {
    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select('id, title, description, type, points_reward')
      .in('id', missionIds);
    
    if (missionsError) {
      console.error('[fetchMissions] Error fetching missions:', missionsError);
      return [];
    }
    
    console.log('[fetchMissions] Fetched missions result:', missions ? missions.length : 0, 'missions');
    
    // Check if any mission IDs are missing from the result
    if (missions) {
      const returnedIds = new Set(missions.map(m => m.id));
      const missingIds = missionIds.filter(id => !returnedIds.has(id));
      
      if (missingIds.length > 0) {
        console.log('[fetchMissions] Missing missions for IDs:', missingIds);
        
        // Create placeholder missions for missing IDs
        const placeholderMissions = missingIds.map(id => ({
          id,
          title: `Mission-${id.substring(0, 6)}`,
          description: 'Mission details not available',
          type: 'REVIEW',
          points_reward: 0
        }));
        
        console.log('[fetchMissions] Created placeholder missions:', placeholderMissions);
        return [...missions, ...placeholderMissions];
      }
    }
    
    return missions || [];
  } catch (error: any) {
    console.error('[fetchMissions] Exception while fetching missions:', error);
    return [];
  }
};
