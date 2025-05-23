
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
  extendedData.firstName = values.firstName;
  extendedData.lastName = values.lastName;
  extendedData.bio = values.bio;
  extendedData.gender = values.gender;
  extendedData.birthDate = values.birthDate;
  
  // Social media URLs - format if provided
  extendedData.websiteUrl = formatURL(values.websiteUrl);
  extendedData.facebookUrl = formatURL(values.facebookUrl);
  extendedData.instagramUrl = formatURL(values.instagramUrl);
  extendedData.youtubeUrl = formatURL(values.youtubeUrl);
  extendedData.tiktokUrl = formatURL(values.tiktokUrl);
  extendedData.twitterUrl = formatURL(values.twitterUrl);  // Add twitterUrl handling
  
  // Phone fields are stored directly in the profile table
  extendedData.phoneNumber = values.phoneNumber;
  extendedData.phoneCountryCode = values.phoneCountryCode;
  extendedData.country = values.country;  // Make sure country is included
  
  console.log("Formatted profile data:", extendedData);
  
  return extendedData;
};

/**
 * Format URL by ensuring it has proper protocol
 */
export const formatURL = (url: string | null | undefined): string | null => {
  if (!url || url.trim() === '') return null;
  
  // Remove any leading/trailing whitespace
  const trimmedUrl = url.trim();
  
  // Check if URL already has a protocol
  if (trimmedUrl.match(/^(https?:\/\/|ftp:\/\/)/i)) {
    return trimmedUrl;
  }
  
  // Add http:// as default protocol
  return `http://${trimmedUrl}`;
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
