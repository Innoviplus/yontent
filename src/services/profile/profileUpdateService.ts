
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
    
    // Now also update the extended_data JSON field for backward compatibility
    const { error: extendedError } = await supabase
      .from('profiles')
      .update({
        extended_data: profileData
      })
      .eq('id', userId);

    if (extendedError) {
      console.error("Supabase extended_data update error:", extendedError);
      // Don't throw here as the main data has been updated
    }
    
    console.log("Profile updated successfully in Supabase!");
    return true;
  } catch (error: any) {
    console.error("Error updating profile:", error.message);
    
    // Check if the error is related to point_transactions table not existing
    if (error.code === '42P01' && error.message.includes('point_transactions')) {
      console.warn("Issue with point_transactions table, but profile was likely updated");
      toast.warning("Profile updated but points system is currently unavailable");
      return true;
    }
    
    throw error;
  }
};
