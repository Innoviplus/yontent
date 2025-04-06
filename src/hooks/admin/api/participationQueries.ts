
import { supabase } from '@/integrations/supabase/client';
import { 
  MissionParticipation, 
  MissionParticipationFilters, 
  ApiResponse,
  PaginatedResponse
} from './types/participationTypes';
import { transformParticipationData } from './utils/transformationUtils';
import { toast } from 'sonner';

/**
 * Fetches all mission participations
 */
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

    // Transform data using the utility function
    const transformedData = transformParticipationData(data);

    return {
      success: true,
      participations: transformedData
    };
  } catch (error: any) {
    console.error('Error in fetchMissionParticipations:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetches mission participations with filtering and pagination
 */
export const fetchMissionParticipationsWithFilters = async (
  filters: MissionParticipationFilters = {}
): Promise<PaginatedResponse<MissionParticipation>> => {
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

    // Transform data using the utility function
    const transformedData = transformParticipationData(data);

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
