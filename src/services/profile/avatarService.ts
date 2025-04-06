
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const uploadAvatar = async (userId: string, file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log("Uploading avatar with path:", filePath);
    
    // Check if bucket exists, create it if it doesn't
    const { data: buckets } = await supabase.storage.listBuckets();
    const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
    
    if (!avatarBucketExists) {
      console.log("Avatars bucket doesn't exist, creating it...");
      const { error: createBucketError } = await supabase.storage
        .createBucket('avatars', {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
          fileSizeLimit: 5 * 1024 * 1024 // 5MB
        });
      
      if (createBucketError) {
        console.error("Error creating bucket:", createBucketError);
        throw createBucketError;
      }
      console.log("Avatars bucket created successfully");
    }

    // Upload the file to the storage bucket
    let { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    if (data && data.publicUrl) {
      console.log("Avatar uploaded successfully, URL:", data.publicUrl);
      return data.publicUrl;
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
    
    // First check if profile exists using direct query to bypass TypeScript type checking
    const { data, error } = await supabase.rpc(
      'get_profile_by_id' as any, 
      { user_id_input: userId }
    );
    
    if (error) {
      console.error("Error checking profile existence:", error);
      throw error;
    }
    
    // Check if data is an array and has at least one item
    if (data && Array.isArray(data) && data.length > 0) {
      // If profile exists, update it
      console.log("Profile exists, updating avatar URL via RPC");
      const { error: updateError } = await supabase.rpc(
        'update_avatar_url' as any, 
        { user_id_input: userId, avatar_url_input: avatarUrl }
      );
        
      if (updateError) {
        console.error("Error updating avatar URL:", updateError);
        throw updateError;
      }
    } else {
      // If profile doesn't exist, insert it via RPC
      console.log("Profile doesn't exist, inserting new profile with avatar URL via RPC");
      const { error: insertError } = await supabase.rpc(
        'insert_profile_with_avatar' as any, 
        { user_id_input: userId, avatar_url_input: avatarUrl }
      );
        
      if (insertError) {
        console.error("Error inserting new profile:", insertError);
        throw insertError;
      }
    }
    
    console.log("Avatar URL updated in profile successfully");
  } catch (error: any) {
    console.error("Error updating avatar URL:", error.message);
    toast.error("Failed to update avatar. Please try again.");
    throw error;
  }
};
