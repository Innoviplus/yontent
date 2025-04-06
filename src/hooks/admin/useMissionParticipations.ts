
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  MissionParticipation,
  fetchMissionParticipations,
  approveParticipation,
  rejectParticipation
} from './api/missionParticipationsApi';

/**
 * Hook for managing mission participations state and actions
 */
export const useMissionParticipations = () => {
  const [participations, setParticipations] = useState<MissionParticipation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Load participations data
   */
  const loadParticipations = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await fetchMissionParticipations();
      
      if (result.error) {
        toast.error('Failed to load mission participations');
      } else {
        setParticipations(result.participations || []);
      }
    } catch (error) {
      console.error('Error loading participations:', error);
      toast.error('An error occurred while loading participations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh participations data
   */
  const refreshParticipations = useCallback(async () => {
    setIsRefreshing(true);
    await loadParticipations();
    setIsRefreshing(false);
  }, [loadParticipations]);

  /**
   * Approve a participation
   */
  const handleApproveParticipation = useCallback(async (id: string) => {
    try {
      const result = await approveParticipation(id);
      
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
  }, [refreshParticipations]);

  /**
   * Reject a participation
   */
  const handleRejectParticipation = useCallback(async (id: string) => {
    try {
      const result = await rejectParticipation(id);
      
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
  }, [refreshParticipations]);

  // Load participations on mount
  useEffect(() => {
    loadParticipations();
  }, [loadParticipations]);

  return {
    participations,
    isLoading,
    isRefreshing,
    refreshParticipations,
    approveParticipation: handleApproveParticipation,
    rejectParticipation: handleRejectParticipation
  };
};

export type { MissionParticipation } from './api/missionParticipationsApi';
