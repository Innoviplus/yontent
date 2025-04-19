
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
        username: userProfile.username || '',
        email: userProfile.email || '',
        firstName: '',
        lastName: '',
        bio: '',
        gender: '',
        birthDate: undefined,
        websiteUrl: '',
        facebookUrl: '',
        instagramUrl: '',
        youtubeUrl: '',
        tiktokUrl: '',
        phoneNumber: userProfile.phone_number || '',
      };

      if (userProfile.extended_data) {
        const extData = userProfile.extended_data;

        // Set form values from extended data
        if (extData.firstName) formValues.firstName = extData.firstName;
        if (extData.lastName) formValues.lastName = extData.lastName;
        if (extData.bio) formValues.bio = extData.bio;
        if (extData.gender) formValues.gender = extData.gender;
        if (extData.birthDate) {
          formValues.birthDate = new Date(extData.birthDate);
        }
        if (extData.websiteUrl) formValues.websiteUrl = extData.websiteUrl;
        if (extData.facebookUrl) formValues.facebookUrl = extData.facebookUrl;
        if (extData.instagramUrl) formValues.instagramUrl = extData.instagramUrl;
        if (extData.youtubeUrl) formValues.youtubeUrl = extData.youtubeUrl;
        if (extData.tiktokUrl) formValues.tiktokUrl = extData.tiktokUrl;
        
        // If the email is in extended data but not in the profile root, use it
        if (extData.email && !formValues.email) {
          formValues.email = extData.email;
        }
      }

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
