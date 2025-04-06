
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  MissionParticipation,
  fetchMissionParticipations,
  approveParticipation as approveParticipationApi,
  rejectParticipation as rejectParticipationApi
} from './api/missionParticipationsApi';

export type { MissionParticipation } from './api/missionParticipationsApi';

export const useMissionParticipations = () => {
  const [participations, setParticipations] = useState<MissionParticipation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadParticipations = async () => {
    try {
      setIsLoading(true);
      const result = await fetchMissionParticipations();
      
      if (result.error) {
        toast.error('Failed to load mission participations');
      } else {
        setParticipations(result.participations || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshParticipations = async () => {
    setIsRefreshing(true);
    await loadParticipations();
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadParticipations();
  }, []);

  const approveParticipation = async (id: string) => {
    try {
      const result = await approveParticipationApi(id);
      
      if (result.error) {
        if (result.success) {
          // This handles the case where the submission was already approved
          toast.info(result.error);
          return true;
        } else {
          toast.error('Failed to approve participation');
          return false;
        }
      }
      
      toast.success('Participation approved and points awarded');
      await refreshParticipations();
      return true;
    } catch (error: any) {
      console.error('Error in approveParticipation hook:', error.message);
      toast.error('Failed to approve participation');
      return false;
    }
  };

  const rejectParticipation = async (id: string) => {
    try {
      const result = await rejectParticipationApi(id);
      
      if (!result.success) {
        toast.error('Failed to reject participation');
        return false;
      }
      
      toast.success('Participation rejected successfully');
      await refreshParticipations();
      return true;
    } catch (error: any) {
      console.error('Error in rejectParticipation hook:', error.message);
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
