
import { toast } from 'sonner';
import { signInWithPhone as phoneSignIn, completePhoneSignIn } from '@/services/auth/phoneAuth';
import { sendOtp } from '@/services/auth/otpAuth';

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
      
      // Send OTP
      const { error: otpError } = await sendOtp(phone);
      
      if (otpError) {
        console.error("Error sending OTP during sign in:", otpError);
        toast.error(otpError.message || "Failed to send verification code");
        return { error: otpError };
      }
      
      toast.success("Verification Code Sent");
      return { 
        error: null, 
        phoneNumber: phone,
        requiresOtp: true,
        profileData: result.profileData,
        password: result.password
      };
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
