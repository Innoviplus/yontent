
import { z } from 'zod';

export const phoneLoginSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const emailLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export type EmailLoginFormValues = z.infer<typeof emailLoginSchema>;
export type PhoneLoginFormValues = z.infer<typeof phoneLoginSchema>;
