
import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuthState } from './useAuthState';
import { usePhoneAuth } from './phoneAuth';
import { useEmailAuth } from './emailAuth';
import { AuthContextType } from './types';
import { signOut } from '@/services/auth/sessionAuth';
import { useAuthSubscription } from '@/hooks/auth/useAuthSubscription';
import { fetchUserProfile } from '@/services/profile/profileService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  signIn: async () => ({ error: new Error('AuthProvider not initialized') }),
  signUp: async () => ({ error: new Error('AuthProvider not initialized') }),
  signOut: async () => { throw new Error('AuthProvider not initialized') },
  loading: true,
  userProfile: null,
  refreshUserProfile: async () => null,
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

  // Use the auth subscription hook to update state
  useAuthSubscription({
    setSession,
    setUser,
    setLoading,
    setUserProfile
  });

  // Additional effect to check for session on page load and browser refresh
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("AuthProvider: Checking for existing session");
        setLoading(true);
        
        // Get current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          return;
        }
        
        if (data.session) {
          console.log("AuthProvider: Session found on initialization for", data.session.user.email);
          setSession(data.session);
          setUser(data.session.user);
          
          // Fetch profile data if we have a user
          if (data.session.user) {
            try {
              const profileData = await fetchUserProfile(data.session.user.id, data.session.user.email);
              console.log("Initial profile loaded:", profileData ? "success" : "not found");
              setUserProfile(profileData);
            } catch (profileError) {
              console.error("Error fetching initial profile:", profileError);
            }
          }
        } else {
          console.log("AuthProvider: No session found on initialization");
        }
      } catch (error) {
        console.error("Error checking initial session:", error);
        toast.error("Error verifying your session");
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const handleSignOut = async () => {
    try {
      console.log("AuthContext: Signing out user");
      await supabase.auth.signOut();
      console.log("AuthContext: Supabase signOut completed");
      
      // Clear local state
      setSession(null);
      setUser(null);
      setUserProfile(null);
      
      return { error: null };
    } catch (error) {
      console.error("Sign out error:", error);
      return { error };
    }
  };

  const refreshUserProfile = async () => {
    if (user) {
      try {
        console.log("Refreshing user profile for:", user.id);
        const profileData = await fetchUserProfile(user.id, user.email);
        console.log("Refreshed profile data:", profileData);
        setUserProfile(profileData);
        return profileData;
      } catch (error) {
        console.error("Failed to refresh user profile:", error);
        return null;
      }
    }
    return null;
  };

  const contextValue: AuthContextType = {
    session,
    user,
    signIn,
    signUp,
    signOut: handleSignOut,
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
