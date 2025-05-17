
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
    if (userProfile) {
      form.reset({
        firstName: userProfile.first_name || "",
        lastName: userProfile.last_name || "",
        bio: userProfile.bio || "",
        gender: userProfile.gender || "",
        birthDate: userProfile.birth_date ? new Date(userProfile.birth_date) : null,
        websiteUrl: userProfile.website_url || "",
        twitterUrl: userProfile.twitter_url || "",
        instagramUrl: userProfile.instagram_url || "",
        facebookUrl: userProfile.facebook_url || "",
        tiktokUrl: userProfile.tiktok_url || "",
        youtubeUrl: userProfile.youtube_url || "",
        email: userProfile.email || user?.email || "",
        phoneNumber: userProfile.phone_number || "",
        phoneCountryCode: userProfile.phone_country_code || "",
        country: userProfile.country || "",
      });
    }
  }, [userProfile, user, form]);

  return {
    form,
    isSubmitting,
    setIsSubmitting
  };
};
