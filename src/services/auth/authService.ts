
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return { error };
    }
    
    sonnerToast.success('Welcome back!');
    return { session: data.session, user: data.user, error: null };
  } catch (error: any) {
    return { error };
  }
};

export const signInWithPhone = async (phone: string, password: string) => {
  try {
    // Log the phone number format being used
    console.log("Attempting to sign in with phone:", phone);
    
    // First try to find the user by phone number
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('email, phone_number')
      .eq('phone_number', phone.replace(/\D/g, ''))
      .single();
    
    if (profileError || !profiles) {
      console.error("Error finding profile by phone:", profileError);
      return { error: { message: "Phone number not found" } };
    }
    
    console.log("Found profile:", profiles);
    
    // If we have a profile with an email, attempt to sign in with the user's email
    if (profiles.email) {
      console.log("Signing in with associated email:", profiles.email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: profiles.email,
        password,
      });
      
      if (error) {
        console.error("Auth error with email:", error);
        return { error };
      }
      
      sonnerToast.success('Welcome back!');
      return { session: data.session, user: data.user, error: null };
    } else {
      // This should not happen with our current implementation
      console.error("No email found for this phone number");
      return { error: { message: "No email associated with this phone number" } };
    }
  } catch (error: any) {
    console.error("Sign in with phone error:", error);
    return { error };
  }
};

export const signUp = async (email: string, password: string, username: string) => {
  try {
    // Check if the email already exists
    const { data: existingEmails, error: emailCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email);
      
    if (emailCheckError) {
      console.error('Error checking existing email:', emailCheckError);
    } else if (existingEmails && existingEmails.length > 0) {
      return { error: { message: "Email already registered" } };
    }
    
    // Check if the username already exists
    const { data: existingUsernames, error: usernameCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username);
      
    if (usernameCheckError) {
      console.error('Error checking existing username:', usernameCheckError);
    } else if (existingUsernames && existingUsernames.length > 0) {
      return { error: { message: "Username already taken" } };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          email,
        },
      },
    });
    
    if (error) {
      return { error };
    }
    
    sonnerToast.success('Account created successfully! Please check your email for confirmation.');
    return { session: data.session, user: data.user, error: null };
  } catch (error: any) {
    let errorMessage = error.message;
    
    if (errorMessage && (
      errorMessage.includes('duplicate key') || 
      errorMessage.includes('profiles_username_key') ||
      errorMessage.includes('Database error saving new user')
    )) {
      errorMessage = 'This username is already taken. Please choose a different one.';
    }
    
    return { error: { ...error, message: errorMessage } };
  }
};

export const signOut = async () => {
  await supabase.auth.signOut();
  sonnerToast.info('You have been signed out.');
};

export const getCurrentSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const sendOtp = async (phone: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });
    
    if (error) {
      console.error("Error sending OTP:", error);
      return { error };
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Exception sending OTP:", error);
    return { error };
  }
};

export const resendOtp = async (phone: string) => {
  return sendOtp(phone);
};

export const verifyOtp = async (phone: string, token: string) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    
    if (error) {
      console.error("Error verifying OTP:", error);
      return { error };
    }
    
    sonnerToast.success('Phone number verified successfully!');
    return { data, error: null };
  } catch (error: any) {
    console.error("Exception verifying OTP:", error);
    return { error };
  }
};
