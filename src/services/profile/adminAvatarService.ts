
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Sets the avatar for a specific user by email address
 * This is an admin-level function that should be used carefully
 */
export const setUserAvatarByEmail = async (
  email: string, 
  imageUrl: string
): Promise<boolean> => {
  try {
    console.log(`Setting avatar for user with email: ${email}`);
    
    // First, find the user by email
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (userError) {
      console.error("Error finding user:", userError);
      toast.error("Failed to find user with that email");
      return false;
    }
    
    if (!userData) {
      console.error("No user found with email:", email);
      toast.error("No user found with that email address");
      return false;
    }
    
    // Update the avatar URL for the user
    const { error: updateError } = await supabase.rpc('update_avatar_url', {
      user_id_input: userData.id,
      avatar_url_input: imageUrl
    });
    
    if (updateError) {
      console.error("Error updating avatar URL:", updateError);
      toast.error("Failed to update avatar");
      return false;
    }
    
    console.log("Avatar set successfully for user:", email);
    toast.success("Avatar set successfully");
    return true;
  } catch (error: any) {
    console.error("Error setting user avatar:", error.message);
    toast.error("Failed to set avatar");
    return false;
  }
};
