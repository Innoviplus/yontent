
import { toast } from 'sonner';
import { verifyOtp, resendOtp } from '@/services/auth/otpAuth';
import { supabase } from '@/integrations/supabase/client';
import { useRegistration } from '@/contexts/auth/RegistrationContext';

export function useOTPVerification(setUserProfile: (profile: any) => void) {
  const { getPendingRegistration, clearPendingRegistration } = useRegistration();

  const verifyPhoneOtp = async (phone: string, token: string) => {
    try {
      console.log("Verifying OTP for phone number:", phone);
      
      // Get the stored registration data
      const pendingRegistration = getPendingRegistration(phone);
      
      if (!pendingRegistration) {
        toast.error("Registration data not found");
        return { error: { message: "Registration data not found" } };
      }
      
      // First verify the OTP
      const { error: verifyError } = await verifyOtp(phone, token);
      
      if (verifyError) {
        toast.error(verifyError.message || "Invalid verification code");
        return { error: verifyError };
      }
      
      // After OTP verification, create user with email provider
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: pendingRegistration.email,
        password: pendingRegistration.password || Math.random().toString(36).slice(-8),
        options: {
          data: {
            username: pendingRegistration.username,
            phone_number: pendingRegistration.phone_number,
            phone_country_code: pendingRegistration.phone_country_code,
            email: pendingRegistration.email
          }
        }
      });
      
      if (signUpError) {
        toast.error(signUpError.message || "Failed to create account");
        return { error: signUpError };
      }
      
      // If user was created successfully, clear the pending registration
      clearPendingRegistration(phone);
      
      // Show only one success message with a unique ID
      toast.success("Account created successfully", {
        id: 'account-creation-success'
      });
      
      // Get the user profile after signup
      if (authData.user) {
        setTimeout(async () => {
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', authData.user.id)
              .single();
              
            if (profileData) {
              console.log("Setting user profile after OTP verification:", profileData);
              setUserProfile(profileData);
            }
          } catch (err) {
            console.error("Error fetching profile after OTP verification:", err);
          }
        }, 1000); // Give the trigger time to run
      }
      
      return { data: authData, error: null };
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
