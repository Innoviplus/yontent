
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export type MissionParticipation = {
  id: string;
  userId: string;
  missionId: string;
  status: string;
  submissionData: {
    receipt_images?: string[];
    review_url?: string;
    submission_type: 'RECEIPT' | 'REVIEW';
  } | null;
  createdAt: Date;
  userName?: string;
  userAvatar?: string;
  missionTitle?: string;
  missionDescription?: string;
  missionPointsReward?: number;
  missionType?: 'RECEIPT' | 'REVIEW';
};

export const useMissionParticipations = () => {
  const [participations, setParticipations] = useState<MissionParticipation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchParticipations = async () => {
    try {
      setIsLoading(true);
      
      // Fetch mission participations with mission and user details in a single query
      const { data, error } = await supabase
        .from('mission_participations')
        .select(`
          *,
          missions:mission_id (title, description, points_reward, type),
          profiles:user_id (username, avatar)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match our frontend model
      const formattedParticipations: MissionParticipation[] = data.map(participation => ({
        id: participation.id,
        userId: participation.user_id,
        missionId: participation.mission_id,
        status: participation.status,
        submissionData: participation.submission_data as {
          receipt_images?: string[];
          review_url?: string;
          submission_type: 'RECEIPT' | 'REVIEW';
        },
        createdAt: new Date(participation.created_at),
        userName: participation.profiles?.username || 'Unknown User',
        userAvatar: participation.profiles?.avatar || undefined,
        missionTitle: participation.missions?.title || 'Unknown Mission',
        missionDescription: participation.missions?.description || '',
        missionPointsReward: participation.missions?.points_reward || 0,
        missionType: participation.missions?.type as 'RECEIPT' | 'REVIEW' || 'RECEIPT',
      }));

      setParticipations(formattedParticipations);
    } catch (error: any) {
      console.error('Error fetching mission participations:', error.message);
      toast.error('Failed to load mission participations');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshParticipations = async () => {
    setIsRefreshing(true);
    await fetchParticipations();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchParticipations();
  }, []);

  const approveParticipation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mission_participations')
        .update({ status: 'APPROVED' })
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Participation approved successfully');
      await refreshParticipations();
      return true;
    } catch (error: any) {
      console.error('Error approving participation:', error.message);
      toast.error('Failed to approve participation');
      return false;
    }
  };

  const rejectParticipation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('mission_participations')
        .update({ status: 'REJECTED' })
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Participation rejected successfully');
      await refreshParticipations();
      return true;
    } catch (error: any) {
      console.error('Error rejecting participation:', error.message);
      toast.error('Failed to reject participation');
      return false;
    }
  };

  return {
    participations,
    isLoading,
    isRefreshing,
    refreshParticipations,
    approveParticipation,
    rejectParticipation
  };
};
