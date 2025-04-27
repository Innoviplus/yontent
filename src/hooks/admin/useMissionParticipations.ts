
import { useState, useEffect, useCallback } from 'react';
import { 
  fetchMissionParticipations,
  fetchMissionParticipationsWithFilters, 
  approveParticipation, 
  rejectParticipation,
  updateMissionParticipationStatus
} from './api/missionParticipationsApi';
import { ParticipationStatus, MissionParticipation } from './api/types/participationTypes';
import { toast } from 'sonner';

export type { MissionParticipation } from './api/types/participationTypes';

export const useMissionParticipations = () => {
  const [participations, setParticipations] = useState<MissionParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ParticipationStatus | null>(null);
  const [selectedParticipation, setSelectedParticipation] = useState<MissionParticipation | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Initial load of participations
  useEffect(() => {
    loadParticipations();
    
    // Set up auto-refresh interval (every 90 seconds)
    const intervalId = setInterval(() => {
      console.log("Auto-refreshing participations...");
      refreshParticipations(true);
    }, 90000);
    
    return () => clearInterval(intervalId);
  }, []);

  const loadParticipations = useCallback(async (status?: ParticipationStatus) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading participations with filter:', status || filter);

      let response;
      if (status || filter) {
        response = await fetchMissionParticipationsWithFilters({ 
          status: status || filter as ParticipationStatus 
        });
      } else {
        response = await fetchMissionParticipations();
      }
      
      if (response.success && response.participations) {
        console.log('Participations loaded:', response.participations.length);
        setParticipations(response.participations);
      } else {
        const errorMessage = response.error || 'Failed to load participations';
        console.error('Error response:', errorMessage);
        setError(errorMessage);
        
        // Only toast for non-silent refreshes
        if (!isRefreshing) {
          toast.error('Failed to load mission participations');
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      console.error('Error in loadParticipations:', errorMessage);
      setError(errorMessage);
      
      if (!isRefreshing) {
        toast.error('Error loading mission participations');
      }
    } finally {
      setLoading(false);
    }
  }, [filter, isRefreshing]);
  
  const refreshParticipations = async (silent: boolean = false) => {
    if (!silent) {
      setIsRefreshing(true);
      toast.info('Refreshing participations...');
    }
    await loadParticipations();
    if (!silent) {
      setIsRefreshing(false);
      toast.success('Participations refreshed');
    }
  };
  
  const handleApproveParticipation = async (id: string): Promise<boolean> => {
    try {
      setProcessingId(id);
      toast.info('Approving participation...');
      const result = await approveParticipation(id);
      if (result) {
        toast.success('Participation approved successfully');
        await refreshParticipations();
      } else {
        toast.error('Failed to approve participation');
      }
      return result;
    } catch (error) {
      console.error('Error approving participation:', error);
      toast.error('Error occurred while approving participation');
      return false;
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectParticipation = async (id: string): Promise<boolean> => {
    try {
      setProcessingId(id);
      toast.info('Rejecting participation...');
      const result = await rejectParticipation(id);
      if (result) {
        toast.success('Participation rejected successfully');
        await refreshParticipations();
      } else {
        toast.error('Failed to reject participation');
      }
      return result;
    } catch (error) {
      console.error('Error rejecting participation:', error);
      toast.error('Error occurred while rejecting participation');
      return false;
    } finally {
      setProcessingId(null);
    }
  };
  
  const selectParticipation = (participation: MissionParticipation) => {
    setSelectedParticipation(participation);
  };
  
  const clearSelectedParticipation = () => {
    setSelectedParticipation(null);
  };

  return {
    participations,
    loading,
    isLoading: loading,
    isRefreshing,
    error,
    filter,
    setFilter,
    loadParticipations,
    refreshParticipations,
    approveParticipation: handleApproveParticipation,
    rejectParticipation: handleRejectParticipation,
    selectedParticipation,
    selectParticipation,
    clearSelectedParticipation,
    processingId,
    updateMissionParticipationStatus
  };
};
