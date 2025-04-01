import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ExtendedProfile, Json } from '@/lib/types';
import { toast } from 'sonner';

export const useProfileData = () => {
  const { user, setUserProfile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user && user.avatar) {
      setAvatarUrl(user.avatar);
    }
  }, [user]);

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

        // Update user object in AuthContext
        setUserProfile((prevProfile) => {
          if (prevProfile) {
            return { ...prevProfile, avatar: data.publicUrl };
          }
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: data.publicUrl,
            points: 0,
            created_at: new Date().toISOString(),
            extended_data: {}
          };
        });
        toast.success("Avatar updated successfully!");
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

      // Update user profile in AuthContext
      setUserProfile((prevProfile) => {
        if (prevProfile && prevProfile.extended_data) {
          return {
            ...prevProfile,
            phone_number: profileData.phoneNumber || null,
            phone_country_code: profileData.phoneCountryCode || null,
            extended_data: {
              ...prevProfile.extended_data,
              ...profileData,
            }
          };
        }
        return prevProfile;
      });

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
