
import { useState } from 'react';
import { toast } from 'sonner';
import { sendOtp } from '@/services/auth/otpAuth';
import { validateUsername, validateEmail, validatePhone } from './validation/phoneSignUpValidation';
import type { PendingRegistration } from './types/phoneSignUpTypes';

export function usePhoneSignUp() {
  const pendingRegistrations = new Map<string, PendingRegistration>();

  const signUpWithPhone = async (phone: string, username: string, email: string, password?: string) => {
    try {
      console.log("Phone signup initiated:", { phone, username, email, hasPassword: !!password });
      
      // Validate username
      const usernameValidation = await validateUsername(username);
      if (!usernameValidation.isValid) return { error: usernameValidation.error };
      
      // Validate email
      const emailValidation = await validateEmail(email);
      if (!emailValidation.isValid) return { error: emailValidation.error };
      
      // Validate phone
      const phoneValidation = await validatePhone(phone);
      if (!phoneValidation.isValid) return { error: phoneValidation.error };
      
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
