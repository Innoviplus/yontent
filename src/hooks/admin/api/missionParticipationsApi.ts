
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FetchParticipationsResult, MissionParticipation, ParticipationActionResult } from '../types/missionParticipationTypes';
import { addPointsToUser } from '@/hooks/admin/utils/points';

/**
 * Fetches all mission participations with user and mission data
 */
export const fetchMissionParticipations = async (): Promise<FetchParticipationsResult> => {
  try {
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

    return { participations: enrichedParticipations };
  } catch (error: any) {
    console.error('Error fetching mission participations:', error.message);
    return { 
      participations: [],
      error: error.message 
    };
  }
};

/**
 * Approves a mission participation and awards points to the user
 */
export const approveParticipation = async (id: string): Promise<ParticipationActionResult> => {
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
      return { 
        success: true,
        error: 'This submission is already approved'
      };
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
      return {
        success: true,
        error: 'Submission approved but failed to add points to user'
      };
    }

    return { 
      success: true
    };
  } catch (error: any) {
    console.error('Error approving participation:', error.message);
    return { 
      success: false,
      error: error.message
    };
  }
};

/**
 * Rejects a mission participation
 */
export const rejectParticipation = async (id: string): Promise<ParticipationActionResult> => {
  try {
    const { error } = await supabase
      .from('mission_participations')
      .update({ status: 'REJECTED' })
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error rejecting participation:', error.message);
    return { 
      success: false,
      error: error.message
    };
  }
};
