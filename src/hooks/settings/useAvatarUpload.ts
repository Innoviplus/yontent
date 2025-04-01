
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { uploadAvatar, updateAvatarUrl } from '@/services/profile/avatarService';

export const useAvatarUpload = () => {
  const { user, refreshUserProfile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
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

  return {
    avatarUrl,
    uploading,
    handleAvatarUpload
  };
};
