
import { z } from 'zod';
import { subYears } from 'date-fns';

// URL validation schema that accepts URLs with or without protocol
export const urlSchema = z.string()
  .refine(val => {
    if (!val || val.trim() === '') return true;
    // Just basic validation, we'll format it properly before saving
    return val.includes('.');
  }, "Please enter a valid URL")
  .optional()
  .nullable()
  .transform(val => val === '' ? null : val);

// Date validation to ensure the user is at least 18 years old
export const birthDateSchema = z.date().optional()
  .refine(
    (date) => {
      if (!date) return true; // Optional, so null/undefined is valid
      
      const today = new Date();
      
      // Validate the date is not in the future
      if (date > today) {
        return false;
      }
      
      // Validate the person is at least 18
      const eighteenYearsAgo = subYears(today, 18);
      return date <= eighteenYearsAgo;
    },
    {
      message: "You must be at least 18 years old and date cannot be in the future."
    }
  );

// Phone number validation schema
export const phoneNumberSchema = z.string()
  .trim()
  .min(1, "Phone number is required")
  .regex(/^[0-9\s\-\+\(\)]+$/, "Invalid phone number format")
  .optional();

// Form schema
export const profileFormSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  bio: z.string().min(1, "Bio is required").max(500),
  gender: z.string().optional(),
  birthDate: birthDateSchema,
  websiteUrl: urlSchema,
  facebookUrl: urlSchema,
  instagramUrl: urlSchema,
  youtubeUrl: urlSchema,
  tiktokUrl: urlSchema,
  twitterUrl: urlSchema,
  phoneNumber: phoneNumberSchema,
  phoneCountryCode: z.string().optional(),
  country: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
