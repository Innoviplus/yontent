
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ExtendedProfile, Json } from '@/lib/types';
import { toast } from 'sonner';

export const useProfileData = () => {
  // Access only what's available in the AuthContext
  const { user, userProfile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Access avatar from userProfile instead of user
    if (userProfile && userProfile.avatar) {
      setAvatarUrl(userProfile.avatar);
    }
  }, [userProfile]);

  const handleAvatarUpload = async (file: File) => {
    try {
      setUploading(true);

      if (!user) {
        throw new Error("User not authenticated.");
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      if (data && data.publicUrl) {
        setAvatarUrl(data.publicUrl);

        // Update user profile with the new avatar URL
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar: data.publicUrl })
          .eq('id', user.id);

        if (updateError) {
          throw updateError;
        }

        // Since we can't update the AuthContext directly, refresh the page after a short delay
        toast.success("Avatar updated successfully!");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error.message);
      toast.error("Failed to update avatar. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Fix the type issues with the Json type and Date object
  const updateProfileData = async (profileData: ExtendedProfile): Promise<boolean> => {
    if (!user) {
      console.error("User not authenticated.");
      return false;
    }

    // Convert the Date object to ISO string for JSON compatibility
    const jsonSafeProfile = {
      ...profileData,
      birthDate: profileData.birthDate ? profileData.birthDate.toISOString() : undefined
    };

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          extended_data: jsonSafeProfile as unknown as Json,
          phone_number: profileData.phoneNumber || null,
          phone_country_code: profileData.phoneCountryCode || null,
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Since we can't update the AuthContext directly, show a success message
      toast.success("Profile updated successfully!");
      return true;
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast.error("Failed to update profile. Please try again.");
      return false;
    }
  };

  return {
    avatarUrl,
    uploading,
    handleAvatarUpload,
    updateProfileData,
  };
};
