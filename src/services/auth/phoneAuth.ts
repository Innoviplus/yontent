
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const signInWithPhone = async (phone: string, password: string) => {
  try {
    console.log("Attempting to sign in with phone:", phone);
    
    // First normalize the phone number to remove any non-digit characters for comparison
    const normalizedPhone = phone.replace(/\D/g, '');
    
    // Find the user by phone number
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('email, phone_number')
      .eq('phone_number', normalizedPhone)
      .single();
    
    if (profileError || !profiles) {
      console.error("Error finding profile by phone:", profileError);
      return { error: { message: "Phone number not found" } };
    }
    
    console.log("Found profile:", profiles);
    
    if (profiles.email) {
      console.log("Found associated email for login:", profiles.email);
      return { 
        profileData: profiles,
        password,
        error: null
      };
    } else {
      console.error("No email found for this phone number");
      return { error: { message: "No email associated with this phone number" } };
    }
  } catch (error: any) {
    console.error("Sign in with phone error:", error);
    return { error };
  }
};

export const completePhoneSignIn = async (email: string, password: string) => {
  try {
    if (!email) {
      console.error("Missing email for phone sign in completion");
      return { error: { message: "Email is required for login" } };
    }
    
    console.log("Completing sign in with email after phone verification:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Auth error with email:", error);
      return { error };
    }
    
    toast.success('Welcome back!');
    return { session: data.session, user: data.user, error: null };
  } catch (error: any) {
    console.error("Complete sign in error:", error);
    return { error };
  }
};
