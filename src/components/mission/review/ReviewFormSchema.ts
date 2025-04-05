
import { z } from 'zod';

// Form schema
export const reviewSchema = z.object({
  content: z.string().min(20, { message: "Review must be at least 20 characters" }),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
