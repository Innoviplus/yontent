
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form schema with isDraft property
export const reviewFormSchema = z.object({
  content: z.string().min(10, { message: "Review must be at least 10 characters" }),
  isDraft: z.boolean().optional().default(false)
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export const useReviewForm = () => {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      content: '',
      isDraft: false
    },
  });

  return {
    form
  };
};
