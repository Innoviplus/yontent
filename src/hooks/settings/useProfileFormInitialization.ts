
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '@/schemas/profileFormSchema';

export const useProfileFormInitialization = (
  profileForm: UseFormReturn<ProfileFormValues>,
  userProfile: any
) => {
  useEffect(() => {
    if (userProfile?.extended_data) {
      const extData = userProfile.extended_data;
      
      console.log("Loading profile data:", extData);
      
      // Special handling for birthDate to ensure it's a proper Date object
      let birthDate = undefined;
      if (extData.birthDate) {
        try {
          birthDate = new Date(extData.birthDate);
          console.log("Parsed birthDate:", birthDate);
          // Check if date is valid
          if (isNaN(birthDate.getTime())) {
            console.error("Invalid date value:", extData.birthDate);
            birthDate = undefined;
          }
        } catch (err) {
          console.error("Error parsing birthDate:", err);
          birthDate = undefined;
        }
      }
      
      profileForm.reset({
        username: userProfile.username || '',
        firstName: extData.firstName || '',
        lastName: extData.lastName || '',
        bio: extData.bio || '',
        gender: extData.gender || '',
        birthDate: birthDate,
        websiteUrl: extData.websiteUrl || '',
        facebookUrl: extData.facebookUrl || '',
        instagramUrl: extData.instagramUrl || '',
        youtubeUrl: extData.youtubeUrl || '',
        tiktokUrl: extData.tiktokUrl || '',
      }, { keepDirty: false }); // Mark form as pristine after reset
    }
  }, [userProfile, profileForm]);
};
