
import { Mission } from '@/lib/types';
import { Tables } from '@/integrations/supabase/types';

export const useMissionFormatters = () => {
  const formatMissionFromDatabase = (mission: Tables<'missions'>): Mission => ({
    id: mission.id,
    title: mission.title,
    description: mission.description,
    pointsReward: mission.points_reward,
    type: mission.type as 'REVIEW' | 'RECEIPT',
    status: mission.status as 'ACTIVE' | 'COMPLETED' | 'DRAFT',
    merchantName: mission.merchant_name || undefined,
    merchantLogo: mission.merchant_logo || undefined,
    bannerImage: mission.banner_image || undefined,
    maxSubmissionsPerUser: mission.max_submissions_per_user || 1,
    totalMaxSubmissions: mission.total_max_submissions || undefined,
    termsConditions: mission.terms_conditions || undefined,
    requirementDescription: mission.requirement_description || undefined,
    startDate: new Date(mission.start_date),
    expiresAt: mission.expires_at ? new Date(mission.expires_at) : undefined,
    createdAt: new Date(mission.created_at),
    updatedAt: new Date(mission.updated_at),
    completionSteps: mission.completion_steps || undefined,
    productDescription: mission.product_description || undefined,
    productImages: mission.product_images || []
  });

  const formatMissionForDatabase = (mission: Omit<Mission, 'id' | 'createdAt' | 'updatedAt'>) => ({
    title: mission.title,
    description: mission.description,
    points_reward: mission.pointsReward,
    type: mission.type,
    status: mission.status,
    merchant_name: mission.merchantName,
    merchant_logo: mission.merchantLogo,
    banner_image: mission.bannerImage,
    max_submissions_per_user: mission.maxSubmissionsPerUser,
    total_max_submissions: mission.totalMaxSubmissions,
    terms_conditions: mission.termsConditions,
    requirement_description: mission.requirementDescription,
    start_date: mission.startDate.toISOString(),
    expires_at: mission.expiresAt ? mission.expiresAt.toISOString() : null,
    completion_steps: mission.completionSteps,
    product_description: mission.productDescription,
    product_images: mission.productImages || []
  });

  const formatMissionUpdatesForDatabase = (updates: Partial<Mission>) => {
    const dbUpdates: any = {};
    
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.pointsReward !== undefined) dbUpdates.points_reward = updates.pointsReward;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.merchantName !== undefined) dbUpdates.merchant_name = updates.merchantName;
    if (updates.merchantLogo !== undefined) dbUpdates.merchant_logo = updates.merchantLogo;
    if (updates.bannerImage !== undefined) dbUpdates.banner_image = updates.bannerImage;
    if (updates.maxSubmissionsPerUser !== undefined) dbUpdates.max_submissions_per_user = updates.maxSubmissionsPerUser;
    if (updates.totalMaxSubmissions !== undefined) dbUpdates.total_max_submissions = updates.totalMaxSubmissions;
    if (updates.termsConditions !== undefined) dbUpdates.terms_conditions = updates.termsConditions;
    if (updates.requirementDescription !== undefined) dbUpdates.requirement_description = updates.requirementDescription;
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate.toISOString();
    if (updates.expiresAt !== undefined) dbUpdates.expires_at = updates.expiresAt ? updates.expiresAt.toISOString() : null;
    if (updates.completionSteps !== undefined) dbUpdates.completion_steps = updates.completionSteps;
    if (updates.productDescription !== undefined) dbUpdates.product_description = updates.productDescription;
    if (updates.productImages !== undefined) dbUpdates.product_images = updates.productImages;
    
    return dbUpdates;
  };

  return {
    formatMissionFromDatabase,
    formatMissionForDatabase,
    formatMissionUpdatesForDatabase
  };
};
