
import { toast } from 'sonner';
import * as authService from '@/services/auth/authService';

export function useEmailAuth() {
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

  return {
    signIn,
    signUp
  };
}
