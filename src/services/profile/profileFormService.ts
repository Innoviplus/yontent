
import { ExtendedProfile } from '@/lib/types';
import { subYears } from 'date-fns';
import { ProfileFormValues } from '@/schemas/profileFormSchema';

/**
 * Format form values for saving to the database
 */
export const formatProfileFormValues = (values: ProfileFormValues, currentExtendedProfile: ExtendedProfile): ExtendedProfile => {
  // Copy existing extended data if available
  const extendedData: ExtendedProfile = { ...currentExtendedProfile };
  
  // Update with new values
  extendedData.firstName = values.firstName || null;
  extendedData.lastName = values.lastName || null;
  extendedData.bio = values.bio || null;
  extendedData.gender = values.gender || null;
  extendedData.birthDate = values.birthDate || null;
  
  // Social media URLs - format if provided
  extendedData.websiteUrl = formatURL(values.websiteUrl);
  extendedData.facebookUrl = formatURL(values.facebookUrl);
  extendedData.instagramUrl = formatURL(values.instagramUrl);
  extendedData.youtubeUrl = formatURL(values.youtubeUrl);
  extendedData.tiktokUrl = formatURL(values.tiktokUrl);
  
  // Phone fields are stored directly in the profile table, not in extended_data
  extendedData.phoneNumber = values.phoneNumber || null;
  extendedData.phoneCountryCode = values.phoneCountryCode || null;
  
  console.log("Formatted extended profile data:", extendedData);
  
  return extendedData;
};

/**
 * Format URL by ensuring it has proper protocol
 */
const formatURL = (url: string | null | undefined): string | null => {
  if (!url || url.trim() === '') return null;
  
  // Check if URL already has a protocol
  if (url.match(/^(https?:\/\/|ftp:\/\/)/i)) {
    return url;
  }
  
  // Add http:// as default protocol
  return `http://${url}`;
};

/**
 * Validate if a birth date meets the minimum age requirement
 */
export const validateBirthDate = (birthDate: Date | null | undefined): boolean => {
  if (!birthDate) return true;
  
  const today = new Date();
  const eighteenYearsAgo = subYears(today, 18);
  
  return birthDate <= eighteenYearsAgo;
};
