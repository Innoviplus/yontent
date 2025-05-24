
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ImageUpload from '@/components/review/ImageUpload';
import { SocialProofFormData } from '@/hooks/mission/useSocialProofForm';

interface SocialProofFormFieldsProps {
  form: UseFormReturn<SocialProofFormData>;
  imagePreviewUrls: string[];
  onFileSelect: (files: FileList | null) => void;
  onRemoveImage: (index: number) => void;
  error: string | null;
  uploading: boolean;
}

const SocialProofFormFields = ({
  form,
  imagePreviewUrls,
  onFileSelect,
  onRemoveImage,
  error,
  uploading
}: SocialProofFormFieldsProps) => {
  return (
    <div className="space-y-6">
      {/* Proof Images Upload */}
      <div>
        <Label htmlFor="proofImages" className="text-sm font-medium">
          Upload Proof Images *
        </Label>
        <p className="text-sm text-gray-600 mb-2">
          Upload screenshots or photos that prove you completed the mission requirements.
        </p>
        <ImageUpload
          imagePreviewUrls={imagePreviewUrls}
          onFileSelect={onFileSelect}
          onRemoveImage={onRemoveImage}
          error={error}
          uploading={uploading}
          maxImages={5}
        />
        {form.formState.errors.proofImages && (
          <p className="text-sm text-red-600 mt-1">
            {form.formState.errors.proofImages.message}
          </p>
        )}
      </div>

      {/* Proof URL */}
      <div>
        <Label htmlFor="proofUrl" className="text-sm font-medium">
          Proof URL
        </Label>
        <p className="text-sm text-gray-600 mb-2">
          Provide the URL that shows your completed work (e.g., social media post URL, review page URL).
        </p>
        <Input
          id="proofUrl"
          type="url"
          placeholder="https://example.com/your-proof"
          {...form.register('proofUrl')}
        />
        {form.formState.errors.proofUrl && (
          <p className="text-sm text-red-600 mt-1">
            {form.formState.errors.proofUrl.message}
          </p>
        )}
      </div>

      {/* Additional Remarks */}
      <div>
        <Label htmlFor="additionalRemarks" className="text-sm font-medium">
          Additional Remarks
        </Label>
        <p className="text-sm text-gray-600 mb-2">
          Provide additional context, explanation, or any relevant details about your submission.
        </p>
        <Textarea
          id="additionalRemarks"
          placeholder="Describe how you completed the mission, any challenges faced, or additional proof details..."
          rows={4}
          {...form.register('additionalRemarks')}
        />
        {form.formState.errors.additionalRemarks && (
          <p className="text-sm text-red-600 mt-1">
            {form.formState.errors.additionalRemarks.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SocialProofFormFields;
