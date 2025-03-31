
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';
import { useToast } from '@/hooks/use-toast';

export function useSignIn() {
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

  return { signIn };
}
