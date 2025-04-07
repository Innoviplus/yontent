
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const uploadAvatar = async (userId: string, file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log("Uploading avatar with path:", filePath);
    
    // Upload the file to the storage bucket
    const { error: uploadError, data } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    // Get the public URL after a successful upload
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    
    if (urlData && urlData.publicUrl) {
      console.log("Avatar uploaded successfully, URL:", urlData.publicUrl);
      return urlData.publicUrl;
    }
    
    return null;
  } catch (error: any) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

export const updateAvatarUrl = async (userId: string, avatarUrl: string): Promise<void> => {
  try {
    console.log("Updating avatar URL in profile for user:", userId);
    console.log("New avatar URL:", avatarUrl);
    
    // Update the profile using the update_avatar_url function with correct parameter names
    const { error } = await supabase.rpc('update_avatar_url', {
      user_id: userId,
      avatar_url: avatarUrl
    });
    
    if (error) {
      console.error("Error updating avatar URL:", error);
      throw error;
    }
    
    console.log("Avatar URL updated in profile successfully");
  } catch (error: any) {
    console.error("Error updating avatar URL:", error.message);
    toast.error("Failed to update avatar. Please try again.");
    throw error;
  }
};
