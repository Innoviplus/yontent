
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ExtendedProfile } from '@/lib/types';
import { profileFormSchema, ProfileFormValues } from '@/schemas/profileFormSchema';
import { useProfileFormInitialization } from './settings/useProfileFormInitialization';
import { formatProfileFormValues, validateBirthDate } from '@/services/profile/profileFormService';
import { updateProfileData } from '@/services/profile/profileUpdateService';

export const useProfileForm = (
  user: any, 
  userProfile: any, 
  extendedProfile: ExtendedProfile | null,
  setExtendedProfile: (profile: ExtendedProfile | null) => void,
  setIsUpdating: (updating: boolean) => void
) => {
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: userProfile?.username || '',
      email: userProfile?.email || user?.email || '',
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
      twitterUrl: '',
      phoneNumber: userProfile?.phone_number || '',
      phoneCountryCode: '',
      country: '',
    },
  });

  // Initialize form with profile data when it becomes available
  useProfileFormInitialization(profileForm, userProfile);

  const onProfileSubmit = async (values: ProfileFormValues) => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    setIsUpdating(true);
    console.log("Submitting profile data:", values);
    
    try {
      // Validate birthdate
      if (values.birthDate && !validateBirthDate(values.birthDate)) {
        toast.error("You must be at least 18 years old");
        setIsUpdating(false);
        return;
      }
      
      // Get current extended profile data to preserve other fields
      const currentExtendedProfile = extendedProfile || {};
      
      // Format and merge profile data
      const extendedData = formatProfileFormValues(values, currentExtendedProfile);
      
      console.log("Saving extended data with user ID:", user.id);
      console.log("Extended data:", extendedData);
      
      // Use the updateProfileData service function
      const success = await updateProfileData(user.id, extendedData);
      
      if (success) {
        // Update local state
        setExtendedProfile(extendedData);
        
        // Show success message
        toast.success('Profile updated successfully!');
        
        // Mark form as pristine to indicate data has been saved
        profileForm.reset(values, { keepValues: true });
      } else {
        throw new Error("Failed to update profile data");
      }
      
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(`Update Failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profileForm,
    onProfileSubmit
  };
};
