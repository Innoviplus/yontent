
import { createContext, useContext, ReactNode } from 'react';
import { useAuthState } from './useAuthState';
import { usePhoneAuth } from './phoneAuth';
import { useEmailAuth } from './emailAuth';
import { AuthContextType } from './types';
import { signOut } from '@/services/auth/sessionAuth';
import { useAuthSubscription } from '@/hooks/auth/useAuthSubscription';

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

  useAuthSubscription({
    setSession,
    setUser,
    setLoading,
    setUserProfile
  });

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
