
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';

export const signIn = async (email: string, password: string) => {
  try {
    // First normalize the email for case-insensitive matching
    email = email.toLowerCase().trim();
    
    console.log("Attempting to sign in with email:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Error signing in with email:", error);
      return { error };
    }
    
    sonnerToast.success('Welcome back!');
    return { session: data.session, user: data.user, error: null };
  } catch (error: any) {
    console.error("Exception during email sign in:", error);
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

