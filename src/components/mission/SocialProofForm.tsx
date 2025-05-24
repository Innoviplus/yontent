
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mission } from '@/lib/types';
import { useSocialProofForm } from '@/hooks/mission/useSocialProofForm';
import { useSocialProofImageUpload } from '@/hooks/mission/useSocialProofImageUpload';
import SocialProofFormFields from './SocialProofFormFields';

interface SocialProofFormProps {
  mission: Mission;
  userId: string;
  onSubmissionComplete: (success: boolean) => void;
}

const SocialProofForm = ({ mission, userId, onSubmissionComplete }: SocialProofFormProps) => {
  const { form, isSubmitting, onSubmit } = useSocialProofForm({
    mission,
    userId,
    onSubmissionComplete
  });

  const {
    uploadedImages,
    imagePreviewUrls,
    uploading,
    error,
    handleFileSelect,
    handleRemoveImage,
    resetImages
  } = useSocialProofImageUpload({
    userId,
    missionId: mission.id,
    onImagesChange: (images) => form.setValue('proofImages', images)
  });

  const handleSubmit = async (data: any) => {
    const success = await onSubmit(data, uploadedImages);
    if (success) {
      form.reset();
      resetImages();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Upload Proof</h3>
      
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <SocialProofFormFields
          form={form}
          imagePreviewUrls={imagePreviewUrls}
          onFileSelect={handleFileSelect}
          onRemoveImage={handleRemoveImage}
          error={error}
          uploading={uploading}
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[150px] bg-brand-teal hover:bg-brand-teal/90 text-white"
          >
            {isSubmitting ? 'Submitting...' : 'Upload Proof'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SocialProofForm;
