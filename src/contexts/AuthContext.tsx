
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

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
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return;
    }

    // For debugging
    console.log('User profile data:', data);

    setUserProfile(data);
  }

  const signIn = async (identifier: string, password: string) => {
    try {
      let error;
      
      // Check if the identifier is an email or phone number
      const isEmail = identifier.includes('@');
      
      if (isEmail) {
        // Sign in with email
        const { error: emailError } = await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        });
        error = emailError;
      } else {
        // Sign in with phone number
        const { error: phoneError } = await supabase.auth.signInWithPassword({
          phone: identifier,
          password,
        });
        error = phoneError;
      }
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      sonnerToast.success('Welcome back!');
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (
    username: string, 
    password: string, 
    phoneNumber: string
  ): Promise<{ 
    success: boolean; 
    error: Error | null;
  }> => {
    try {
      // Create the auth user with phone
      const { data: authData, error: authError } = await supabase.auth.signUp({
        phone: phoneNumber,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Check if the user was created successfully
      if (!authData.user) {
        throw new Error('Failed to create user');
      }

      // We successfully created a user, now create the profile with 10 initial points
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            username,
            phone_number: phoneNumber,
            points: 10, // Start with 10 points instead of 0
          },
        ]);

      if (profileError) {
        // If there was an error creating the profile, delete the auth user and throw error
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw new Error('Database error saving new user: ' + profileError.message);
      }

      // Update session if created successfully
      setUser(authData.user);
      setSession(authData.session);
      
      // Show welcome message with points info
      sonnerToast.success('Account created successfully! You received 10 welcome points.');
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error(String(error)) 
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    sonnerToast.info('You have been signed out.');
  };

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
