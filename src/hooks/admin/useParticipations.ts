
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

// Define types for submission data to help with type checking
export interface ReviewSubmissionData {
  submission_type: 'REVIEW';
  review_id: string;
  content?: string;
  review_images?: string[];
}

export interface ReceiptSubmissionData {
  submission_type: 'RECEIPT';
  receipt_images: string[];
}

export type SubmissionData = ReviewSubmissionData | ReceiptSubmissionData | Record<string, any>;

export interface Participation {
  id: string;
  mission_id: string;
  user_id_p: string;
  status: string;
  submission_data?: Json;
  created_at: string;
  updated_at: string;
  mission?: {
    id: string;
    title: string;
    points_reward: number;
    type: 'REVIEW' | 'RECEIPT';
  };
  profile?: {
    id: string;
    username: string;
    avatar?: string;
  };
}

// Define a type for the profile data to help with type checking
interface ProfileData {
  id?: string;
  username?: string;
  avatar?: string;
}

// Define interface for handle_mission_approval function response
interface MissionApprovalResponse {
  success: boolean;
  user_id: string;
  points_awarded: number;
  new_points_total: number;
  transaction_id: string;
}

export const useParticipations = (statusFilter: string | null = null) => {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipations = useCallback(async () => {
    console.log('Fetching participations with status filter:', statusFilter);
    try {
      setLoading(true);
      
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
      
      // Transform data to ensure proper typing
      const participationsData = data || [];
      const participationsWithProfiles: Participation[] = [];
      
      // Fetch profiles for all participations
      for (const item of participationsData) {
        try {
          // For debugging
          console.log('Processing participation:', item.id);
          
          // Separate query to get the profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id, username, avatar')
            .eq('id', item.user_id_p)
            .single();
            
          if (profileError) {
            console.warn('Error fetching profile:', profileError);
          }
          
          // Safe profile data
          const profile: ProfileData = profileData || { 
            id: '', 
            username: 'Unknown User', 
            avatar: undefined 
          };
          
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
      
      setParticipations(participationsWithProfiles);
    } catch (error: any) {
      console.error('Error fetching participations:', error.message);
      setError(error.message);
      toast.error('Failed to load mission participations');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, status: string, participation: Participation) => {
    try {
      console.log(`Updating participation ${id} to ${status} using handle_mission_approval function`);
      
      // Use our secure database function to handle the approval process
      const { data, error } = await supabase
        .rpc('handle_mission_approval', { 
          p_participation_id: id,
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
      
      // Refresh the participations list
      await fetchParticipations();
      
      toast.success(`Mission submission ${status.toLowerCase()}`);
    } catch (error: any) {
      console.error('Error updating participation status:', error);
      toast.error('Failed to update submission status');
    }
  };

  useEffect(() => {
    fetchParticipations();
  }, [fetchParticipations]);

  return {
    participations,
    loading,
    error,
    fetchParticipations,
    handleUpdateStatus
  };
};
