
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Mission } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useMissionFormatters } from './useMissionFormatters';
import { useStorageBucket } from './useStorageBucket';
import { useMissionOperations } from './useMissionOperations';

export const useMissionsAdmin = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { formatMissionFromDatabase } = useMissionFormatters();
  const { ensureMissionsStorageBucketExists } = useStorageBucket();

  const fetchMissions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedMissions: Mission[] = data.map(mission => 
        formatMissionFromDatabase(mission)
      );

      // Log loaded missions' rich text data for debugging
      console.log('Missions loaded with rich text fields:', formattedMissions.map(m => ({
        id: m.id, 
        title: m.title,
        hasRequirements: !!m.requirementDescription,
        hasTerms: !!m.termsConditions,
        hasSteps: !!m.completionSteps,
        hasProductDesc: !!m.productDescription
      })));

      setMissions(formattedMissions);
    } catch (error: any) {
      console.error('Error fetching missions:', error.message);
      toast.error('Failed to load missions');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMissions = async () => {
    setIsRefreshing(true);
    await fetchMissions();
    setIsRefreshing(false);
  };

  // Hook to get CRUD operations with proper refresh handling
  const { addMission, updateMission, deleteMission } = useMissionOperations(refreshMissions);

  useEffect(() => {
    // Ensure the storage bucket exists
    ensureMissionsStorageBucketExists();
    fetchMissions();
  }, []);

  return {
    missions,
    isLoading,
    isRefreshing,
    refreshMissions,
    addMission,
    updateMission,
    deleteMission
  };
};
