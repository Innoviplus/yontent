
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ExtendedProfile } from '@/lib/types';
import { uploadAvatar, updateAvatarUrl } from '@/services/profile/avatarService';
import { updateProfileData as updateProfileInDb } from '@/services/profile/profileUpdateService';

export const useProfileData = () => {
  // Access only what's available in the AuthContext
  const { user, userProfile, refreshUserProfile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Initialize avatar URL from userProfile when component mounts
  useState(() => {
    if (userProfile && userProfile.avatar) {
      setAvatarUrl(userProfile.avatar);
    }
  });

  const handleAvatarUpload = async (file: File) => {
    try {
      setUploading(true);

      if (!user) {
        throw new Error("User not authenticated.");
      }

      // Upload the avatar and get the URL
      const newAvatarUrl = await uploadAvatar(user.id, file);
      
      if (newAvatarUrl) {
        // Update the avatar URL in the database
        await updateAvatarUrl(user.id, newAvatarUrl);
        setAvatarUrl(newAvatarUrl);
        
        // Refresh the user profile data to get the updated avatar
        if (refreshUserProfile) {
          await refreshUserProfile();
        }
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error.message);
    } finally {
      setUploading(false);
    }
  };

  // Update profile data with proper type handling
  const updateProfileData = async (profileData: ExtendedProfile): Promise<boolean> => {
    if (!user) {
      return false;
    }
    
    console.log("Updating profile data via hook for user:", user.id);
    const success = await updateProfileInDb(user.id, profileData);
    
    if (success && refreshUserProfile) {
      // Refresh user profile data after updating
      console.log("Profile update successful, refreshing user profile");
      await refreshUserProfile();
    }
    
    return success;
  };

  return {
    avatarUrl,
    uploading,
    handleAvatarUpload,
    updateProfileData,
  };
};
