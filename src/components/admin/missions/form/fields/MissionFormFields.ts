
import { z } from 'zod';
import { Mission } from '@/lib/types';
import { MissionFormData } from '../../MissionFormSchema';

// Function to get default values for the form
export const getDefaultValues = (mission?: Mission): MissionFormData => {
  if (!mission) {
    return {
      title: '',
      description: '',
      pointsReward: 0,
      type: 'RECEIPT',
      status: 'DRAFT',
      startDate: new Date(),
      requirementDescription: '',
      merchantName: '',
      maxSubmissionsPerUser: 1,
      termsConditions: '',
      completionSteps: '',
      productDescription: '',
      faqContent: ''
    };
  }

  console.log('Loading mission for editing with FAQ:', {
    missionId: mission.id,
    title: mission.title,
    hasFAQ: !!mission.faqContent,
    faqContentPreview: mission.faqContent?.substring(0, 100)
  });

  return {
    title: mission.title,
    description: mission.description,
    pointsReward: mission.pointsReward,
    type: mission.type,
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
    faqContent: mission.faqContent || ''
  };
};
