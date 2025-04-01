
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { useAvatarUpload } from './useAvatarUpload';

interface ProfileFormValues {
  firstName?: string;
  lastName?: string;
  bio?: string;
  gender?: string;
  birthDate?: Date | null;
  websiteUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  email?: string;
  phoneNumber?: string;
  phoneCountryCode?: string;
}

export const useProfileData = () => {
  const { user, userProfile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(userProfile?.avatar || null);
  const [uploading, setUploading] = useState(false);
  const [formValues, setFormValues] = useState<ProfileFormValues>({
    firstName: '',
    lastName: '',
    bio: '',
    gender: '',
    birthDate: null,
    websiteUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    facebookUrl: '',
    tiktokUrl: '',
    youtubeUrl: '',
    email: user?.email || '',
    phoneNumber: '',
    phoneCountryCode: ''
  });
  const { toast } = useToast();

  const { handleAvatarUpload } = useAvatarUpload(user, setAvatarUrl, setUploading);

  useEffect(() => {
    if (userProfile) {
      // Safely handle the avatar
      setAvatarUrl(userProfile.avatar || null);
      
      // Check if extended_data exists and is valid
      if (userProfile.extended_data && typeof userProfile.extended_data === 'object') {
        const extData = userProfile.extended_data;
        setFormValues({
          firstName: extData.firstName || '',
          lastName: extData.lastName || '',
          bio: extData.bio || '',
          gender: extData.gender || '',
          birthDate: extData.birthDate ? new Date(extData.birthDate) : null,
          websiteUrl: extData.websiteUrl || '',
          twitterUrl: extData.twitterUrl || '',
          instagramUrl: extData.instagramUrl || '',
          facebookUrl: extData.facebookUrl || '',
          tiktokUrl: extData.tiktokUrl || '',
          youtubeUrl: extData.youtubeUrl || '',
          email: extData.email || user?.email || '',
          phoneNumber: userProfile.phone_number || '',
          phoneCountryCode: userProfile.phone_country_code || ''
        });
      }
    }
  }, [userProfile, user]);

  const updateProfileData = async (updatedFormValues: ProfileFormValues) => {
    if (!user) return false;

    try {
      // Update extended data
      const extendedData = {
        firstName: updatedFormValues.firstName,
        lastName: updatedFormValues.lastName,
        bio: updatedFormValues.bio,
        gender: updatedFormValues.gender,
        birthDate: updatedFormValues.birthDate,
        websiteUrl: updatedFormValues.websiteUrl,
        twitterUrl: updatedFormValues.twitterUrl,
        instagramUrl: updatedFormValues.instagramUrl,
        facebookUrl: updatedFormValues.facebookUrl,
        tiktokUrl: updatedFormValues.tiktokUrl, 
        youtubeUrl: updatedFormValues.youtubeUrl,
        email: updatedFormValues.email || user.email,
      };

      // Update phone number if provided
      if (updatedFormValues.phoneNumber || updatedFormValues.phoneCountryCode) {
        const { error: phoneError } = await supabase
          .from('profiles')
          .update({
            phone_number: updatedFormValues.phoneNumber,
            phone_country_code: updatedFormValues.phoneCountryCode,
            extended_data: extendedData
          })
          .eq('id', user.id);

        if (phoneError) throw phoneError;
      } else {
        // Just update the extended data
        const { error } = await supabase
          .from('profiles')
          .update({
            extended_data: extendedData,
          })
          .eq('id', user.id);

        if (error) throw error;
      }

      sonnerToast.success('Profile updated successfully!');
      return true;
    } catch (error: any) {
      toast({
        title: "Error Updating Profile",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const updatePhoneData = async (phoneNumber: string, countryCode: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          phone_number: phoneNumber,
          phone_country_code: countryCode,
        })
        .eq('id', user.id);

      if (error) throw error;

      sonnerToast.success('Phone number updated successfully!');
      return true;
    } catch (error: any) {
      toast({
        title: "Error Updating Phone Number",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    avatarUrl,
    uploading,
    formValues,
    setFormValues,
    updateProfileData,
    updatePhoneData,
    handleAvatarUpload
  };
};
