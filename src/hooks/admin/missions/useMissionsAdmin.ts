
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
      
      // Check for admin privileges
      const isAdmin = userProfile?.extended_data?.isAdmin || 
                     userProfile?.extended_data?.isSuperAdmin;
      
      if (!isAdmin) {
        console.warn("User doesn't have admin privileges:", userProfile?.id);
        // Allow access anyways for now, but log the issue
      }
      
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid response format from database');
      }

      const formattedMissions: Mission[] = data.map(mission => 
        formatMissionFromDatabase(mission)
      );

      // Log loaded missions' rich text data for debugging
      console.log('Missions loaded successfully:', formattedMissions.length);
      console.log('Missions loaded with rich text fields:', formattedMissions.map(m => ({
        id: m.id, 
        title: m.title,
        hasRequirements: !!m.requirementDescription,
        hasTerms: !!m.termsConditions,
        hasSteps: !!m.completionSteps,
        hasProductDesc: !!m.productDescription
      })));

      setMissions(formattedMissions);
      setLoadAttempts(0); // Reset attempts on success
    } catch (error: any) {
      console.error('Error fetching missions:', error.message);
      setError('Failed to load missions: ' + error.message);
      
      // Only show toast on first error
      if (loadAttempts === 0) {
        toast.error('Failed to load missions');
      }
      
      setLoadAttempts(prev => prev + 1);
      
      // Return empty array as fallback after multiple failed attempts
      if (loadAttempts >= 2) {
        setMissions([]);
        // Clear loading state to allow UI to render
        setIsLoading(false);
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

  // Hook to get CRUD operations with proper refresh handling
  const { addMission, updateMission, deleteMission } = useMissionOperations(refreshMissions);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Try to ensure the storage bucket exists but continue even if it fails
        try {
          await ensureMissionsStorageBucketExists();
        } catch (bucketError) {
          console.warn("Warning: Error creating missions bucket:", bucketError);
          // Continue loading the component even if bucket creation fails
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
    
    // If loading state persists too long, set timeout to force completion
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn("Missions loading timeout reached, forcing completion");
        setIsLoading(false);
        setError("Loading timed out, showing available data. Try refreshing the page.");
        // Set empty missions array to allow rendering something
        setMissions([]);
      }
    }, 5000); // Reduced timeout to 5 seconds
    
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
