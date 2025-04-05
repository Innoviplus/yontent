
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Mission } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ImageUpload from '@/components/review/ImageUpload';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload } from 'lucide-react';

// Form schema
const reviewSchema = z.object({
  content: z.string().min(20, { message: "Review must be at least 20 characters" }),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface MissionReviewFormProps {
  mission: Mission;
  userId: string;
}

const MissionReviewForm = ({ mission, userId }: MissionReviewFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      content: '',
    },
  });
  
  const handleImageSelection = (files: FileList | null) => {
    if (!files) return;
    
    if (selectedImages.length + files.length > 10) {
      setImageError('You can only upload up to 10 images in total');
      return;
    }
    
    const newFiles = Array.from(files);
    setSelectedImages(prev => [...prev, ...newFiles]);
    
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    
    setImageError(null);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: ReviewFormValues) => {
    if (selectedImages.length === 0) {
      setImageError('Please upload at least one image');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload each image to Supabase storage
      const uploadedUrls: string[] = [];
      
      for (const file of selectedImages) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `reviews/${userId}/${mission.id}/${fileName}`;
        
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
      
      // Create a review in the reviews table
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .insert({
          user_id: userId,
          content: values.content,
          images: uploadedUrls,
          status: 'PUBLISHED'
        })
        .select('id')
        .single();
        
      if (reviewError) throw reviewError;
      
      // Save the participation record with the review ID
      const { error: insertError } = await supabase
        .from('mission_participations')
        .insert({
          mission_id: mission.id,
          user_id: userId,
          status: 'PENDING',
          submission_data: {
            review_id: reviewData.id,
            review_images: uploadedUrls,
            submission_type: 'REVIEW'
          }
        });
        
      if (insertError) throw insertError;
      
      toast.success('Review submitted successfully!');
      navigate(`/mission/${mission.id}`);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        
        <div className="flex justify-end space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/mission/${mission.id}`)}
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
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MissionReviewForm;
