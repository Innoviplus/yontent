
import { z } from 'zod';

export const settingsFormSchema = z.object({
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

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
