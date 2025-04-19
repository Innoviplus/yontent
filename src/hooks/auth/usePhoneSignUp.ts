
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { sendOtp } from '@/services/auth/otpAuth';

export function usePhoneSignUp() {
  const pendingRegistrations = new Map();

  const signUpWithPhone = async (phone: string, username: string, email: string, password?: string) => {
    try {
      console.log("Phone signup initiated:", { phone, username, email, hasPassword: !!password });
      
      // Check if username exists
      const { data: existingUsernames, error: usernameCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username);
        
      if (usernameCheckError) {
        console.error('Error checking username:', usernameCheckError);
      } else if (existingUsernames && existingUsernames.length > 0) {
        toast.error("This username is already taken");
        return { error: { message: "Username already taken" } };
      }
      
      // Check if email exists
      const { data: existingEmails, error: emailCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email);
        
      if (emailCheckError) {
        console.error('Error checking email:', emailCheckError);
      } else if (existingEmails && existingEmails.length > 0) {
        toast.error("This email is already registered");
        return { error: { message: "Email already registered" } };
      }
      
      // Check if phone exists
      const { data: existingPhones, error: phoneCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone_number', phone.replace(/\D/g, ''));
        
      if (phoneCheckError) {
        console.error('Error checking phone:', phoneCheckError);
      } else if (existingPhones && existingPhones.length > 0) {
        toast.error("This phone number is already registered");
        return { error: { message: "Phone number already registered" } };
      }
      
      // Store registration data
      pendingRegistrations.set(phone, {
        username,
        email,
        password: password || '',
        phone_number: phone.replace(/\D/g, ''),
        phone_country_code: '+'
      });
      
      // Send OTP
      const { error: otpError } = await sendOtp(phone);
      
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

  return {
    signUpWithPhone,
    pendingRegistrations
  };
}
