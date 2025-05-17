
import { ExtendedProfile } from '@/lib/types';
import { formatURL } from './profileFormService';
import { SettingsFormValues } from '@/schemas/settingsFormSchema';

export const prepareProfileData = (values: SettingsFormValues): ExtendedProfile => {
  // Create a profile data object from the form values
  const profileData: ExtendedProfile = {
    firstName: values.firstName,
    lastName: values.lastName,
    bio: values.bio,
    gender: values.gender,
    birthDate: values.birthDate,
    websiteUrl: formatURL(values.websiteUrl),
    twitterUrl: formatURL(values.twitterUrl),
    instagramUrl: formatURL(values.instagramUrl),
    facebookUrl: formatURL(values.facebookUrl),
    tiktokUrl: formatURL(values.tiktokUrl),
    youtubeUrl: formatURL(values.youtubeUrl),
    email: values.email,
    phoneNumber: values.phoneNumber,
    phoneCountryCode: values.phoneCountryCode,
    country: values.country,
  };

  return profileData;
};
