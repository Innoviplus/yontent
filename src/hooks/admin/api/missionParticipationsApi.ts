
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
  user?: {
    username: string;
    avatarUrl?: string;
  };
  mission?: {
    title: string;
    pointsReward: number;
  };
}

export interface MissionParticipationFilters {
  status?: string;
  missionId?: string;
  userId?: string;
  page?: number;
  pageSize?: number;
}

export const useMissionParticipationsApi = () => {
  const fetchMissionParticipations = async (
    filters: MissionParticipationFilters = {}
  ): Promise<{ data: MissionParticipation[]; total: number }> => {
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
      const transformedData: MissionParticipation[] = data.map((item) => ({
        id: item.id,
        missionId: item.mission_id,
        userId: item.user_id,
        status: item.status,
        submissionData: item.submission_data,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
        user: item.profiles ? {
          username: item.profiles.username || 'Anonymous',
          avatarUrl: item.profiles.extended_data?.avatarUrl
        } : undefined,
        mission: item.missions ? {
          title: item.missions.title,
          pointsReward: item.missions.points_reward
        } : undefined
      }));

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
    fetchMissionParticipations,
    updateMissionParticipationStatus
  };
};
