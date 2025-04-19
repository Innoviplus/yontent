
import { toast } from 'sonner';
import { sendOtp, verifyOtp, resendOtp } from '@/services/auth/otpAuth';

interface OTPVerificationState {
  phoneNumber: string;
  pendingRegistrations: Map<string, any>;
}

export function useOTPVerification(setUserProfile: (profile: any) => void) {
  const verifyPhoneOtp = async (phone: string, token: string) => {
    try {
      const { error: verifyError } = await verifyOtp(phone, token);
      
      if (verifyError) {
        toast.error(verifyError.message || "Invalid verification code");
        return { error: verifyError };
      }
      
      toast.success("Phone verified successfully");
      return { error: null };
    } catch (error: any) {
      console.error("Exception during OTP verification:", error);
      toast.error(error.message || "An unexpected error occurred");
      return { error };
    }
  };

  const resendVerificationCode = async (phone: string) => {
    try {
      const { error } = await resendOtp(phone);
      
      if (error) {
        toast.error(error.message);
        return { error };
      }
      
      toast.success("A new verification code has been sent to your phone");
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
      return { error };
    }
  };

  return {
    verifyPhoneOtp,
    resendVerificationCode
  };
}
