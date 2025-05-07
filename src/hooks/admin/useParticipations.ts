
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

export const useParticipations = (statusFilter: string | null = null) => {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipations = useCallback(async () => {
    console.log('Fetching participations with status filter:', statusFilter);
    try {
      setLoading(true);
      let query = supabase
        .from('mission_participations')
        .select(`
          *,
          mission:missions(*),
          profile:profiles(id, username, avatar)
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
      setParticipations(data || []);
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
          user_id: participation.user_id_p,
          amount: participation.mission.points_reward,
          type: 'EARNED',
          source: participation.mission.type === 'REVIEW' ? 'MISSION_REVIEW' : 'RECEIPT_SUBMISSION',
          description: `Earned from ${participation.mission.title} mission`
        });
        
        // Update user points
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
