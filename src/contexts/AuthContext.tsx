
import { createContext, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useAuthProvider } from '@/hooks/auth/useAuthProvider';
import { useAuthMethods } from '@/hooks/auth/useAuthMethods';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (identifier: string, password: string) => Promise<{ error: any }>;
  signUp: (
    username: string,
    password: string, 
    phoneNumber: string
  ) => Promise<{ 
    success: boolean; 
    error: Error | null;
  }>;
  signOut: () => Promise<void>;
  loading: boolean;
  userProfile: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    session,
    user,
    loading,
    userProfile,
    setUser,
    setSession
  } = useAuthProvider();
  
  const { signIn, signUp, signOut } = useAuthMethods();

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        signIn,
        signUp,
        signOut,
        loading,
        userProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
