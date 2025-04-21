
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile } from '@/services/profile/profileService';
import { Session, User } from '@supabase/supabase-js';

interface UseAuthSubscriptionProps {
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setUserProfile: (profile: any) => void;
}

export function useAuthSubscription({
  setSession,
  setUser,
  setLoading,
  setUserProfile
}: UseAuthSubscriptionProps) {
  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    
    setLoading(true);
    
    // Important: First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        
        // First do only synchronous updates to prevent blocking
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Then use setTimeout to prevent blocking for async operations
        if (newSession?.user) {
          setTimeout(async () => {
            try {
              const data = await fetchUserProfile(newSession.user!.id, newSession.user!.email);
              console.log("Profile data fetched on auth change:", data ? "success" : "not found");
              setUserProfile(data);
            } catch (err) {
              console.error("Error fetching profile on auth change:", err);
              setUserProfile(null);
            } finally {
              setLoading(false);
            }
          }, 0);
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    // Then check for initial session - this prevents race conditions
    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (error) {
        console.error("Error getting initial session:", error);
        setLoading(false);
        return;
      }
      
      console.log("Initial session check:", currentSession ? `Found session for ${currentSession.user.email}` : "No session");
      
      // First do synchronous updates
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Then use setTimeout to prevent blocking for async operations
      if (currentSession?.user) {
        setTimeout(async () => {
          try {
            const data = await fetchUserProfile(currentSession.user.id, currentSession.user.email);
            console.log("Initial profile data:", data ? "success" : "not found");
            setUserProfile(data);
          } catch (err) {
            console.error("Error fetching initial profile:", err);
            setUserProfile(null);
          } finally {
            setLoading(false);
          }
        }, 0);
      } else {
        setLoading(false);
      }
    });

    // Clean up subscription on unmount
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setLoading, setUserProfile]);
}
