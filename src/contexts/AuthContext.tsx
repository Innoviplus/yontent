import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

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

    console.log('User profile data:', data);

    setUserProfile(data);
    
    const userEmail = user?.email;
    if (userEmail && data && data.extended_data) {
      const extendedData = typeof data.extended_data === 'object' && !Array.isArray(extendedData) ? data.extended_data : {};
      
      if (!extendedData.email) {
        const updatedExtendedData = {
          ...extendedData,
          email: userEmail
        };

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            extended_data: updatedExtendedData 
          })
          .eq('id', userId);
          
        if (updateError) {
          console.error('Error updating user email:', updateError);
        }
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
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

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { data: existingUsers, error: emailCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email);
        
      if (emailCheckError) {
        console.error('Error checking existing email:', emailCheckError);
      } else if (existingUsers && existingUsers.length > 0) {
        toast({
          title: "Registration Failed",
          description: "This email is already registered. Please use a different email or try to log in.",
          variant: "destructive",
        });
        return { error: { message: "Email already registered" } };
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            email, // Store email in user metadata
          },
        },
      });
      
      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      sonnerToast.success('Account created successfully! Please check your email for confirmation.');
      return { error: null };
    } catch (error: any) {
      let errorMessage = error.message;
      
      if (errorMessage && (
        errorMessage.includes('duplicate key') || 
        errorMessage.includes('profiles_username_key') ||
        errorMessage.includes('Database error saving new user')
      )) {
        errorMessage = 'This username is already taken. Please choose a different one.';
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { error: { ...error, message: errorMessage } };
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
