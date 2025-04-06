
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsFormSchema, SettingsFormValues } from '@/schemas/settingsFormSchema';
import { useAuth } from '@/contexts/AuthContext';

export const useSettingsFormState = () => {
  const { user, userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
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

  // Initialize form with profile data when it becomes available
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

  return {
    form,
    isSubmitting,
    setIsSubmitting
  };
};
