
import { z } from 'zod';

export const rewardSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  points_required: z.coerce.number().int().positive({ message: 'Points must be a positive number' }),
  image_url: z.string().optional(),
  banner_image: z.string().optional(),
  is_active: z.boolean().default(true),
  terms_conditions: z.string().optional(),
  redemption_details: z.string().optional(),
  redemption_type: z.enum(['GIFT_VOUCHER', 'CASH']).default('GIFT_VOUCHER')
});

export type RewardFormData = z.infer<typeof rewardSchema>;
