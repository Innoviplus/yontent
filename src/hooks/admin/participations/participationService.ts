
import { supabase } from '@/integrations/supabase/client';
import { Participation, MissionApprovalResponse } from './types';
import { toast } from 'sonner';

/**
 * Fetches participations with optional status filter
 */
export const fetchParticipations = async (statusFilter: string | null = null) => {
  console.log('Fetching participations with status filter:', statusFilter);
  
  try {
    // Build the query
    let query = supabase
      .from('mission_participations')
      .select(`
        *,
        mission:missions(id, title, points_reward, type)
      `)
      .order('created_at', { ascending: false });

    // Apply status filter if provided
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    console.log(`Fetched ${data?.length || 0} participations`);
    return data || [];
    
  } catch (error: any) {
    console.error('Error fetching participations:', error.message);
    throw error;
  }
};

/**
 * Fetches profile data for a participation
 */
export const fetchProfileForParticipation = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.warn('Error fetching profile:', error);
    }
    
    return data || { 
      id: '', 
      username: 'Unknown User', 
      avatar: undefined 
    };
  } catch (error: any) {
    console.error('Error fetching profile:', error.message);
    return { 
      id: '', 
      username: 'Unknown User', 
      avatar: undefined 
    };
  }
};

/**
 * Updates the status of a participation
 */
export const updateParticipationStatus = async (
  participationId: string, 
  status: string
): Promise<MissionApprovalResponse> => {
  try {
    console.log(`Updating participation ${participationId} to ${status} using handle_mission_approval function`);
    
    // Use our secure database function to handle the approval process
    const { data, error } = await supabase
      .rpc('handle_mission_approval', { 
        p_participation_id: participationId,
        p_status: status
      });
      
    if (error) {
      console.error('Error updating participation status:', error);
      throw error;
    }
    
    console.log('Mission approval result:', data);
    
    // Type assertion for the response
    const response = data as unknown as MissionApprovalResponse;
    
    // If points were awarded, show additional information
    if (status === 'APPROVED' && response?.points_awarded) {
      console.log(`Successfully awarded ${response.points_awarded} points to user ${response.user_id}`);
      console.log(`New points total: ${response.new_points_total}`);
    }
    
    return response;
  } catch (error: any) {
    console.error('Error updating participation status:', error);
    throw error;
  }
};
