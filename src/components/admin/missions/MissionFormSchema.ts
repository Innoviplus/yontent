
import { z } from 'zod';

export const missionSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  pointsReward: z.coerce.number().int().positive({ message: 'Points must be a positive number' }),
  type: z.enum(['REVIEW', 'RECEIPT']).default('RECEIPT'),
  status: z.enum(['ACTIVE', 'DRAFT', 'COMPLETED']).default('DRAFT'),
  startDate: z.date(),
  expiresAt: z.date().optional(),
  requirementDescription: z.string().optional(),
  merchantName: z.string().optional(),
  merchantLogo: z.string().optional(),
  bannerImage: z.string().optional(),
  maxSubmissionsPerUser: z.coerce.number().int().positive({ message: 'Max submissions must be a positive number' }).default(1),
  totalMaxSubmissions: z.coerce.number().int().positive({ message: 'Total max submissions must be a positive number' }).optional(),
  termsConditions: z.string().optional(),
  completionSteps: z.string().optional(),
  productDescription: z.string().optional(),
  productImages: z.array(z.string()).optional(),
  _productImageFiles: z.any().optional(), // temporary field to hold File objects
});

export type MissionFormData = z.infer<typeof missionSchema>;
