
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
      .select('*')
      .eq('phone_number', phone.replace(/\+/g, ''))
      .single();
    
    if (profileError || !profiles) {
      console.error("Error finding profile:", profileError);
      return { error: { message: "Phone number not found" } };
    }
    
    // If we have a profile, attempt to sign in with the user's email
    if (profiles.email) {
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
      // If there's no email associated with the phone number, try direct phone auth
      const { data, error } = await supabase.auth.signInWithPassword({
        phone,
        password,
      });
      
      if (error) {
        console.error("Auth error with phone:", error);
        return { error };
      }
      
      sonnerToast.success('Welcome back!');
      return { session: data.session, user: data.user, error: null };
    }
  } catch (error: any) {
    console.error("Sign in with phone error:", error);
    return { error };
  }
};

export const signUp = async (email: string, password: string, username: string) => {
  try {
    const { data: existingUsers, error: emailCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email);
      
    if (emailCheckError) {
      console.error('Error checking existing email:', emailCheckError);
    } else if (existingUsers && existingUsers.length > 0) {
      return { error: { message: "Email already registered" } };
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
