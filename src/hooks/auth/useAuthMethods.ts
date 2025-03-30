
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';
import { useToast } from '@/hooks/use-toast';

export function useAuthMethods() {
  const { toast } = useToast();

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

  return { signIn, signUp, signOut };
}
