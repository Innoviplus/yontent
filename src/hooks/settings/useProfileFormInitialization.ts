
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';

export const useProfileFormInitialization = (
  profileForm: UseFormReturn<any>,
  userProfile: any
) => {
  const { user } = useAuth();

  useEffect(() => {
    // Only run if form and userProfile are available
    if (profileForm && userProfile) {
      try {
        const extendedData = userProfile.extended_data || {};
        
        // Set form values from profile data
        profileForm.reset({
          // Basic fields
          username: userProfile.username || '',
          email: user?.email || '',  // Initialize email from auth user
          
          // Extended fields from JSON
          firstName: extendedData.firstName || '',
          lastName: extendedData.lastName || '',
          bio: extendedData.bio || '',
          gender: extendedData.gender || '',
          birthDate: extendedData.birthDate ? new Date(extendedData.birthDate) : undefined,
          
          // Social media fields
          websiteUrl: extendedData.websiteUrl || '',
          facebookUrl: extendedData.facebookUrl || '',
          instagramUrl: extendedData.instagramUrl || '',
          youtubeUrl: extendedData.youtubeUrl || '',
          tiktokUrl: extendedData.tiktokUrl || '',
          
          // Phone fields
          phoneNumber: userProfile.phone_number || '',
          phoneCountryCode: userProfile.phone_country_code || '+1',
        });
        
        console.log("Profile form initialized with:", profileForm.getValues());
      } catch (error) {
        console.error("Error initializing profile form:", error);
      }
    }
  }, [profileForm, userProfile, user]);
};
