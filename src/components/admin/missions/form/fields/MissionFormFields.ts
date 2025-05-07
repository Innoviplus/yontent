
import { Mission } from "@/lib/types";
import { MissionFormData } from "../../MissionFormSchema";

// Helper function to get default values for the mission form based on an existing mission or default values
export const getDefaultValues = (mission?: Mission): MissionFormData => {
  if (mission) {
    return {
      title: mission.title,
      description: mission.description,
      pointsReward: mission.pointsReward,
      type: mission.type,
      status: mission.status,
      startDate: mission.startDate,
      expiresAt: mission.expiresAt === null ? null : mission.expiresAt,
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
      _productImageFiles: undefined,
      faqContent: mission.faqContent || '',
    };
  }

  // Default values for a new mission
  return {
    title: '',
    description: '',
    pointsReward: 100,
    type: 'RECEIPT',
    status: 'DRAFT',
    startDate: new Date(),
    expiresAt: undefined,
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
    _productImageFiles: undefined,
    faqContent: '',
  };
};
