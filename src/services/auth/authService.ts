
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
      console.log("Found associated email for login:", profiles.email);
      // We'll complete the login after OTP verification
      return { 
        profileData: profiles,
        password,
        error: null
      };
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

// Complete phone sign-in after OTP verification
export const completePhoneSignIn = async (email: string, password: string) => {
  try {
    console.log("Completing sign in with email after OTP verification:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Auth error with email:", error);
      return { error };
    }
    
    sonnerToast.success('Welcome back!');
    return { session: data.session, user: data.user, error: null };
  } catch (error: any) {
    console.error("Complete sign in error:", error);
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
    sonnerToast.success('Phone number verified successfully!');
    return { data, error: null };
  } catch (error: any) {
    console.error("Exception verifying OTP:", error);
    return { error };
  }
};

// New function to manually update points in case trigger doesn't work
export const updateUserPoints = async (userId: string, points: number) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ points })
      .eq('id', userId);
      
    if (error) {
      console.error("Error updating user points:", error);
      return { error };
    }
    
    return { error: null };
  } catch (error: any) {
    console.error("Exception updating user points:", error);
    return { error };
  }
};
