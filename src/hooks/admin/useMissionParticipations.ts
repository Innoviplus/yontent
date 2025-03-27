
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import { addPointsToUser } from '@/hooks/admin/utils/points';

export type MissionParticipation = {
  id: string;
  userId: string;
  missionId: string;
  status: string;
  submissionData: {
    receipt_images?: string[];
    review_id?: string;
    review_images?: string[];
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
      
      // First, get all mission participations
      const { data: participationsData, error: participationsError } = await supabase
        .from('mission_participations')
        .select('*')
        .order('created_at', { ascending: false });

      if (participationsError) {
        throw participationsError;
      }

      // Create an array to store all participations with joined data
      const enrichedParticipations: MissionParticipation[] = [];

      // For each participation, get the associated user and mission data
      for (const participation of participationsData) {
        // Get user profile data
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('username, avatar')
          .eq('id', participation.user_id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
        }

        // Get mission data
        const { data: missionData, error: missionError } = await supabase
          .from('missions')
          .select('title, description, points_reward, type')
          .eq('id', participation.mission_id)
          .single();

        if (missionError) {
          console.error('Error fetching mission data:', missionError);
        }

        // Transform the data to match our frontend model
        enrichedParticipations.push({
          id: participation.id,
          userId: participation.user_id,
          missionId: participation.mission_id,
          status: participation.status,
          submissionData: participation.submission_data as {
            receipt_images?: string[];
            review_id?: string;
            review_images?: string[];
            review_url?: string;
            submission_type: 'RECEIPT' | 'REVIEW';
          },
          createdAt: new Date(participation.created_at),
          userName: userData?.username || 'Unknown User',
          userAvatar: userData?.avatar || undefined,
          missionTitle: missionData?.title || 'Unknown Mission',
          missionDescription: missionData?.description || '',
          missionPointsReward: missionData?.points_reward || 0,
          missionType: missionData?.type as 'RECEIPT' | 'REVIEW' || 'RECEIPT',
        });
      }

      setParticipations(enrichedParticipations);
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
      // First get the participation details to access user ID and mission points
      const { data: participation, error: fetchError } = await supabase
        .from('mission_participations')
        .select('user_id, mission_id, status')
        .eq('id', id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Don't allow approving already approved participations
      if (participation.status === 'APPROVED') {
        toast.info('This submission is already approved');
        return true;
      }

      // Get the mission details to know how many points to award
      const { data: mission, error: missionError } = await supabase
        .from('missions')
        .select('title, points_reward')
        .eq('id', participation.mission_id)
        .single();

      if (missionError) {
        throw missionError;
      }
      
      // Update the participation status
      const { error: updateError } = await supabase
        .from('mission_participations')
        .update({ status: 'APPROVED' })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      // Add points to the user
      const pointsResult = await addPointsToUser(
        participation.user_id,
        mission.points_reward,
        'EARNED',
        'MISSION_REVIEW',
        `Completed mission: ${mission.title}`,
        participation.mission_id
      );

      if (!pointsResult.success) {
        console.error('Error adding points:', pointsResult.error);
        toast.error('Submission approved but failed to add points to user');
        return true;
      }

      toast.success(`Participation approved and ${mission.points_reward} points awarded`);
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
