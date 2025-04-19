
import { useEffect } from 'react';
import { User } from '@supabase/supabase-js';

interface UseProfileRefreshProps {
  user: User | null;
  loadingAttempts: number;
  initialLoadComplete: boolean;
  setIsLoading: (loading: boolean) => void;
  setInitialLoadComplete: (complete: boolean) => void;
  setLoadingAttempts: (attempts: number) => void;
  refreshUserProfile: () => Promise<any>;
}

export const useProfileRefresh = ({
  user,
  loadingAttempts,
  initialLoadComplete,
  setIsLoading,
  setInitialLoadComplete,
  setLoadingAttempts,
  refreshUserProfile
}: UseProfileRefreshProps) => {
  // Add refresh on mount and when user changes, with a retry limit
  useEffect(() => {
    if (user && loadingAttempts < 3 && !initialLoadComplete) {
      console.log("ProfileTab: Refreshing user profile for user:", user.id, "Attempt:", loadingAttempts + 1);
      setIsLoading(true);
      refreshUserProfile()
        .then((profileData) => {
          console.log("ProfileTab: Profile refreshed successfully:", profileData);
          setIsLoading(false);
          setInitialLoadComplete(true);
          if (!profileData) {
            setLoadingAttempts(prev => prev + 1);
          }
        })
        .catch(err => {
          console.error("ProfileTab: Error refreshing profile:", err);
          setIsLoading(false);
          setLoadingAttempts(prev => prev + 1);
        });
    }
  }, [user, refreshUserProfile, loadingAttempts, initialLoadComplete]);

  // Force-stop loading after 5 seconds
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (!initialLoadComplete) {
      timeout = setTimeout(() => {
        console.log("ProfileTab: Forcing loading state to end after timeout");
        setIsLoading(false);
        setInitialLoadComplete(true);
      }, 5000);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [initialLoadComplete]);
};
