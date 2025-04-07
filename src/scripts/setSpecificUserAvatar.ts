
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Sets the avatar for the user with email yy.leung@hotmail.com
 * to the specified image URL
 */
export const setSpecificUserAvatar = async () => {
  const userEmail = 'yy.leung@hotmail.com';
  const imageUrl = '/lovable-uploads/b6ac2774-e2c5-4a92-847d-52526f3292eb.png';
  
  try {
    console.log(`Setting avatar for user with email: ${userEmail}`);
    
    // First, find the user by email
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .maybeSingle();
    
    if (userError) {
      console.error("Error finding user:", userError);
      toast.error("Failed to find user with that email");
      return false;
    }
    
    if (!userData) {
      console.error("No user found with email:", userEmail);
      toast.error("No user found with email: " + userEmail);
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
    
    console.log("Avatar set successfully for user:", userEmail);
    toast.success(`Avatar set successfully for ${userEmail}`);
    return true;
  } catch (error: any) {
    console.error("Error setting user avatar:", error.message);
    toast.error("Failed to set avatar");
    return false;
  }
};
