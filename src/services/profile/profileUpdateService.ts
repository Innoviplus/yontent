
import { supabase } from '@/integrations/supabase/client';
import { ExtendedProfile, Json } from '@/lib/types';
import { toast } from 'sonner';

export const updateProfileData = async (userId: string, profileData: ExtendedProfile): Promise<boolean> => {
  if (!userId) {
    console.error("User not authenticated.");
    return false;
  }

  try {
    console.log("Updating profile with data:", profileData);
    
    // Convert the Date object to ISO string for JSON compatibility
    const jsonSafeProfile = {
      ...profileData,
      birthDate: profileData.birthDate ? profileData.birthDate.toISOString() : null,
      // Ensure social media URLs are properly formatted
      websiteUrl: profileData.websiteUrl || null,
      facebookUrl: profileData.facebookUrl || null,
      instagramUrl: profileData.instagramUrl || null,
      youtubeUrl: profileData.youtubeUrl || null,
      tiktokUrl: profileData.tiktokUrl || null,
    };

    console.log("Prepared JSON safe profile data:", jsonSafeProfile);

    // Update the extended_data in the profiles table
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        extended_data: jsonSafeProfile as unknown as Json,
        phone_number: profileData.phoneNumber || null,
        phone_country_code: profileData.phoneCountryCode || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      toast.error(`Failed to update profile: ${updateError.message}`);
      return false;
    }
    
    console.log("Profile updated successfully in Supabase!");
    return true;
  } catch (error: any) {
    console.error("Error updating profile:", error.message);
    toast.error(`Failed to update profile: ${error.message}`);
    return false;
  }
};
