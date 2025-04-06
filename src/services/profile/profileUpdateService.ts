
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
      birthDate: profileData.birthDate ? profileData.birthDate.toISOString() : null
    };

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        extended_data: jsonSafeProfile as unknown as Json,
        phone_number: profileData.phoneNumber || null,
        phone_country_code: profileData.phoneCountryCode || null,
      })
      .eq('id', userId);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      throw updateError;
    }
    
    toast.success("Profile updated successfully!");
    return true;
  } catch (error: any) {
    console.error("Error updating profile:", error.message);
    toast.error("Failed to update profile. Please try again.");
    return false;
  }
};
