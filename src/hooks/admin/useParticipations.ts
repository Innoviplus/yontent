
import { useState, useEffect } from 'react';
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
      setLoading(true);
      let query = supabase
        .from('mission_participations')
        .select(`
          id,
          mission_id,
          user_id,
          status,
          created_at,
          submission_data,
          mission:missions(title, type, points_reward)
        `)
        .order('created_at', { ascending: false });

      if (filterStatus) {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Process the data with proper column qualification to avoid ambiguity
      const processedData = await Promise.all((data || []).map(async (participation) => {
        // Explicitly store the user_id from participation to avoid ambiguity
        const participationUserId = participation.user_id;
        
        // Explicitly use the participation's user_id to get the profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', participationUserId)  // Using the stored user_id variable
          .single();
        
        const submissionData = participation.submission_data as any || {};
        
        return {
          id: participation.id,
          mission_id: participation.mission_id,
          user_id: participationUserId, // Use the stored user_id
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

  useEffect(() => {
    fetchParticipations();
  }, [filterStatus]);

  const handleUpdateStatus = async (id: string, newStatus: string, participation: Participation) => {
    try {
      console.log(`Updating participation ${id} to status: ${newStatus}`);
      
      // Store the user ID in a local variable to avoid ambiguity
      const participationUserId = participation.user_id;
      
      // First, update the participation status
      const { error: updateError } = await supabase
        .from('mission_participations')
        .update({ status: newStatus })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating status:', updateError);
        throw updateError;
      }

      console.log('Status updated successfully');

      // If approving, award points to the user
      if (newStatus === 'APPROVED') {
        const pointAmount = participation.mission.points_reward;
        
        console.log('Awarding points:', {
          userId: participationUserId,
          pointAmount,
          missionTitle: participation.mission.title
        });
        
        // Use admin_add_point_transaction with explicit parameter naming
        const { data: transactionData, error: transactionError } = await supabase.rpc(
          'admin_add_point_transaction',
          {
            p_user_id: participationUserId,
            p_amount: pointAmount,
            p_type: 'EARNED',
            p_description: `Earned ${pointAmount} points for completing mission: ${participation.mission.title}`
          }
        );

        if (transactionError) {
          console.error('Transaction error:', transactionError);
          throw transactionError;
        }
        
        console.log('Transaction added:', transactionData);

        // Update the user's points in the profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', participationUserId)
          .single();

        if (!profileData) {
          throw new Error(`User profile not found for ${participationUserId}`);
        }
          
        const newPoints = (profileData?.points || 0) + pointAmount;
        
        const { error: updatePointsError } = await supabase
          .from('profiles')
          .update({ points: newPoints })
          .eq('id', participationUserId);
          
        if (updatePointsError) {
          console.error('Points update error:', updatePointsError);
          throw updatePointsError;
        }

        console.log(`Points updated: User ${participationUserId} now has ${newPoints} points`);
        toast.success(`Awarded ${pointAmount} points to ${participation.profile?.username || 'user'}`);
      }

      toast.success(`Submission ${newStatus.toLowerCase()} successfully`);
      // Refresh the participations list
      fetchParticipations();
    } catch (error: any) {
      console.error('Error updating participation:', error);
      toast.error('Failed to update submission status', { 
        description: error.message || 'Please try again or contact support'
      });
    }
  };

  return {
    participations,
    loading,
    fetchParticipations,
    handleUpdateStatus
  };
};
