
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ImageUpload from '@/components/review/ImageUpload';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Mission } from '@/lib/types';

const socialProofFormSchema = z.object({
  proofUrl: z.string().optional(),
  additionalRemarks: z.string().optional(),
  proofImages: z.array(z.string()).min(1, 'Please upload at least one proof image'),
});

type SocialProofFormData = z.infer<typeof socialProofFormSchema>;

interface SocialProofFormProps {
  mission: Mission;
  userId: string;
  onSubmissionComplete: (success: boolean) => void;
}

const SocialProofForm = ({ mission, userId, onSubmissionComplete }: SocialProofFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<SocialProofFormData>({
    resolver: zodResolver(socialProofFormSchema),
    defaultValues: {
      proofUrl: '',
      additionalRemarks: '',
      proofImages: [],
    },
  });

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];
      const previewUrls: string[] = [];

      for (const file of Array.from(files)) {
        // Create preview URL
        previewUrls.push(URL.createObjectURL(file));

        // Upload to Supabase
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `social-proof/${userId}/${mission.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('missions')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('missions')
          .getPublicUrl(filePath);

        uploadedUrls.push(data.publicUrl);
      }

      setUploadedImages(prev => [...prev, ...uploadedUrls]);
      setImagePreviewUrls(prev => [...prev, ...previewUrls]);
      form.setValue('proofImages', [...uploadedImages, ...uploadedUrls]);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      setError('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    const newUploadedImages = uploadedImages.filter((_, i) => i !== index);
    
    setImagePreviewUrls(newPreviewUrls);
    setUploadedImages(newUploadedImages);
    form.setValue('proofImages', newUploadedImages);
  };

  const onSubmit = async (data: SocialProofFormData) => {
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one proof image');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare submission data
      const submissionData = {
        proofUrl: data.proofUrl || '',
        additionalRemarks: data.additionalRemarks || '',
        proofImages: uploadedImages,
        submittedAt: new Date().toISOString(),
        type: 'SOCIAL_PROOF'
      };

      // Insert mission participation
      const { error: participationError } = await supabase
        .from('mission_participations')
        .insert({
          mission_id: mission.id,
          user_id_p: userId,
          status: 'PENDING',
          submission_data: submissionData
        });

      if (participationError) {
        throw participationError;
      }

      toast.success('Social proof submission completed successfully!');
      onSubmissionComplete(true);
      
      // Reset form
      form.reset();
      setUploadedImages([]);
      setImagePreviewUrls([]);
      
    } catch (error: any) {
      console.error('Error submitting social proof:', error);
      toast.error(error.message || 'Failed to submit social proof');
      onSubmissionComplete(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Upload Proof</h3>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            onFileSelect={handleFileSelect}
            onRemoveImage={handleRemoveImage}
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

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[150px]"
          >
            {isSubmitting ? 'Submitting...' : 'Upload Proof'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SocialProofForm;
