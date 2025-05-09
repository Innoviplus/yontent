
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Mission } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { useMissionFormatters } from './useMissionFormatters';
import { useStorageBucket } from './useStorageBucket';
import { useMissionOperations } from './useMissionOperations';
import { useAuth } from '@/contexts/AuthContext';

export const useMissionsAdmin = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const { userProfile } = useAuth();
  
  const { formatMissionFromDatabase } = useMissionFormatters();
  const { ensureMissionsStorageBucketExists } = useStorageBucket();

  const fetchMissions = async () => {
    try {
      console.log("Fetching missions...");
      setIsLoading(true);
      setError(null);
      
      // Check for admin privileges but don't block loading
      const isAdmin = userProfile?.extended_data?.isAdmin || 
                     userProfile?.extended_data?.isSuperAdmin;
      
      if (!isAdmin) {
        console.warn("User doesn't have admin privileges in profile:", userProfile?.id);
        // Continue loading anyway for preview/testing purposes
      }
      
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid response format from database');
      }

      console.log('Raw missions data from database:', data.length, data[0]?.id);

      // Format the missions
      const formattedMissions: Mission[] = data.map(mission => 
        formatMissionFromDatabase(mission)
      );

      console.log('Missions loaded successfully:', formattedMissions.length);
      
      if (formattedMissions.length > 0) {
        console.log('First mission:', formattedMissions[0].id, formattedMissions[0].title);
      } else {
        console.log('No missions found in database');
      }

      setMissions(formattedMissions);
      setLoadAttempts(0); // Reset attempts on success
    } catch (error: any) {
      console.error('Error fetching missions:', error.message);
      setError('Failed to load missions: ' + error.message);
      
      if (loadAttempts === 0) {
        toast.error('Failed to load missions');
      }
      
      setLoadAttempts(prev => prev + 1);
      
      // After failed attempt, set empty array but don't block the UI
      if (loadAttempts >= 0) { // Load on first attempt without waiting
        setMissions([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMissions = async () => {
    setIsRefreshing(true);
    await fetchMissions();
    setIsRefreshing(false);
  };

  // Get CRUD operations with proper refresh handling
  const { addMission, updateMission, deleteMission } = useMissionOperations(refreshMissions);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Try to ensure storage bucket exists but continue even if it fails
        try {
          await ensureMissionsStorageBucketExists();
        } catch (bucketError) {
          console.error("Error creating missions bucket:", bucketError);
          // Continue loading even if bucket creation fails
        }
        
        // Fetch missions data
        await fetchMissions();
      } catch (e) {
        console.error("Error initializing missions admin:", e);
        setIsLoading(false);
        setMissions([]); // Set empty missions to allow rendering
      }
    };
    
    initializeData();
    
    // Force loading state to complete after short timeout
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn("Missions loading timeout reached, forcing completion");
        setIsLoading(false);
      }
    }, 1500); // Reduced timeout to 1.5 seconds
    
    return () => clearTimeout(loadingTimeout);
  }, []);

  return {
    missions,
    isLoading,
    isRefreshing,
    error,
    refreshMissions,
    addMission,
    updateMission,
    deleteMission
  };
};
