
import { useRef } from 'react';
import { MissionFormData } from '../../MissionFormSchema';

interface MissionFormFieldsProps {
  merchantLogoFile: File | null;
  setMerchantLogoFile: React.Dispatch<React.SetStateAction<File | null>>;
  bannerImageFile: File | null;
  setBannerImageFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export const useMissionFormFields = ({
  merchantLogoFile,
  setMerchantLogoFile,
  bannerImageFile,
  setBannerImageFile
}: MissionFormFieldsProps) => {
  const merchantLogoRef = useRef<HTMLInputElement>(null);
  const bannerImageRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return {
    merchantLogoRef,
    bannerImageRef,
    handleFileChange,
  };
};

export const getDefaultValues = (mission?: any): MissionFormData => ({
  title: mission?.title || '',
  description: mission?.description || '',
  pointsReward: mission?.pointsReward || 100,
  type: mission?.type || 'RECEIPT',
  status: mission?.status || 'DRAFT',
  startDate: mission?.startDate ? new Date(mission.startDate) : new Date(),
  expiresAt: mission?.expiresAt ? new Date(mission.expiresAt) : undefined,
  requirementDescription: mission?.requirementDescription || '',
  merchantName: mission?.merchantName || '',
  merchantLogo: mission?.merchantLogo || '',
  bannerImage: mission?.bannerImage || '',
  maxSubmissionsPerUser: mission?.maxSubmissionsPerUser || 1,
  totalMaxSubmissions: mission?.totalMaxSubmissions || undefined,
  termsConditions: mission?.termsConditions || '',
  completionSteps: mission?.completionSteps || '',
  productDescription: mission?.productDescription || '',
  productImages: mission?.productImages || []
});
