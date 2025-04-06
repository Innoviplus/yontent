
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileData } from './useProfileData';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { ExtendedProfile } from '@/lib/types';

const profileFormSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().max(300, "Bio must be less than 300 characters").optional(),
  gender: z.string().optional(),
  birthDate: z.date().nullable().optional(),
  websiteUrl: z.string().url("Please enter a valid URL").or(z.literal('')).optional(),
  twitterUrl: z.string().url("Please enter a valid URL").or(z.literal('')).optional(),
  instagramUrl: z.string().url("Please enter a valid URL").or(z.literal('')).optional(),
  facebookUrl: z.string().url("Please enter a valid URL").or(z.literal('')).optional(),
  tiktokUrl: z.string().url("Please enter a valid URL").or(z.literal('')).optional(),
  youtubeUrl: z.string().url("Please enter a valid URL").or(z.literal('')).optional(),
  email: z.string().email("Please enter a valid email").optional(),
  phoneNumber: z.string().optional(),
  phoneCountryCode: z.string().optional(),
  country: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const useSettingsForm = () => {
  const { user, userProfile } = useAuth();
  const { updateProfileData, avatarUrl, uploading, handleAvatarUpload } = useProfileData();
  const [activeTab, setActiveTab] = useState('general');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      bio: "",
      gender: "",
      birthDate: null,
      websiteUrl: "",
      twitterUrl: "",
      instagramUrl: "",
      facebookUrl: "",
      tiktokUrl: "",
      youtubeUrl: "",
      email: user?.email || "",
      phoneNumber: "",
      phoneCountryCode: "",
      country: "",
    }
  });

  useEffect(() => {
    if (userProfile && userProfile.extended_data) {
      const profileData = userProfile.extended_data;
      
      form.reset({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        bio: profileData.bio || "",
        gender: profileData.gender || "",
        birthDate: profileData.birthDate ? new Date(profileData.birthDate) : null,
        websiteUrl: profileData.websiteUrl || "",
        twitterUrl: profileData.twitterUrl || "",
        instagramUrl: profileData.instagramUrl || "",
        facebookUrl: profileData.facebookUrl || "",
        tiktokUrl: profileData.tiktokUrl || "",
        youtubeUrl: profileData.youtubeUrl || "",
        email: profileData.email || user?.email || "",
        phoneNumber: userProfile.phone_number || "",
        phoneCountryCode: userProfile.phone_country_code || "",
        country: profileData.country || "",
      });
    }
  }, [userProfile, user, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const profileData: ExtendedProfile = {
        firstName: values.firstName,
        lastName: values.lastName,
        bio: values.bio,
        gender: values.gender,
        birthDate: values.birthDate,
        websiteUrl: values.websiteUrl,
        twitterUrl: values.twitterUrl,
        instagramUrl: values.instagramUrl,
        facebookUrl: values.facebookUrl,
        tiktokUrl: values.tiktokUrl,
        youtubeUrl: values.youtubeUrl,
        email: values.email,
        phoneNumber: values.phoneNumber,
        phoneCountryCode: values.phoneCountryCode,
        country: values.country,
      };

      const success = await updateProfileData(profileData);
      
      if (success) {
        sonnerToast.success('Your profile has been updated');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResetPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        user?.email || '',
        { redirectTo: `${window.location.origin}/reset-password` }
      );
      
      if (error) throw error;
      
      sonnerToast.success('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      toast({
        title: "Password Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    form,
    onSubmit,
    activeTab,
    setActiveTab,
    avatarUrl,
    uploading,
    handleAvatarUpload,
    handleResetPassword,
    isSubmitting
  };
};
