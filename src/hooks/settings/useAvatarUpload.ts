
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { uploadAvatar, updateAvatarUrl } from '@/services/profile/avatarService';
import { toast } from 'sonner';

export const useAvatarUpload = () => {
  const { user, refreshUserProfile, userProfile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Initialize avatar URL from userProfile when component mounts or userProfile changes
  useEffect(() => {
    if (userProfile && userProfile.avatar) {
      console.log("Setting avatar URL from profile:", userProfile.avatar);
      setAvatarUrl(userProfile.avatar);
    }
  }, [userProfile]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, GIF, or WEBP)");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file is too large. Maximum size is 5MB.");
        return;
      }
      
      setUploading(true);
      toast.info("Uploading your avatar...");
      
      if (!user) {
        toast.error("User not authenticated.");
        throw new Error("User not authenticated.");
      }

      console.log("Starting avatar upload process for file:", file.name);

      try {
        // Upload the avatar and get the URL
        const newAvatarUrl = await uploadAvatar(user.id, file);
        
        if (newAvatarUrl) {
          console.log("Avatar uploaded successfully, URL:", newAvatarUrl);
          
          // Update the avatar URL in the database
          await updateAvatarUrl(user.id, newAvatarUrl);
          setAvatarUrl(newAvatarUrl);
          
          // Refresh the user profile data to get the updated avatar
          if (refreshUserProfile) {
            console.log("Refreshing user profile after avatar update");
            await refreshUserProfile();
            toast.success("Avatar updated successfully!");
          }
        } else {
          toast.error("Failed to generate avatar URL");
        }
      } catch (uploadError: any) {
        console.error("Upload failed:", uploadError);
        toast.error(`Failed to update avatar: ${uploadError.message || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("Error handling avatar upload:", error.message);
      toast.error("Failed to process avatar upload");
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
