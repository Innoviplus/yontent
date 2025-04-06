
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  fetchMissionParticipations,
  fetchMissionParticipationsWithFilters,
  approveParticipation,
  rejectParticipation,
  MissionParticipation
} from './api/missionParticipationsApi';
import { ParticipationStatus } from './api/types/participationTypes';

export const useMissionParticipations = (initialFilter?: ParticipationStatus) => {
  const [participations, setParticipations] = useState<MissionParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ParticipationStatus | undefined>(initialFilter);
  const [selectedParticipation, setSelectedParticipation] = useState<MissionParticipation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to load participations
  const loadParticipations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (filter) {
        response = await fetchMissionParticipationsWithFilters({ status: filter });
      } else {
        response = await fetchMissionParticipations();
      }
      
      if (response.success && response.participations) {
        // Use setParticipations with the correct type
        setParticipations([...response.participations]);
      } else {
        setError(response.error || 'Failed to load participations');
      }
    } catch (err) {
      console.error('Error in loadParticipations:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load participations on initial render and when filter changes
  useEffect(() => {
    loadParticipations();
  }, [filter]);

  // Function to handle approving participation
  const handleApprove = async (participationId: string) => {
    try {
      const success = await approveParticipation(participationId);
      
      if (success) {
        toast.success('Participation approved successfully');
        await loadParticipations();
      } else {
        toast.error('Failed to approve participation');
      }
    } catch (err) {
      console.error('Error approving participation:', err);
      toast.error('An error occurred while approving');
    }
  };

  // Function to handle rejecting participation
  const handleReject = async (participationId: string) => {
    try {
      const success = await rejectParticipation(participationId);
      
      if (success) {
        toast.success('Participation rejected successfully');
        await loadParticipations();
      } else {
        toast.error('Failed to reject participation');
      }
    } catch (err) {
      console.error('Error rejecting participation:', err);
      toast.error('An error occurred while rejecting');
    }
  };

  // Function to open dialog with selected participation
  const openParticipationDetails = (participation: MissionParticipation) => {
    setSelectedParticipation(participation);
    setIsDialogOpen(true);
  };

  // Function to close dialog
  const closeParticipationDetails = () => {
    setIsDialogOpen(false);
  };

  return {
    participations,
    loading,
    error,
    filter,
    setFilter,
    selectedParticipation,
    isDialogOpen,
    openParticipationDetails,
    closeParticipationDetails,
    handleApprove,
    handleReject,
    refreshParticipations: loadParticipations
  };
};
