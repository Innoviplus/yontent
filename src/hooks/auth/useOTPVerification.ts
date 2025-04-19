
import { toast } from 'sonner';
import { sendOtp, verifyOtp, resendOtp } from '@/services/auth/otpAuth';
import { supabase } from '@/integrations/supabase/client';
import { useRegistration } from '@/contexts/auth/RegistrationContext';

export function useOTPVerification(setUserProfile: (profile: any) => void) {
  const { getPendingRegistration, clearPendingRegistration } = useRegistration();

  const verifyPhoneOtp = async (phone: string, token: string) => {
    try {
      console.log("Verifying OTP for phone number:", phone);
      
      // Get the stored registration data
      const pendingRegistration = getPendingRegistration(phone);
      
      const { data, error: verifyError } = await verifyOtp(phone, token);
      
      if (verifyError) {
        toast.error(verifyError.message || "Invalid verification code");
        return { error: verifyError };
      }
      
      // After OTP verification, update the user's profile with all data
      if (data?.user && pendingRegistration) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username: pendingRegistration.username,
            email: pendingRegistration.email,
            phone_number: pendingRegistration.phone_number,
            phone_country_code: pendingRegistration.phone_country_code
          })
          .eq('id', data.user.id);
        
        if (updateError) {
          console.error("Error updating profile:", updateError);
        }
        
        // Fetch the updated profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileData) {
          setUserProfile(profileData);
        }
        
        // Clear the pending registration after successful verification
        clearPendingRegistration(phone);
      }
      
      toast.success("Phone verified successfully");
      return { data, error: null };
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
