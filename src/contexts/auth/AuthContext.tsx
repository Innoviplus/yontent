
import { createContext, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserProfile } from '@/services/profile/profileService';
import { useAuthState } from './useAuthState';
import { usePhoneAuth } from './phoneAuth';
import { useEmailAuth } from './emailAuth';
import { AuthContextType } from './types';
import { signOut } from '@/services/auth/sessionAuth';

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  signIn: async () => ({ error: new Error('AuthProvider not initialized') }),
  signUp: async () => ({ error: new Error('AuthProvider not initialized') }),
  signOut: async () => { throw new Error('AuthProvider not initialized') },
  loading: true,
  userProfile: null,
  refreshUserProfile: async () => { throw new Error('AuthProvider not initialized') },
  signUpWithPhone: async () => ({ error: new Error('AuthProvider not initialized') }),
  signInWithPhone: async () => ({ error: new Error('AuthProvider not initialized') }),
  verifyPhoneOtp: async () => ({ error: new Error('AuthProvider not initialized') }),
  resendOtp: async () => ({ error: new Error('AuthProvider not initialized') }),
  completeSignIn: async () => ({ error: new Error('AuthProvider not initialized') }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    session,
    setSession,
    user,
    setUser,
    loading,
    setLoading,
    userProfile,
    setUserProfile
  } = useAuthState();

  const { signIn, signUp } = useEmailAuth();
  const { signUpWithPhone, signInWithPhone, verifyPhoneOtp, resendOtp, completeSignIn } = usePhoneAuth(setUserProfile);

  const refreshUserProfile = async () => {
    if (user) {
      try {
        console.log("Refreshing user profile for:", user.id);
        const profileData = await fetchUserProfile(user.id, user.email);
        console.log("Refreshed profile data:", profileData);
        setUserProfile(profileData);
      } catch (error) {
        console.error("Failed to refresh user profile:", error);
      }
    }
  };

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    
    // Fix: Set loading to true initially to prevent premature access
    setLoading(true);
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        console.log("Auth state changed:", _event, newSession?.user?.id);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          // Use setTimeout to allow database triggers to complete
          setTimeout(async () => {
            try {
              const data = await fetchUserProfile(newSession.user.id, newSession.user.email);
              console.log("Profile data fetched on auth change:", data);
              
              // Check if the profile has missing phone or email and update if needed
              if (data && newSession.user && (!data.phone_number || !data.email)) {
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
                  const { error: updateError } = await supabase
                    .from('profiles')
                    .update(updateData)
                    .eq('id', newSession.user.id);
                    
                  if (updateError) {
                    console.error("Error updating profile with missing data:", updateError);
                  } else {
                    // Re-fetch the profile after update
                    const updatedData = await fetchUserProfile(newSession.user.id, newSession.user.email);
                    setUserProfile(updatedData);
                  }
                } else {
                  setUserProfile(data);
                }
              } else {
                setUserProfile(data);
              }
            } catch (err) {
              console.error("Error fetching profile on auth change:", err);
            } finally {
              setLoading(false);
            }
          }, 500);
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
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
  }, []);

  const contextValue = {
    session,
    user,
    signIn,
    signUp,
    signOut,
    loading,
    userProfile,
    refreshUserProfile,
    signUpWithPhone,
    signInWithPhone,
    verifyPhoneOtp,
    resendOtp,
    completeSignIn,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
