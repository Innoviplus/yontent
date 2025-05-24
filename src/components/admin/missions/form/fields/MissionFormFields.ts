
import { Mission } from '@/lib/types';
import { MissionFormData } from '../MissionFormSchema';

export const getDefaultValues = (mission?: Mission): MissionFormData => {
  if (!mission) {
    return {
      title: '',
      description: '',
      pointsReward: 100,
      type: 'SOCIAL_PROOF',
      status: 'DRAFT',
      startDate: new Date(),
      expiresAt: null,
      requirementDescription: '',
      merchantName: '',
      merchantLogo: '',
      bannerImage: '',
      maxSubmissionsPerUser: 1,
      totalMaxSubmissions: undefined,
      termsConditions: '',
      completionSteps: '',
      productDescription: '',
      productImages: [],
      faqContent: '',
    };
  }

  return {
    title: mission.title,
    description: mission.description,
    pointsReward: mission.pointsReward,
    type: mission.type as 'REVIEW' | 'RECEIPT' | 'SOCIAL_PROOF',
    status: mission.status,
    startDate: mission.startDate,
    expiresAt: mission.expiresAt,
    requirementDescription: mission.requirementDescription || '',
    merchantName: mission.merchantName || '',
    merchantLogo: mission.merchantLogo || '',
    bannerImage: mission.bannerImage || '',
    maxSubmissionsPerUser: mission.maxSubmissionsPerUser || 1,
    totalMaxSubmissions: mission.totalMaxSubmissions,
    termsConditions: mission.termsConditions || '',
    completionSteps: mission.completionSteps || '',
    productDescription: mission.productDescription || '',
    productImages: mission.productImages || [],
    faqContent: mission.faqContent || '',
  };
};
