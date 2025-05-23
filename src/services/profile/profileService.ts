
import { supabase } from '@/integrations/supabase/client';
import { ExtendedProfile } from '@/lib/types';

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

    console.log('User profile data from database:', data);
    
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

    // Convert database profile to ExtendedProfile format for compatibility
    if (data) {
      // Create extended profile object from the direct column structure
      const extendedProfile: ExtendedProfile = {
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        bio: data.bio || '',
        gender: data.gender || '',
        birthDate: data.birth_date ? new Date(data.birth_date) : null,
        websiteUrl: data.website_url || '',
        facebookUrl: data.facebook_url || '',
        instagramUrl: data.instagram_url || '',
        youtubeUrl: data.youtube_url || '',
        tiktokUrl: data.tiktok_url || '',
        twitterUrl: data.twitter_url || '',
        country: data.country || '',
        phoneNumber: data.phone_number || '',
        phoneCountryCode: data.phone_country_code || '',
        email: data.email || ''
      };

      // Store the extended profile in the data object for backward compatibility
      data.extended_data = extendedProfile;
      
      console.log('Extended profile data:', extendedProfile);
    }
    
    return data;
  } catch (error) {
    console.error('Unexpected error fetching user profile:', error);
    return null;
  }
}
