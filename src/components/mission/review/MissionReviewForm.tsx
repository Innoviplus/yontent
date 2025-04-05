
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
              <FormLabel>Review</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  placeholder="Share your experience with the product..."
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
