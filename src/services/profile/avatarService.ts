
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const uploadAvatar = async (userId: string, file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    if (data && data.publicUrl) {
      return data.publicUrl;
    }
    
    return null;
  } catch (error: any) {
    console.error("Error uploading avatar:", error.message);
    throw error;
  }
};

export const updateAvatarUrl = async (userId: string, avatarUrl: string): Promise<void> => {
  try {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar: avatarUrl })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }
    
    toast.success("Avatar updated successfully!");
  } catch (error: any) {
    console.error("Error updating avatar URL:", error.message);
    toast.error("Failed to update avatar. Please try again.");
    throw error;
  }
};
