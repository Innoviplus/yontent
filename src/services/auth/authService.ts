
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';

export const signIn = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return { error };
    }
    
    sonnerToast.success('Welcome back!');
    return { error: null };
  } catch (error: any) {
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
    
    const { error } = await supabase.auth.signUp({
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
    return { error: null };
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
