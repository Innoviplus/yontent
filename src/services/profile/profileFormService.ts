
import { ExtendedProfile } from '@/lib/types';
import { ProfileFormValues } from '@/schemas/profileFormSchema';
import { formatUrl } from '@/utils/urlUtils';
import { subYears } from 'date-fns';
import { toast } from 'sonner';

export const validateBirthDate = (birthDate: Date | undefined | null): boolean => {
  if (!birthDate) return true;
  
  const eighteenYearsAgo = subYears(new Date(), 18);
  return birthDate <= eighteenYearsAgo;
};

export const formatProfileFormValues = (
  values: ProfileFormValues,
  currentExtendedProfile: ExtendedProfile | null = {}
): ExtendedProfile => {
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
  return {
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
};
