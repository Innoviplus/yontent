
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const validateUsername = async (username: string) => {
  const { data: existingUsernames, error: usernameCheckError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username);
    
  if (usernameCheckError) {
    console.error('Error checking username:', usernameCheckError);
    return { isValid: false, error: usernameCheckError };
  }
  
  if (existingUsernames && existingUsernames.length > 0) {
    toast.error("This username is already taken");
    return { isValid: false, error: { message: "Username already taken" } };
  }

  return { isValid: true, error: null };
};

export const validateEmail = async (email: string) => {
  const { data: existingEmails, error: emailCheckError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email);
    
  if (emailCheckError) {
    console.error('Error checking email:', emailCheckError);
    return { isValid: false, error: emailCheckError };
  }
  
  if (existingEmails && existingEmails.length > 0) {
    toast.error("This email is already registered");
    return { isValid: false, error: { message: "Email already registered" } };
  }

  return { isValid: true, error: null };
};

export const validatePhone = async (phone: string) => {
  const { data: existingPhones, error: phoneCheckError } = await supabase
    .from('profiles')
    .select('id')
    .eq('phone_number', phone.replace(/\D/g, ''));
    
  if (phoneCheckError) {
    console.error('Error checking phone:', phoneCheckError);
    return { isValid: false, error: phoneCheckError };
  }
  
  if (existingPhones && existingPhones.length > 0) {
    toast.error("This phone number is already registered");
    return { isValid: false, error: { message: "Phone number already registered" } };
  }

  return { isValid: true, error: null };
};
