
import { toast } from 'sonner';
import { sendOtp, verifyOtp, resendOtp } from '@/services/auth/otpAuth';
import { supabase } from '@/integrations/supabase/client';

export function useOTPVerification(setUserProfile: (profile: any) => void) {
  const verifyPhoneOtp = async (phone: string, token: string) => {
    try {
      const { data, error: verifyError } = await verifyOtp(phone, token);
      
      if (verifyError) {
        toast.error(verifyError.message || "Invalid verification code");
        return { error: verifyError };
      }
      
      // After OTP verification, update the user's profile with phone number
      if (data?.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            phone_number: phone.replace(/\D/g, ''),
            phone_country_code: phone.match(/^\+\d+/)?.[0] || '+'
          })
          .eq('id', data.user.id);
        
        if (updateError) {
          console.error("Error updating profile with phone number:", updateError);
          // Don't fail the entire process for this
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
