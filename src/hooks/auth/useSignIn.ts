
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';
import { useToast } from '@/hooks/use-toast';

export function useSignIn() {
  const { toast } = useToast();

  const signIn = async (identifier: string, password: string) => {
    try {
      let error;
      
      // Check if the identifier is an email, phone number, or username
      const isEmail = identifier.includes('@');
      const isPhone = /^\+?\d+$/.test(identifier); // Simple check for phone number format
      
      if (isEmail) {
        // Sign in with email
        console.log('Attempting to sign in with email:', identifier);
        const { error: emailError } = await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        });
        error = emailError;
      } else if (isPhone) {
        // Sign in with phone number
        console.log('Attempting to sign in with phone:', identifier);
        const { error: phoneError } = await supabase.auth.signInWithPassword({
          phone: identifier,
          password,
        });
        error = phoneError;
      } else {
        // Try to find user by username
        console.log('Attempting to sign in with username:', identifier);
        
        // First, look up the user's phone number from their username
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('phone_number, phone_country_code')
          .eq('username', identifier)
          .single();
        
        if (userError || !userData || !userData.phone_number) {
          toast({
            title: "Login Failed",
            description: "Username not found. Please check your username or sign in with phone number/email.",
            variant: "destructive",
          });
          
          return { error: new Error("Username not found") };
        }
        
        // Now sign in with the phone number
        const phoneNumber = userData.phone_country_code 
          ? `${userData.phone_country_code}${userData.phone_number}` 
          : userData.phone_number;
          
        console.log('Found phone number for username, attempting login with:', phoneNumber);
        
        const { error: signInError } = await supabase.auth.signInWithPassword({
          phone: phoneNumber,
          password,
        });
        
        error = signInError;
      }
      
      if (error) {
        console.error('Login error:', error.message);
        toast({
          title: "Login Failed",
          description: error.message || "Invalid login credentials. Please try again.",
          variant: "destructive",
        });
        return { error };
      }
      
      sonnerToast.success('Welcome back!');
      return { error: null };
    } catch (error: any) {
      console.error('Unexpected login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { error };
    }
  };

  return { signIn };
}
