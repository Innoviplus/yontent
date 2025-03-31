
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';
import { useToast } from '@/hooks/use-toast';

export function useSignUp() {
  const { toast } = useToast();

  const signUp = async (
    username: string, 
    password: string, 
    phoneNumber: string,
    phoneCountryCode?: string
  ): Promise<{ 
    success: boolean; 
    error: Error | null;
  }> => {
    try {
      console.log('Checking if username exists:', username);
      // Check if username already exists before creating the auth user
      const { data: usernameCheck, error: usernameError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();
      
      if (usernameCheck) {
        throw new Error('This username is already taken. Please choose a different one.');
      }

      // Extract phone country code from the phone number if not provided separately
      const formattedPhoneNumber = phoneNumber;
      let countryCode = phoneCountryCode || '';

      // If no country code was explicitly provided, try to extract it from the phoneNumber
      if (!countryCode && phoneNumber.startsWith('+')) {
        // Find the first non-digit after the + sign
        const match = phoneNumber.match(/^\+(\d+)/);
        if (match) {
          countryCode = '+' + match[1];
        }
      }

      console.log('Creating auth user with phone:', phoneNumber);
      // Create the auth user with phone
      const { data: authData, error: authError } = await supabase.auth.signUp({
        phone: phoneNumber,
        password,
        options: {
          data: {
            username,
            phone_country_code: countryCode,
            phone_number: phoneNumber.replace(countryCode, '') // Store the number without country code
          },
        },
      });

      if (authError) {
        console.error('Auth error during signup:', authError);
        // Check if it's a "user already registered" error
        if (authError.message && authError.message.includes('User already registered')) {
          throw new Error('User already registered. Please use a different phone number or try logging in.');
        }
        throw new Error(authError.message);
      }

      // Check if the user was created successfully
      if (!authData.user) {
        console.error('No user data returned from signUp');
        throw new Error('Failed to create user');
      }

      // Update the profiles table with the phone number and country code
      // This might be redundant if the trigger already handles it, but we'll ensure it's set
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ 
          phone_number: phoneNumber.replace(countryCode, ''),
          phone_country_code: countryCode 
        })
        .eq('id', authData.user.id);
      
      if (profileUpdateError) {
        console.error('Error updating profile with phone details:', profileUpdateError);
      }
      
      console.log('Signing in after account creation');
      // Sign in the user after successful signup
      const { error: signInError } = await supabase.auth.signInWithPassword({
        phone: phoneNumber,
        password,
      });
      
      if (signInError) {
        console.error('Error signing in after signup:', signInError);
        throw new Error('Error signing in after account creation: ' + signInError.message);
      }
      
      // Show welcome message with points info
      sonnerToast.success('Account created successfully! You received 10 welcome points.');
      
      return { success: true, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error(String(error)) 
      };
    }
  };

  return { signUp };
}
