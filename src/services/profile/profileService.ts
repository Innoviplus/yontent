
import { supabase } from '@/integrations/supabase/client';

export async function fetchUserProfile(userId: string, userEmail?: string | null) {
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
  
  // Update user email in extended data if needed
  if (userEmail && data && data.extended_data) {
    const userData = data.extended_data;
    const extendedData = typeof userData === 'object' && !Array.isArray(userData) ? userData : {};
    
    if (!extendedData.email) {
      const updatedExtendedData = {
        ...extendedData,
        email: userEmail
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          extended_data: updatedExtendedData 
        })
        .eq('id', userId);
        
      if (updateError) {
        console.error('Error updating user email:', updateError);
      }
    }
  }
  
  return data;
}
