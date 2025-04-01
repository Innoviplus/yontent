import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { useAvatarUpload } from './useAvatarUpload';

export const useProfileData = () => {
  const { user, userProfile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(userProfile?.avatar || null);
  const [uploading, setUploading] = useState(false);
  const [formValues, setFormValues] = useState({
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
    email: userProfile?.extended_data?.email || user?.email || '',
    phoneNumber: '',
    phoneCountryCode: ''
  });
  const { toast } = useToast();

  const { handleAvatarUpload } = useAvatarUpload(user, setAvatarUrl, setUploading);

  useEffect(() => {
    if (userProfile && userProfile.extended_data) {
      setFormValues({
        firstName: userProfile.extended_data.firstName || '',
        lastName: userProfile.extended_data.lastName || '',
        bio: userProfile.extended_data.bio || '',
        gender: userProfile.extended_data.gender || '',
        birthDate: userProfile.extended_data.birthDate ? new Date(userProfile.extended_data.birthDate) : null,
        websiteUrl: userProfile.extended_data.websiteUrl || '',
        twitterUrl: userProfile.extended_data.twitterUrl || '',
        instagramUrl: userProfile.extended_data.instagramUrl || '',
        facebookUrl: userProfile.extended_data.facebookUrl || '',
        tiktokUrl: userProfile.extended_data.tiktokUrl || '',
        youtubeUrl: userProfile.extended_data.youtubeUrl || '',
        email: userProfile.extended_data.email || user?.email || '',
        phoneNumber: userProfile.extended_data.phoneNumber || '',
        phoneCountryCode: userProfile.extended_data.phoneCountryCode || ''
      });
    }
  }, [userProfile, user]);

  const updateProfileData = async (updatedFormValues: typeof formValues) => {
    if (!user) return;

    try {
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

      const { error } = await supabase
        .from('profiles')
        .update({
          extended_data: extendedData,
        })
        .eq('id', user.id);

      if (error) throw error;

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
    if (!user) return;

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
