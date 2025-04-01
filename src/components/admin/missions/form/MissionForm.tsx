
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Mission } from '@/lib/types';
import { missionSchema, MissionFormData } from '../MissionFormSchema';
import BasicInformation from './sections/BasicInformation';
import TimelineSection from './sections/TimelineSection';
import BrandInformation from './sections/BrandInformation';
import AdditionalDetails from './sections/AdditionalDetails';
import { getDefaultValues } from './fields/MissionFormFields';

interface MissionFormProps {
  mission?: Mission;
  title: string;
  onSubmit: (data: MissionFormData, files: { merchantLogo?: File | null, bannerImage?: File | null }) => Promise<boolean>;
  onCancel: () => void;
  isUploading?: boolean;
}

const MissionForm = ({ 
  mission, 
  title, 
  onSubmit, 
  onCancel,
  isUploading = false
}: MissionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [merchantLogoFile, setMerchantLogoFile] = useState<File | null>(null);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  
  // Initialize form with default values
  const form = useForm<MissionFormData>({
    resolver: zodResolver(missionSchema),
    defaultValues: getDefaultValues(mission)
  });

  const handleSubmit = async (data: MissionFormData) => {
    setIsSubmitting(true);
    try {
      const success = await onSubmit(data, {
        merchantLogo: merchantLogoFile,
        bannerImage: bannerImageFile
      });
      if (success) {
        form.reset();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill in the details for this mission.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <BasicInformation form={form} />
            <TimelineSection form={form} />
            <BrandInformation 
              form={form} 
              setMerchantLogoFile={setMerchantLogoFile}
              merchantLogoFile={merchantLogoFile}
              setBannerImageFile={setBannerImageFile}
              bannerImageFile={bannerImageFile}
            />
            <AdditionalDetails form={form} />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {(isSubmitting || isUploading) ? 'Saving...' : 'Save Mission'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MissionForm;
