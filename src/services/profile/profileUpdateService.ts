
import { supabase } from '@/integrations/supabase/client';
import { ExtendedProfile } from '@/lib/types';
import { toast } from 'sonner';

export const updateProfileData = async (userId: string, profileData: ExtendedProfile): Promise<boolean> => {
  if (!userId) {
    console.error("User not authenticated.");
    return false;
  }

  try {
    console.log("Updating profile with data:", profileData);
    
    // Update the profile with the new column structure
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        first_name: profileData.firstName || null,
        last_name: profileData.lastName || null,
        bio: profileData.bio || null,
        gender: profileData.gender || null,
        birth_date: profileData.birthDate ? profileData.birthDate.toISOString() : null,
        website_url: profileData.websiteUrl || null,
        facebook_url: profileData.facebookUrl || null,
        instagram_url: profileData.instagramUrl || null,
        youtube_url: profileData.youtubeUrl || null,
        tiktok_url: profileData.tiktokUrl || null,
        twitter_url: profileData.twitterUrl || null,
        country: profileData.country || null,
        phone_number: profileData.phoneNumber || null,
        phone_country_code: profileData.phoneCountryCode || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      throw updateError;
    }
    
    console.log("Profile updated successfully in Supabase!");
    return true;
  } catch (error: any) {
    console.error("Error updating profile:", error.message);
    throw error;
  }
};

// Check and award welcome points
export const checkAndAwardWelcomePoints = async (userId: string): Promise<boolean> => {
  try {
    console.log('Checking for welcome points eligibility for user:', userId);
    
    // Call the welcome points function
    const { data, error } = await supabase.rpc('award_welcome_points', {
      user_id_param: userId
    });
    
    if (error) {
      console.error('Error checking welcome points:', error);
      return false;
    }
    
    console.log('Welcome points check response:', data);
    
    // Type guard to check if data has success property
    if (data && typeof data === 'object' && data !== null && 'success' in data) {
      const result = data as { success: boolean; message?: string; points_awarded?: number };
      
      if (result.success) {
        toast.success('You received 150 welcome points for updating your profile!');
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error in welcome points check:', error);
    return false;
  }
};
