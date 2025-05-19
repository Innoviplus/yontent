
import { useState, useEffect } from 'react';
import { Mission } from '@/lib/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/review/ImageUpload';
import ReviewFormButtons from './ReviewFormButtons';
import { useReviewSubmission } from './useReviewSubmission';

interface MissionReviewFormProps {
  mission: Mission;
  userId: string;
}

const MissionReviewForm = ({ mission, userId }: MissionReviewFormProps) => {
  const {
    form,
    isSubmitting,
    imagePreviewUrls,
    imageError,
    handleImageSelection,
    removeImage,
    onSubmit
  } = useReviewSubmission(mission, userId);

  const [wordCount, setWordCount] = useState(0);

  // Calculate word count whenever content changes
  useEffect(() => {
    const content = form.watch('content') || '';
    const plainText = content.replace(/<[^>]*>?/gm, '');
    const words = plainText.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [form.watch('content')]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ImageUpload
          imagePreviewUrls={imagePreviewUrls}
          onFileSelect={handleImageSelection}
          onRemoveImage={removeImage}
          error={imageError}
          uploading={isSubmitting}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Review</FormLabel>
                <span className={`text-xs ${wordCount < 100 ? 'text-red-500' : 'text-green-500'}`}>
                  {wordCount} / 100 words {wordCount < 100 ? 'required' : '✓'}
                </span>
              </div>
              <FormControl>
                <Textarea 
                  {...field}
                  placeholder="Share your experience with the product (minimum 100 words required)..."
                  className="min-h-[200px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <ReviewFormButtons 
          isSubmitting={isSubmitting} 
          missionId={mission.id} 
        />
      </form>
    </Form>
  );
};

export default MissionReviewForm;
