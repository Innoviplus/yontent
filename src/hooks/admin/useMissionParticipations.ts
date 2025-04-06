
import { useState } from 'react';
import { 
  fetchMissionParticipations,
  fetchMissionParticipationsWithFilters, 
  approveParticipation, 
  rejectParticipation,
  updateMissionParticipationStatus
} from './api/missionParticipationsApi';
import { MissionParticipation as ApiMissionParticipation, ParticipationStatus } from './api/types/participationTypes';
import { MissionParticipation } from './types/missionParticipationTypes';

export type { MissionParticipation } from './types/missionParticipationTypes';

export const useMissionParticipations = () => {
  const [participations, setParticipations] = useState<MissionParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<ParticipationStatus>('PENDING');
  const [selectedParticipation, setSelectedParticipation] = useState<MissionParticipation | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadParticipations = async (status?: ParticipationStatus) => {
    try {
      setLoading(true);
      setError('');
      
      const filterToUse = status || filter;
      const response = await fetchMissionParticipationsWithFilters({ status: filterToUse });
      
      if (response.success && response.participations) {
        // Transform API response to the format expected by components
        const transformedParticipations = response.participations.map(p => ({
          id: p.id,
          userId: p.userId,
          missionId: p.missionId,
          status: p.status,
          submissionData: p.submissionData,
          createdAt: new Date(p.createdAt),
          userName: p.user.username,
          userAvatar: p.user.avatar || undefined,
          missionTitle: p.mission.title,
          missionDescription: p.mission.description,
          missionPointsReward: p.mission.pointsReward,
          missionType: p.mission.type
        }));
        
        setParticipations(transformedParticipations);
      } else {
        setError(response.error || 'Failed to load participations');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred loading participations');
    } finally {
      setLoading(false);
    }
  };
  
  const refreshParticipations = async () => {
    setIsRefreshing(true);
    await loadParticipations();
    setIsRefreshing(false);
  };
  
  const handleApproveParticipation = async (id: string) => {
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

  const handleRejectParticipation = async (id: string) => {
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
