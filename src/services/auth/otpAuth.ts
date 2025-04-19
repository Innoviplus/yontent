import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const sendOtp = async (phone: string) => {
  try {
    console.log("Sending OTP to phone number:", phone);
    
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });
    
    if (error) {
      console.error("Error sending OTP:", error);
      return { error };
    }
    
    console.log("OTP sent successfully");
    return { data, error: null };
  } catch (error: any) {
    console.error("Exception sending OTP:", error);
    return { error };
  }
};

export const resendOtp = async (phone: string) => {
  console.log("Resending OTP to phone number:", phone);
  return sendOtp(phone);
};

export const verifyOtp = async (phone: string, token: string) => {
  try {
    console.log("Verifying OTP for phone number:", phone);
    
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    
    if (error) {
      console.error("Error verifying OTP:", error);
      return { error };
    }
    
    console.log("OTP verified successfully");
    toast.success('Phone number verified successfully!');
    return { data, error: null };
  } catch (error: any) {
    console.error("Exception verifying OTP:", error);
    return { error };
  }
};
