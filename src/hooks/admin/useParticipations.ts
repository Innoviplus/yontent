
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Participation {
  id: string;
  mission_id: string;
  user_id: string;
  status: string;
  created_at: string;
  mission: {
    title: string;
    type: string;
    points_reward: number;
  };
  profile?: {
    username: string;
  };
  submission_data: {
    receipt_images?: string[];
    review_content?: string;
    review_id?: string;
  };
}

export const useParticipations = (filterStatus: string | null) => {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParticipations = async () => {
    try {
      let query = supabase
        .from('mission_participations')
        .select(`
          *,
          mission:missions(title, type, points_reward)
        `)
        .order('created_at', { ascending: false });

      if (filterStatus) {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const processedData = await Promise.all((data || []).map(async (participation) => {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', participation.user_id)
          .single();
        
        const submissionData = participation.submission_data as any || {};
        
        return {
          id: participation.id,
          mission_id: participation.mission_id,
          user_id: participation.user_id,
          status: participation.status,
          created_at: participation.created_at,
          mission: participation.mission,
          profile: {
            username: profileData?.username || 'Unknown User'
          },
          submission_data: {
            receipt_images: submissionData.receipt_images || [],
            review_content: submissionData.review_content || '',
            review_id: submissionData.review_id || ''
          }
        } as Participation;
      }));
      
      setParticipations(processedData);
    } catch (error) {
      console.error('Error fetching participations:', error);
      toast.error('Failed to load participations');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string, participation: Participation) => {
    try {
      const { error: updateError } = await supabase
        .from('mission_participations')
        .update({ status: newStatus })
        .eq('id', id);

      if (updateError) throw updateError;

      if (newStatus === 'APPROVED') {
        const pointAmount = participation.mission.points_reward;
        
        const { data: transactionData, error: transactionError } = await supabase.rpc(
          'admin_add_point_transaction',
          {
            p_user_id: participation.user_id,
            p_amount: pointAmount,
            p_type: 'EARNED',
            p_description: `Earned ${pointAmount} points for completing mission: ${participation.mission.title}`
          }
        );

        if (transactionError) throw transactionError;

        const { error: pointsError } = await supabase.rpc(
          'increment_points',
          {
            user_id_param: participation.user_id,
            points_amount_param: pointAmount
          }
        );

        if (pointsError) throw pointsError;

        const { data: profileData } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', participation.user_id)
          .single();
          
        const newPoints = (profileData?.points || 0) + pointAmount;
        
        const { error: updatePointsError } = await supabase
          .from('profiles')
          .update({ points: newPoints })
          .eq('id', participation.user_id);
          
        if (updatePointsError) throw updatePointsError;

        toast.success(`Awarded ${pointAmount} points to ${participation.profile?.username}`);
      }

      toast.success(`Submission ${newStatus.toLowerCase()}`);
      fetchParticipations();
    } catch (error: any) {
      console.error('Error updating participation:', error);
      toast.error('Failed to update submission status');
    }
  };

  return {
    participations,
    loading,
    fetchParticipations,
    handleUpdateStatus
  };
};
