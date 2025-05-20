
import { z } from 'zod';

// Word count validation function
const validateWordCount = (text: string, minWords: number) => {
  // Strip HTML tags if present
  const plainText = text.replace(/<[^>]*>?/gm, '');
  
  // Split by whitespace and filter out empty strings
  const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length >= minWords;
};

// Form schema
export const reviewSchema = z.object({
  content: z
    .string()
    .min(20, { message: "Review must be at least 20 characters" })
    .refine((value) => validateWordCount(value, 50), {
      message: "Your review must contain at least 50 words to be submitted"
    })
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
