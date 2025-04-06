
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ExtendedProfile } from '@/lib/types';
import React from 'react';
import { updateProfileData } from '@/services/profile/profileUpdateService';
import { subYears } from 'date-fns';

// Helper function to format URLs
const formatUrl = (url: string | undefined | null): string | null => {
  if (!url || url.trim() === '') return null;
  url = url.trim();
  
  // Check if the URL already starts with http:// or https://
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise prepend https://
  return `https://${url}`;
};

// URL validation schema that accepts URLs with or without protocol
const urlSchema = z.string()
  .refine(val => {
    if (!val || val.trim() === '') return true;
    // Just basic validation, we'll format it properly before saving
    return val.includes('.');
  }, "Please enter a valid URL")
  .optional()
  .nullable()
  .transform(val => val === '' ? null : val);

// Date validation to ensure the user is at least 18 years old
const birthDateSchema = z.date().optional().refine(
  (date) => {
    if (!date) return true; // Optional, so null/undefined is valid
    const eighteenYearsAgo = subYears(new Date(), 18);
    return date <= eighteenYearsAgo;
  },
  {
    message: "You must be at least 18 years old."
  }
);

// Form schema
export const profileFormSchema = z.object({
  username: z.string().optional(),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  bio: z.string().max(500).optional(),
  gender: z.string().optional(),
  birthDate: birthDateSchema,
  websiteUrl: urlSchema,
  facebookUrl: urlSchema,
  instagramUrl: urlSchema,
  youtubeUrl: urlSchema,
  tiktokUrl: urlSchema,
});

export const useProfileForm = (
  user: any, 
  userProfile: any, 
  extendedProfile: ExtendedProfile | null,
  setExtendedProfile: (profile: ExtendedProfile | null) => void,
  setIsUpdating: (updating: boolean) => void
) => {
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: userProfile?.username || '',
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
    },
  });

  // Update the form with profile data when it becomes available
  React.useEffect(() => {
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

  const onProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    if (!user) return;
    
    setIsUpdating(true);
    console.log("Submitting profile data:", values);
    console.log("Birth date:", values.birthDate);
    
    try {
      // Validate birthdate
      if (values.birthDate) {
        const eighteenYearsAgo = subYears(new Date(), 18);
        if (values.birthDate > eighteenYearsAgo) {
          toast.error("You must be at least 18 years old");
          setIsUpdating(false);
          return;
        }
      }
      
      // Get current extended profile data to preserve other fields
      const currentExtendedProfile = extendedProfile || {};
      
      // Format URL fields to ensure they have proper http/https prefix
      const formattedValues = {
        ...values,
        websiteUrl: formatUrl(values.websiteUrl),
        facebookUrl: formatUrl(values.facebookUrl),
        instagramUrl: formatUrl(values.instagramUrl),
        youtubeUrl: formatUrl(values.youtubeUrl),
        tiktokUrl: formatUrl(values.tiktokUrl),
      };
      
      console.log("Formatted values:", formattedValues);
      
      // Merge with new values, preserving existing fields from other tabs
      const extendedData: ExtendedProfile = {
        ...currentExtendedProfile,
        firstName: formattedValues.firstName,
        lastName: formattedValues.lastName,
        bio: formattedValues.bio || null,
        gender: formattedValues.gender || null,
        birthDate: formattedValues.birthDate || null,
        websiteUrl: formattedValues.websiteUrl,
        facebookUrl: formattedValues.facebookUrl,
        instagramUrl: formattedValues.instagramUrl,
        youtubeUrl: formattedValues.youtubeUrl,
        tiktokUrl: formattedValues.tiktokUrl,
      };
      
      console.log("Saving extended data:", extendedData);
      
      // Use the updateProfileData service function
      const success = await updateProfileData(user.id, extendedData);
      
      if (success) {
        // Update local state
        setExtendedProfile(extendedData);
        
        // Show success notification
        toast.success('Profile updated successfully!');
        
        // Mark form as pristine to indicate data has been saved
        profileForm.reset(formattedValues, { keepValues: true });
      }
      
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error("Update Failed: " + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profileForm,
    onProfileSubmit
  };
};
