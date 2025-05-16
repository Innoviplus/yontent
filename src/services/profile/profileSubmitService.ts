
import { ExtendedProfile } from '@/lib/types';
import { toast } from 'sonner';
import { SettingsFormValues } from '@/schemas/settingsFormSchema';

export const prepareProfileData = (values: SettingsFormValues): ExtendedProfile => {
  // Create a profile data object from the form values
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

  console.log("[profileSubmitService] Prepared profile data:", profileData);
  return profileData;
};
