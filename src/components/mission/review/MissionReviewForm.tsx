
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Mission } from '@/lib/types';
import { reviewSchema, type ReviewFormValues } from './ReviewFormSchema';
import { useReviewSubmission } from './useReviewSubmission';
import ImageUpload from '@/components/review/ImageUpload';
import VideoUpload from '@/components/review/VideoUpload';

interface MissionReviewFormProps {
  mission: Mission;
  userId: string;
  onSubmissionComplete?: (success: boolean) => void;
}

const MissionReviewForm = ({ mission, userId, onSubmissionComplete }: MissionReviewFormProps) => {
  const navigate = useNavigate();
  
  const {
    form,
    isSubmitting,
    imagePreviewUrls,
    imageError,
    videoPreviewUrl,
    videoError,
    handleImageSelection,
    removeImage,
    handleVideoSelection,
    removeVideo,
    onSubmit
  } = useReviewSubmission(mission, userId);

  const handleCancel = () => {
    navigate(`/mission/${mission.id}`);
  };

  const handleSubmitSuccess = (success: boolean) => {
    if (success) {
      onSubmissionComplete?.(true);
    } else {
      onSubmissionComplete?.(false);
    }
  };

  const handleFormSubmit = async (values: ReviewFormValues) => {
    await onSubmit(values);
    handleSubmitSuccess(true);
  };

  // Create a wrapper function for removeVideo that matches the expected signature
  const handleRemoveVideo = () => {
    removeVideo(0);
  };

  // Function to count words in text
  const countWords = (text: string) => {
    if (!text || text.trim().length === 0) return 0;
    // Strip HTML tags if present and split by whitespace
    const plainText = text.replace(/<[^>]*>?/gm, '');
    const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Image Upload Section */}
        <ImageUpload
          imagePreviewUrls={imagePreviewUrls}
          onFileSelect={handleImageSelection}
          onRemoveImage={removeImage}
          error={imageError}
          uploading={isSubmitting}
          maxImages={12}
        />

        {/* Video Upload Section */}
        <VideoUpload
          videoPreviewUrls={videoPreviewUrl ? [videoPreviewUrl] : []}
          onFileSelect={handleVideoSelection}
          onRemoveVideo={handleRemoveVideo}
          error={videoError}
          uploading={isSubmitting}
        />

        {/* Review Text Content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience with the product (minimum 50 words required)..."
                  className="min-h-[120px] resize-y"
                  {...field}
                />
              </FormControl>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{countWords(field.value || '')} / 50 words required</span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Buttons */}
        <div className="flex justify-end space-x-4">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isSubmitting}
            type="button"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-brand-teal hover:bg-brand-teal/90"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MissionReviewForm;
