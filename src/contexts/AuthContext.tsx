
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as authService from '@/services/auth/authService';
import { fetchUserProfile } from '@/services/profile/profileService';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  userProfile: any | null;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const { toast } = useToast();

  // Method to refresh user profile data
  const refreshUserProfile = async () => {
    if (user) {
      const profileData = await fetchUserProfile(user.id, user.email);
      setUserProfile(profileData);
    }
  };

  useEffect(() => {
    // Set up auth state change listener FIRST to prevent missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log("Auth state changed:", _event);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Defer profile fetch with setTimeout to avoid Supabase SDK deadlocks
        if (newSession?.user) {
          setTimeout(() => {
            fetchUserProfile(newSession.user.id, newSession.user.email).then(data => {
              setUserProfile(data);
            });
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession ? "Found session" : "No session");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id, currentSession.user.email).then(data => {
          setUserProfile(data);
        });
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Enhanced sign-in with error handling
  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    if (result.error) {
      toast({
        title: "Login Failed",
        description: result.error.message,
        variant: "destructive",
      });
    }
    return result;
  };

  // Enhanced sign-up with error handling
  const signUp = async (email: string, password: string, username: string) => {
    const result = await authService.signUp(email, password, username);
    if (result.error) {
      toast({
        title: "Registration Failed",
        description: result.error.message,
        variant: "destructive",
      });
    }
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        signIn,
        signUp,
        signOut: authService.signOut,
        loading,
        userProfile,
        refreshUserProfile,
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
