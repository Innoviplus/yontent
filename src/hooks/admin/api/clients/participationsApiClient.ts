
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, MissionParticipation } from '../types/participationTypes';

export const fetchParticipationsData = async () => {
  console.log('Fetching all mission participations from database');
  
  try {
    const { data: participations, error: participationsError } = await supabase
      .from('mission_participations')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (participationsError) {
      console.error('Error fetching mission participations:', participationsError);
      return { success: false, error: participationsError.message };
    }
    
    console.log('Participation fetch result:', participations ? participations.length : 0, 'records');
    return { success: true, data: participations || [] };
  } catch (error: any) {
    console.error('Exception while fetching participations:', error);
    return { success: false, error: error.message };
  }
};

export const fetchUserProfiles = async (userIds: string[]) => {
  if (!userIds || userIds.length === 0) {
    console.log('No user IDs provided to fetch profiles');
    return [];
  }
  
  console.log('Fetching profiles for user IDs:', userIds);
  
  try {
    const { data: userProfiles, error: userError } = await supabase
      .from('profiles')
      .select('id, username, email, avatar')
      .in('id', userIds);
    
    if (userError) {
      console.error('Error fetching user profiles:', userError);
      return [];
    }
    
    console.log('Fetched profiles result:', userProfiles ? userProfiles.length : 0, 'profiles');
    return userProfiles || [];
  } catch (error: any) {
    console.error('Exception while fetching profiles:', error);
    return [];
  }
};

export const fetchMissions = async (missionIds: string[]) => {
  if (!missionIds || missionIds.length === 0) {
    console.log('No mission IDs provided to fetch missions');
    return [];
  }
  
  console.log('Fetching missions for mission IDs:', missionIds);
  
  try {
    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select('id, title, description, type, points_reward')
      .in('id', missionIds);
    
    if (missionsError) {
      console.error('Error fetching missions:', missionsError);
      return [];
    }
    
    console.log('Fetched missions result:', missions ? missions.length : 0, 'missions');
    return missions || [];
  } catch (error: any) {
    console.error('Exception while fetching missions:', error);
    return [];
  }
};
