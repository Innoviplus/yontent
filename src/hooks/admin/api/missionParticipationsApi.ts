
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MissionParticipation {
  id: string;
  missionId: string;
  userId: string;
  status: string;
  submissionData: any;
  createdAt: Date;
  updatedAt: Date;
  userName?: string;
  userAvatar?: string;
  missionTitle?: string;
  missionDescription?: string;
  missionPointsReward?: number;
  missionType?: string;
}

export interface MissionParticipationFilters {
  status?: string;
  missionId?: string;
  userId?: string;
  page?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  error?: string;
  participations?: T[];
}

export const fetchMissionParticipations = async (): Promise<ApiResponse<MissionParticipation>> => {
  try {
    let query = supabase
      .from('mission_participations')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          extended_data
        ),
        missions:mission_id (
          title,
          description,
          points_reward,
          type
        )
      `)
      .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching mission participations:', error);
      return { success: false, error: error.message };
    }

    // Transform data to match MissionParticipation interface
    const transformedData: MissionParticipation[] = data.map((item) => {
      // Handle possible error responses safely
      const userProfile = item.profiles || {};
      const mission = item.missions || {};
      
      return {
        id: item.id,
        missionId: item.mission_id,
        userId: item.user_id,
        status: item.status,
        submissionData: item.submission_data,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
        userName: userProfile.username || 'Anonymous',
        userAvatar: userProfile.extended_data?.avatarUrl,
        missionTitle: mission.title,
        missionDescription: mission.description,
        missionPointsReward: mission.points_reward,
        missionType: mission.type
      };
    });

    return {
      success: true,
      participations: transformedData
    };
  } catch (error: any) {
    console.error('Error in fetchMissionParticipations:', error);
    return { success: false, error: error.message };
  }
};

export const approveParticipation = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get the participation details
    const { data: participation, error: fetchError } = await supabase
      .from('mission_participations')
      .select('*,missions(points_reward),user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }

    // Check if already approved
    if (participation.status === 'APPROVED') {
      return { success: true, error: 'This submission was already approved' };
    }

    // Update status to APPROVED
    const { error: updateError } = await supabase
      .from('mission_participations')
      .update({ 
        status: 'APPROVED',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Award points to the user
    const pointsToAward = participation.missions?.points_reward || 0;
    if (pointsToAward > 0) {
      const { error: pointsError } = await supabase.rpc('increment_points', {
        user_id_param: participation.user_id,
        points_amount_param: pointsToAward
      });

      if (pointsError) {
        console.error('Error awarding points:', pointsError);
        // Continue despite points error, but log it
      } else {
        // Log the points transaction
        await supabase.from('point_transactions').insert({
          user_id: participation.user_id,
          amount: pointsToAward,
          type: 'MISSION_COMPLETION',
          description: `Completed mission: ${participation.missions?.title || 'Unknown mission'}`
        });
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in approveParticipation:', error);
    return { success: false, error: error.message };
  }
};

export const rejectParticipation = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if already rejected
    const { data: participation, error: fetchError } = await supabase
      .from('mission_participations')
      .select('status')
      .eq('id', id)
      .single();

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }

    if (participation.status === 'REJECTED') {
      return { success: true, error: 'This submission was already rejected' };
    }

    // Update status to REJECTED
    const { error: updateError } = await supabase
      .from('mission_participations')
      .update({ 
        status: 'REJECTED',
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in rejectParticipation:', error);
    return { success: false, error: error.message };
  }
};

// Export the utility hook for better organization
export const useMissionParticipationsApi = () => {
  const fetchMissionParticipationsWithFilters = async (
    filters: MissionParticipationFilters = {}
  ) => {
    try {
      const pageSize = filters.pageSize || 10;
      const page = filters.page || 0;
      const start = page * pageSize;
      const end = start + pageSize - 1;

      let query = supabase
        .from('mission_participations')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            extended_data
          ),
          missions:mission_id (
            title,
            points_reward
          )
        `, { count: 'exact' });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.missionId) {
        query = query.eq('mission_id', filters.missionId);
      }

      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }

      // Apply pagination
      query = query.range(start, end).order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      // Transform data to match MissionParticipation interface
      const transformedData: MissionParticipation[] = data.map((item) => {
        const userProfile = item.profiles || {};
        const mission = item.missions || {};
        
        return {
          id: item.id,
          missionId: item.mission_id,
          userId: item.user_id,
          status: item.status,
          submissionData: item.submission_data,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
          userName: userProfile.username || 'Anonymous',
          userAvatar: userProfile.extended_data?.avatarUrl,
          missionTitle: mission.title,
          missionPointsReward: mission.points_reward
        };
      });

      return {
        data: transformedData,
        total: count || 0
      };
    } catch (error: any) {
      console.error('Error fetching mission participations:', error);
      toast.error(`Error: ${error.message}`);
      return { data: [], total: 0 };
    }
  };

  const updateMissionParticipationStatus = async (
    id: string,
    status: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('mission_participations')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error: any) {
      console.error('Error updating mission participation status:', error);
      toast.error(`Error: ${error.message}`);
      return false;
    }
  };

  return {
    fetchMissionParticipationsWithFilters,
    updateMissionParticipationStatus
  };
};
