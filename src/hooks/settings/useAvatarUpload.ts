
import { useState } from 'react';
import { uploadAvatar, updateAvatarUrl } from '@/services/profile/avatarService';
import { toast } from 'sonner';

export const useAvatarUpload = (userId: string, onAvatarUpdate?: (url: string) => void) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      
      // Upload avatar to storage
      const url = await uploadAvatar(file, userId);
      if (!url) {
        throw new Error('Failed to upload image');
      }
      
      // Update user profile with new avatar URL
      const success = await updateAvatarUrl(userId, url);
      if (!success) {
        throw new Error('Failed to update profile');
      }
      
      // Update local state
      setAvatarUrl(url);
      
      // Notify parent component if callback is provided
      if (onAvatarUpdate) {
        onAvatarUpdate(url);
      }
      
      toast.success('Profile picture updated!');
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast.error(error.message || 'Failed to update profile picture');
    } finally {
      setUploading(false);
      
      // Reset the input
      if (event.target) {
        event.target.value = '';
      }
    }
  };
  
  return {
    avatarUrl,
    setAvatarUrl,
    uploading,
    handleAvatarUpload
  };
};
