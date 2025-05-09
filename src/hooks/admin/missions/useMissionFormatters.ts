import { Mission } from '@/lib/types';
import { Tables } from '@/integrations/supabase/types';

export const useMissionFormatters = () => {
  const formatMissionFromDatabase = (mission: any): Mission => {
    // Format mission dates
    const startDate = mission.start_date ? new Date(mission.start_date) : new Date();
    const expiresAt = mission.expires_at ? new Date(mission.expires_at) : null;
    const createdAt = new Date(mission.created_at);
    const updatedAt = new Date(mission.updated_at);
    
    // Transform from snake_case to camelCase
    return {
      id: mission.id,
      title: mission.title,
      description: mission.description || '',
      pointsReward: mission.points_reward || 0,
      type: mission.type || 'REVIEW',
      status: mission.status || 'DRAFT',
      startDate,
      expiresAt,
      createdAt,
      updatedAt,
      requirementDescription: mission.requirement_description,
      merchantName: mission.merchant_name,
      merchantLogo: mission.merchant_logo,
      bannerImage: mission.banner_image,
      maxSubmissionsPerUser: mission.max_submissions_per_user || 1,
      totalMaxSubmissions: mission.total_max_submissions,
      termsConditions: mission.terms_conditions,
      completionSteps: mission.completion_steps,
      productDescription: mission.product_description,
      productImages: mission.product_images || [],
      faqContent: mission.faq_content,
      displayOrder: mission.display_order || 0
    };
  };

  // Format mission for database
  const formatMissionForDatabase = (mission: Partial<Mission>) => {
    const data: any = {
      title: mission.title,
      description: mission.description,
      points_reward: mission.pointsReward,
      type: mission.type,
      status: mission.status,
      start_date: mission.startDate?.toISOString(),
      expires_at: mission.expiresAt?.toISOString() || null,
      requirement_description: mission.requirementDescription,
      merchant_name: mission.merchantName,
      merchant_logo: mission.merchantLogo,
      banner_image: mission.bannerImage,
      max_submissions_per_user: mission.maxSubmissionsPerUser || 1,
      total_max_submissions: mission.totalMaxSubmissions,
      terms_conditions: mission.termsConditions,
      completion_steps: mission.completionSteps,
      product_description: mission.productDescription,
      product_images: mission.productImages || [],
      faq_content: mission.faqContent
    };
    
    // Only include displayOrder if explicitly set
    if (mission.displayOrder !== undefined) {
      data.display_order = mission.displayOrder;
    }
    
    return data;
  };

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
    if (updates.faqContent !== undefined) dbUpdates.faq_content = updates.faqContent;
    
    return dbUpdates;
  };

  return {
    formatMissionFromDatabase,
    formatMissionForDatabase,
    formatMissionUpdatesForDatabase
  };
};
