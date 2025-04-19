
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
  signUpWithPhone: (phone: string, username: string, email: string, password?: string) => Promise<{ error: any }>;
  signInWithPhone: (phone: string, password: string) => Promise<{ error: any }>;
}

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
  signInWithPhone: async () => ({ error: new Error('AuthProvider not initialized') })
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const { toast } = useToast();

  const refreshUserProfile = async () => {
    if (user) {
      try {
        const profileData = await fetchUserProfile(user.id, user.email);
        setUserProfile(profileData);
      } catch (error) {
        console.error("Failed to refresh user profile:", error);
      }
    }
  };

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        console.log("Auth state changed:", _event, newSession?.user?.id);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          setTimeout(async () => {
            try {
              const data = await fetchUserProfile(newSession.user.id, newSession.user.email);
              setUserProfile(data);
            } catch (err) {
              console.error("Error fetching profile on auth change:", err);
            }
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession ? `Found session for ${currentSession.user.email}` : "No session");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id, currentSession.user.email)
          .then(data => {
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

  const signInWithPhone = async (phone: string, password: string) => {
    const result = await authService.signInWithPhone(phone, password);
    if (result.error) {
      toast({
        title: "Login Failed",
        description: result.error.message,
        variant: "destructive",
      });
    }
    return result;
  };

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

  const signUpWithPhone = async (phone: string, username: string, email: string, password?: string) => {
    try {
      // Create the base user data object
      const userData: {
        username: string;
        email: string;
        phone_number: string;
        phone_country_code: string;
        password?: string;  // Make password optional in the type
      } = {
        username,
        email,
        phone_number: phone.replace(/\+/g, ''), // Remove + from phone number for storage
        phone_country_code: phone.slice(0, phone.indexOf('+')+1)
      };

      // Only add password to the object if it was provided
      if (password) {
        userData.password = password;
      }

      const { data, error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          data: userData
        }
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const contextValue = {
    session,
    user,
    signIn,
    signUp,
    signOut: authService.signOut,
    loading,
    userProfile,
    refreshUserProfile,
    signUpWithPhone,
    signInWithPhone,
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
