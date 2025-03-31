
import * as z from 'zod';

// Phone number regex validation
const phoneRegex = /^\d{6,15}$/;

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/\d/, 'Password must contain at least 1 number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least 1 special character'),
  phoneNumber: z.string().regex(phoneRegex, 'Please enter a valid phone number'),
  phoneCountryCode: z.string().min(2, 'Please select a country code'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
