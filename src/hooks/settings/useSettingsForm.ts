import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileData } from './useProfileData';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

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
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const useSettingsForm = () => {
  const { user, userProfile } = useAuth();
  const { updateProfileData, avatarUrl, uploading, handleAvatarUpload } = useProfileData();
  const [activeTab, setActiveTab] = useState('general');
  const navigate = useNavigate();

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
      });
    }
  }, [userProfile, user, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    const success = await updateProfileData({
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
    });

    if (success) {
      navigate('/settings');
    }
  };

  return {
    form,
    onSubmit,
    activeTab,
    setActiveTab,
    avatarUrl,
    uploading,
    handleAvatarUpload
  };
};
