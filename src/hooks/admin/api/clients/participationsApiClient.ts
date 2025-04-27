
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, MissionParticipation } from '../types/participationTypes';

export const fetchParticipationsData = async () => {
  console.log('Fetching all mission participations');
  
  const { data: participations, error: participationsError } = await supabase
    .from('mission_participations')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (participationsError) {
    console.error('Error fetching mission participations:', participationsError);
    return { success: false, error: participationsError.message };
  }

  return { success: true, data: participations };
};

export const fetchUserProfiles = async (userIds: string[]) => {
  console.log('Fetching profiles for user IDs:', userIds);
  
  const { data: userProfiles, error: userError } = await supabase
    .from('profiles')
    .select('id, username, email, avatar')
    .in('id', userIds);
  
  if (userError) {
    console.error('Error fetching user profiles:', userError);
  }
  
  return userProfiles || [];
};

export const fetchMissions = async (missionIds: string[]) => {
  console.log('Fetching missions for mission IDs:', missionIds);
  
  const { data: missions, error: missionsError } = await supabase
    .from('missions')
    .select('id, title, description, type, points_reward')
    .in('id', missionIds);
  
  if (missionsError) {
    console.error('Error fetching missions:', missionsError);
  }
  
  return missions || [];
};
