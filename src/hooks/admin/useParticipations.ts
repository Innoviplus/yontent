
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export interface Participation {
  id: string;
  mission_id: string;
  user_id_p: string;
  status: string;
  submission_data?: any;
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

export const useParticipations = (statusFilter: string | null = null) => {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipations = useCallback(async () => {
    console.log('Fetching participations with status filter:', statusFilter);
    try {
      setLoading(true);
      
      // Modified query to separately fetch user profiles
      let query = supabase
        .from('mission_participations')
        .select(`
          *,
          mission:missions(*)
        `)
        .order('created_at', { ascending: false });

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
        // For debugging
        console.log('Processing item:', item);
        
        try {
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
        
          participationsWithProfiles.push({
            ...item,
            mission: item.mission ? {
              ...item.mission,
              type: (item.mission.type === 'REVIEW' || item.mission.type === 'RECEIPT') 
                ? item.mission.type 
                : 'REVIEW' // Default to 'REVIEW' if type is invalid
            } : undefined,
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
              ...item.mission,
              type: (item.mission.type === 'REVIEW' || item.mission.type === 'RECEIPT') 
                ? item.mission.type 
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
      console.log(`Updating participation ${id} to ${status}`);
      
      const { error } = await supabase
        .from('mission_participations')
        .update({ status })
        .eq('id', id);
        
      if (error) throw error;
      
      // If approved, award points to the user
      if (status === 'APPROVED' && participation.mission?.points_reward) {
        // Insert point transaction
        await supabase.from('point_transactions').insert({
          user_id: participation.user_id_p, // Use user_id_p instead of user_id to avoid ambiguity
          amount: participation.mission.points_reward,
          type: 'EARNED',
          source: participation.mission.type === 'REVIEW' ? 'MISSION_REVIEW' : 'RECEIPT_SUBMISSION',
          description: `Earned from ${participation.mission.title} mission`
        });
        
        // Update user points using user_id_p to avoid ambiguity
        await supabase.rpc('increment_points', {
          user_id_param: participation.user_id_p,
          points_amount_param: participation.mission.points_reward
        });
        
        console.log(`Awarded ${participation.mission.points_reward} points to user ${participation.user_id_p}`);
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
