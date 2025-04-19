
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
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          try {
            const data = await fetchUserProfile(newSession.user.id, newSession.user.email);
            console.log("Profile data fetched on auth change:", data);
            
            if (data && newSession.user) {
              // Check for missing profile data that might be in user metadata
              const needsUpdate = (!data.phone_number || !data.email);
              if (needsUpdate) {
                console.log("Updating missing profile data...");
                const userData = newSession.user.user_metadata || {};
                
                const updateData: any = {};
                if (!data.email && newSession.user.email) {
                  updateData.email = newSession.user.email;
                }
                
                if (!data.phone_number && userData.phone_number) {
                  updateData.phone_number = userData.phone_number;
                  updateData.phone_country_code = userData.phone_country_code || '+';
                }
                
                if (Object.keys(updateData).length > 0) {
                  console.log("Updating profile with metadata:", updateData);
                  const { error: updateError } = await supabase
                    .from('profiles')
                    .update({
                      ...updateData,
                      updated_at: new Date().toISOString()
                    })
                    .eq('id', newSession.user.id);
                    
                  if (updateError) {
                    console.error("Error updating profile with missing data:", updateError);
                  } else {
                    // Fetch updated profile data
                    const updatedData = await fetchUserProfile(newSession.user.id, newSession.user.email);
                    console.log("Updated profile data:", updatedData);
                    setUserProfile(updatedData);
                  }
                } else {
                  setUserProfile(data);
                }
              } else {
                setUserProfile(data);
              }
            } else if (data) {
              setUserProfile(data);
            } else {
              console.log("No profile data found for user:", newSession.user.id);
              setUserProfile(null);
            }
          } catch (err) {
            console.error("Error fetching profile on auth change:", err);
            setUserProfile(null);
          } finally {
            setLoading(false);
          }
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession ? `Found session for ${currentSession.user.email}` : "No session");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id, currentSession.user.email)
          .then(data => {
            console.log("Initial profile data:", data);
            setUserProfile(data);
          })
          .catch(err => {
            console.error("Error fetching initial profile:", err);
            setUserProfile(null);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setUser, setLoading, setUserProfile]);
}
