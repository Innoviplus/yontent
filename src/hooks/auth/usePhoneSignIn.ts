
import { toast } from 'sonner';
import { signInWithPhone as phoneSignIn, completePhoneSignIn } from '@/services/auth/phoneAuth';

export function usePhoneSignIn() {
  const signInWithPhone = async (phone: string, password: string) => {
    try {
      console.log("Phone signin initiated:", phone);
      
      // First verify credentials
      const result = await phoneSignIn(phone, password);
      
      if (result.error) {
        toast.error(result.error.message || "Login failed");
        return result;
      }
      
      // Complete sign in directly without OTP
      const signInResult = await completePhoneSignIn(result.profileData.email, password);
      
      if (signInResult.error) {
        toast.error(signInResult.error.message || "Login failed");
        return { error: signInResult.error };
      }
      
      toast.success("Login successful");
      return signInResult;
    } catch (error: any) {
      console.error("Exception during phone sign in:", error);
      toast.error(error.message || "An unexpected error occurred");
      return { error };
    }
  };

  const completeSignIn = async (email: string, password: string) => {
    try {
      const result = await completePhoneSignIn(email, password);
      
      if (result.error) {
        toast.error(result.error.message || "Login failed");
        return result;
      }
      
      toast.success("Login successful");
      return result;
    } catch (error: any) {
      console.error("Exception completing sign in:", error);
      toast.error(error.message || "An unexpected error occurred");
      return { error };
    }
  };

  return {
    signInWithPhone,
    completeSignIn
  };
}
