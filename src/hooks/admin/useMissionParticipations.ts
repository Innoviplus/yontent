
import { useState, useEffect } from 'react';
import { 
  fetchMissionParticipations,
  fetchMissionParticipationsWithFilters, 
  approveParticipation, 
  rejectParticipation,
  updateMissionParticipationStatus
} from './api/missionParticipationsApi';
import { ParticipationStatus } from './api/types/participationTypes';
import { MissionParticipation } from './types/missionParticipationTypes';

export type { MissionParticipation } from './types/missionParticipationTypes';

export const useMissionParticipations = () => {
  const [participations, setParticipations] = useState<MissionParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<ParticipationStatus | null>(null);
  const [selectedParticipation, setSelectedParticipation] = useState<MissionParticipation | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Initial load of participations
  useEffect(() => {
    loadParticipations();
    // Set up auto-refresh interval (every 60 seconds)
    const intervalId = setInterval(() => {
      console.log("Auto-refreshing participations...");
      refreshParticipations(true);
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const loadParticipations = async (status?: ParticipationStatus) => {
    try {
      setLoading(true);
      setError('');
      
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
        console.log('Setting participations:', response.participations.length, response.participations);
        setParticipations(response.participations);
      } else {
        console.error('Error response:', response);
        setError(response.error || 'Failed to load participations');
      }
    } catch (error: any) {
      console.error('Error in loadParticipations:', error);
      setError(error.message || 'An error occurred loading participations');
    } finally {
      setLoading(false);
    }
  };
  
  const refreshParticipations = async (silent: boolean = false) => {
    if (!silent) setIsRefreshing(true);
    await loadParticipations();
    if (!silent) setIsRefreshing(false);
  };
  
  const handleApproveParticipation = async (id: string): Promise<boolean> => {
    try {
      setProcessingId(id);
      const result = await approveParticipation(id);
      if (result) {
        await refreshParticipations();
      }
      return result;
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectParticipation = async (id: string): Promise<boolean> => {
    try {
      setProcessingId(id);
      const result = await rejectParticipation(id);
      if (result) {
        await refreshParticipations();
      }
      return result;
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
