import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { ExtendedProfile } from '@/lib/types';
import React from 'react';

// Form schema
export const profileFormSchema = z.object({
  username: z.string().optional(),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  bio: z.string().max(500).optional(),
  gender: z.string().optional(),
  birthDate: z.date().optional(),
  websiteUrl: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
  facebookUrl: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
  instagramUrl: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
  youtubeUrl: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
  tiktokUrl: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
});

export const useProfileForm = (
  user: any, 
  userProfile: any, 
  extendedProfile: ExtendedProfile | null,
  setExtendedProfile: (profile: ExtendedProfile | null) => void,
  setIsUpdating: (updating: boolean) => void
) => {
  const { toast } = useToast();

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
      
      profileForm.reset({
        username: userProfile.username || '',
        firstName: extData.firstName || '',
        lastName: extData.lastName || '',
        bio: extData.bio || '',
        gender: extData.gender || '',
        birthDate: extData.birthDate ? new Date(extData.birthDate) : undefined,
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
    
    try {
      // Prepare extended data object
      const extendedData: ExtendedProfile = {
        firstName: values.firstName,
        lastName: values.lastName,
        bio: values.bio || null,
        gender: values.gender || null,
        birthDate: values.birthDate || null,
        websiteUrl: values.websiteUrl || null,
        facebookUrl: values.facebookUrl || null,
        instagramUrl: values.instagramUrl || null,
        youtubeUrl: values.youtubeUrl || null,
        tiktokUrl: values.tiktokUrl || null,
        phoneNumber: extendedProfile?.phoneNumber || null,
        country: extendedProfile?.country || null,
      };
      
      // Convert ExtendedProfile to a plain object for storage
      const jsonData = Object.fromEntries(
        Object.entries(extendedData).map(([key, value]) => [key, value])
      );
      
      // Update the profile with extended data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ extended_data: jsonData })
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Update local state
      setExtendedProfile(extendedData);
      
      // Show success notification
      sonnerToast.success('Profile updated successfully!');
      
      // Mark form as pristine to indicate data has been saved
      profileForm.reset(values, { keepValues: true });
      
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profileForm,
    onProfileSubmit
  };
};
