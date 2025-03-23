
import { z } from 'zod';

export const rewardSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters' }),
  points_required: z.coerce.number().min(1, { message: 'Points must be at least 1' }),
  image_url: z.string().optional().or(z.literal('')),
  banner_image: z.string().optional().or(z.literal('')),
  is_active: z.boolean().default(true)
});

export type RewardFormData = z.infer<typeof rewardSchema>;
