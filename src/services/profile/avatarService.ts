
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Uploads an avatar image to Supabase storage
 * @param file The image file to upload
 * @param userId The user ID to associate with the avatar
 * @returns URL of the uploaded avatar or null if failed
 */
export const uploadAvatar = async (file: File, userId: string): Promise<string | null> => {
  if (!file || !userId) {
    console.error("Missing file or user ID for avatar upload");
    return null;
  }

  try {
    // Create a unique file name using user ID and timestamp
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error: any) {
    console.error("Avatar upload failed:", error.message);
    toast.error(`Upload failed: ${error.message}`);
    return null;
  }
};

/**
 * Updates the avatar URL in user's profile
 * @param userId User ID
 * @param avatarUrl The new avatar URL
 * @returns Success status
 */
export const updateAvatarUrl = async (userId: string, avatarUrl: string): Promise<boolean> => {
  if (!userId || !avatarUrl) {
    console.error("Missing user ID or avatar URL");
    return false;
  }

  try {
    // First fetch the current extended_data to preserve other values
    const { data: profileData, error: fetchError } = await supabase
      .from('profiles')
      .select('extended_data')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error("Error fetching profile data:", fetchError);
      throw fetchError;
    }

    // Prepare updated extended_data with new avatar URL
    const extendedData = {
      ...(profileData?.extended_data || {}),
      avatarUrl
    };

    // Update the profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ extended_data: extendedData })
      .eq('id', userId);

    if (updateError) {
      console.error("Error updating avatar URL:", updateError);
      throw updateError;
    }

    return true;
  } catch (error: any) {
    console.error("Failed to update avatar URL:", error.message);
    toast.error(`Failed to update profile: ${error.message}`);
    return false;
  }
};
