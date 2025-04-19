
import { supabase } from '@/integrations/supabase/client';
import * as authService from '@/services/auth/authService';
import { toast } from 'sonner';

export function usePhoneAuth(setUserProfile: (profile: any) => void) {
  const pendingPhoneRegistrations = new Map();

  const signUpWithPhone = async (phone: string, username: string, email: string, password?: string) => {
    try {
      console.log("AuthContext: signUpWithPhone called with:", { phone, username, email, hasPassword: !!password });
      
      // Check if username already exists
      const { data: existingUsernames, error: usernameCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username);
        
      if (usernameCheckError) {
        console.error('Error checking existing username:', usernameCheckError);
      } else if (existingUsernames && existingUsernames.length > 0) {
        toast.error("This username is already taken. Please choose a different one.");
        return { error: { message: "Username already taken" } };
      }
      
      // Check if email already exists
      const { data: existingEmails, error: emailCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email);
        
      if (emailCheckError) {
        console.error('Error checking existing email:', emailCheckError);
      } else if (existingEmails && existingEmails.length > 0) {
        toast.error("This email is already registered. Please use a different email.");
        return { error: { message: "Email already registered" } };
      }
      
      // Check if phone already exists
      const { data: existingPhones, error: phoneCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone_number', phone.replace(/\D/g, ''));
        
      if (phoneCheckError) {
        console.error('Error checking existing phone:', phoneCheckError);
      } else if (existingPhones && existingPhones.length > 0) {
        toast.error("This phone number is already registered. Please use a different number.");
        return { error: { message: "Phone number already registered" } };
      }
      
      // Store registration data but don't create user yet
      pendingPhoneRegistrations.set(phone, {
        username,
        email,
        password: password || '',
        phone_number: phone.replace(/\D/g, ''),
        phone_country_code: '+'
      });
      
      // Send OTP
      const { error: otpError } = await authService.sendOtp(phone);
      
      if (otpError) {
        console.error("Error sending OTP:", otpError);
        toast.error(otpError.message || "Failed to send verification code");
        return { error: otpError };
      }

      toast.success("Verification Code Sent");
      return { error: null, phoneNumber: phone };
    } catch (error: any) {
      console.error("Exception during phone signup:", error);
      toast.error(error.message || "An unexpected error occurred");
      return { error };
    }
  };

  const signInWithPhone = async (phone: string, password: string) => {
    console.log("AuthContext: signInWithPhone called with phone:", phone);
    return authService.signInWithPhone(phone, password);
  };

  const verifyPhoneOtp = async (phone: string, token: string) => {
    try {
      const { error: verifyError } = await authService.verifyOtp(phone, token);
      
      if (verifyError) {
        toast.error(verifyError.message || "Invalid verification code");
        return { error: verifyError };
      }
      
      const userData = pendingPhoneRegistrations.get(phone);
      
      if (!userData) {
        console.error("No pending registration found for this phone number");
        toast.error("Registration data not found. Please try signing up again.");
        return { error: { message: "Registration data not found" } };
      }
      
      // Now we can create the user after OTP verification
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: userData
        }
      });

      if (error) {
        console.error("Error during signup after OTP verification:", error);
        toast.error(error.message);
        return { error };
      }

      pendingPhoneRegistrations.delete(phone);
      
      // Wait for a moment before refreshing profile to ensure database trigger has completed
      setTimeout(async () => {
        if (data.user) {
          try {
            // Check if profile was created properly
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user!.id)
              .single();
            
            if (profileError) {
              console.error("Error checking profile:", profileError);
              return;
            }
            
            // Set user profile to trigger UI updates
            setUserProfile(profile);
            
            // Log a welcome points transaction manually since we're bypassing the trigger
            const { error: transactionError } = await supabase
              .from('point_transactions')
              .insert({
                user_id: data.user.id,
                amount: 10,
                type: 'WELCOME',
                description: 'Welcome Bonus'
              });
              
            if (transactionError) {
              console.error("Failed to add welcome points transaction:", transactionError);
            }
            
            // Update the profile points directly
            const { error: pointsError } = await supabase
              .from('profiles')
              .update({ points: 10 })
              .eq('id', data.user.id);
              
            if (pointsError) {
              console.error("Failed to update profile points:", pointsError);
            }
          } catch (e) {
            console.error("Error in profile update:", e);
          }
        }
      }, 1000);

      toast.success("Registration Successful");
      return { error: null };
    } catch (error: any) {
      console.error("Exception during OTP verification:", error);
      toast.error(error.message || "An unexpected error occurred");
      return { error };
    }
  };

  const resendOtp = async (phone: string) => {
    try {
      const { error } = await authService.resendOtp(phone);
      
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
    signUpWithPhone,
    signInWithPhone,
    verifyPhoneOtp,
    resendOtp
  };
}
