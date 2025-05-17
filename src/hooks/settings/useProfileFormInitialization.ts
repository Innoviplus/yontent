
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

export const useProfileFormInitialization = (
  profileForm: UseFormReturn<any>,
  userProfile: any
) => {
  useEffect(() => {
    if (!userProfile) return;

    try {
      const formValues = {
        username: userProfile?.username || '',
        email: userProfile?.email || '',
        firstName: userProfile?.first_name || '',
        lastName: userProfile?.last_name || '',
        bio: userProfile?.bio || '',
        gender: userProfile?.gender || '',
        birthDate: userProfile?.birth_date ? new Date(userProfile.birth_date) : undefined,
        websiteUrl: userProfile?.website_url || '',
        facebookUrl: userProfile?.facebook_url || '',
        instagramUrl: userProfile?.instagram_url || '',
        youtubeUrl: userProfile?.youtube_url || '',
        tiktokUrl: userProfile?.tiktok_url || '',
        phoneNumber: userProfile?.phone_number || '',
      };

      console.log("Profile form initialized with:", formValues);
      
      // Reset form with these values
      profileForm.reset(formValues, { keepValues: false, keepDirty: false });
      
      // Ensure the form is not marked as dirty after initialization
      setTimeout(() => {
        profileForm.reset(formValues, { keepValues: true, keepDirty: false });
      }, 100);
      
    } catch (error) {
      console.error("Error initializing profile form:", error);
    }
  }, [userProfile, profileForm]);
};
