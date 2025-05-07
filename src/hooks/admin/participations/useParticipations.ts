
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Participation } from './types';
import { fetchParticipations, updateParticipationStatus } from './participationService';
import { useParticipationTransformer } from './useParticipationTransformer';

export const useParticipations = (statusFilter: string | null = null) => {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { transformParticipationsWithProfiles } = useParticipationTransformer();

  const fetchParticipationsData = useCallback(async () => {
    console.log('Fetching participations with status filter:', statusFilter);
    try {
      setLoading(true);
      
      // Fetch raw participations data
      const data = await fetchParticipations(statusFilter);
      
      // Transform data to ensure proper typing and add profile information
      const transformedData = await transformParticipationsWithProfiles(data);
      
      setParticipations(transformedData);
    } catch (error: any) {
      console.error('Error fetching participations:', error.message);
      setError(error.message);
      toast.error('Failed to load mission participations');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, transformParticipationsWithProfiles]);

  const handleUpdateStatus = async (id: string, status: string, participation: Participation) => {
    try {
      await updateParticipationStatus(id, status);
      
      // Refresh the participations list
      await fetchParticipationsData();
      
      toast.success(`Mission submission ${status.toLowerCase()}`);
    } catch (error: any) {
      console.error('Error updating participation status:', error);
      toast.error('Failed to update submission status');
    }
  };

  useEffect(() => {
    fetchParticipationsData();
  }, [fetchParticipationsData]);

  return {
    participations,
    loading,
    error,
    fetchParticipations: fetchParticipationsData,
    handleUpdateStatus
  };
};

// Export types from the types file for convenience
export * from './types';
