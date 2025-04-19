
import { supabase } from '@/integrations/supabase/client';

export async function fetchUserProfile(userId: string, userEmail?: string | null) {
  try {
    console.log("Fetching user profile for:", userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    console.log('User profile data:', data);
    
    // Update user email in profile if needed
    if (userEmail && (!data.email || data.email !== userEmail)) {
      console.log("Updating profile with email from auth:", userEmail);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          email: userEmail,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (updateError) {
        console.error('Error updating user email:', updateError);
      } else {
        // Update the local data with the new email
        data.email = userEmail;
      }
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error fetching user profile:', error);
    return null;
  }
}
